import * as graph from "../../zone-graph.json";

interface Node {
  lat: number;
  lng: number;
  name?: string;
}

interface Edge {
  from: string;
  to: string;
  distance: number; // meters
  hazardScore?: number;
  segmentId?: string;
}

// Haversine distance in meters (for heuristic)
function haversine(a: Node, b: Node): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aH =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(aH), Math.sqrt(1 - aH));
  return R * c;
}

// Edge cost = distance * (1 + 0.2 * hazardScore)
function edgeCost(edge: Edge, safeStopNodes?: Set<string>): number {
  let cost = edge.distance;
  // Hazard penalty
  if (edge.hazardScore) {
    cost *= (1 + 0.2 * edge.hazardScore);
  }
  // SafeStop bonus: if the edge touches a SafeStop, reduce cost by 30%
  if (safeStopNodes && (safeStopNodes.has(edge.from) || safeStopNodes.has(edge.to))) {
    cost *= 0.7;
  }
  return cost;
}

// Build adjacency list from graph
function buildAdjacency(): Map<string, { nodeId: string; edge: Edge }[]> {
  const adj = new Map<string, { nodeId: string; edge: Edge }[]>();
  const edges: Edge[] = (graph as any).edges;
  for (const edge of edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from)!.push({ nodeId: edge.to, edge });
    // Bidirectional (assuming walking)
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    adj.get(edge.to)!.push({ nodeId: edge.from, edge });
  }
  return adj;
}

// A* search
export function findRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  avoidHazards: boolean = true
): { path: Node[]; edges: Edge[]; totalDistance: number; totalHazard: number } | null {
  const nodes: Record<string, Node> = (graph as any).nodes;
const safeStopNodeIds = new Set<string>();
for (const [id, node] of Object.entries(nodes)) {
  if (node.name) safeStopNodeIds.add(id);
}
  const adj = buildAdjacency();

  // Find nearest graph node to start/end
  let startNode: string | null = null;
  let endNode: string | null = null;
  let minStartDist = Infinity;
  let minEndDist = Infinity;

  for (const [id, node] of Object.entries(nodes)) {
    const distToStart = haversine(
      { lat: startLat, lng: startLng },
      node
    );
    if (distToStart < minStartDist) {
      minStartDist = distToStart;
      startNode = id;
    }
    const distToEnd = haversine(
      { lat: endLat, lng: endLng },
      node
    );
    if (distToEnd < minEndDist) {
      minEndDist = distToEnd;
      endNode = id;
    }
  }

  if (!startNode || !endNode) return null;

  // A* algorithm
  const openSet = new Set<string>();
  openSet.add(startNode);

  const cameFrom = new Map<string, { nodeId: string; edge: Edge }>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  for (const id of Object.keys(nodes)) {
    gScore.set(id, Infinity);
    fScore.set(id, Infinity);
  }
  gScore.set(startNode, 0);
  fScore.set(startNode, haversine(nodes[startNode]!, nodes[endNode]!));

  while (openSet.size > 0) {
    // Find node with lowest fScore
    let current: string | null = null;
    let minF = Infinity;
    for (const id of openSet) {
      const f = fScore.get(id) ?? Infinity;
      if (f < minF) {
        minF = f;
        current = id;
      }
    }
    if (current === endNode || !current) break;

    openSet.delete(current);

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      const edge = neighbor.edge;
      const cost = avoidHazards ? edgeCost(edge, safeStopNodeIds) : edge.distance;
      const tentativeG = (gScore.get(current) ?? Infinity) + cost;
      if (tentativeG < (gScore.get(neighbor.nodeId) ?? Infinity)) {
        cameFrom.set(neighbor.nodeId, { nodeId: current, edge });
        gScore.set(neighbor.nodeId, tentativeG);
        fScore.set(
          neighbor.nodeId,
          tentativeG + haversine(nodes[neighbor.nodeId]!, nodes[endNode]!)
        );
        openSet.add(neighbor.nodeId);
      }
    }
  }

  // Reconstruct path
  const pathNodes: Node[] = [];
  const pathEdges: Edge[] = [];
  let current = endNode;
  while (current !== startNode) {
    const prev = cameFrom.get(current);
    if (!prev) return null; // no path
    pathNodes.unshift(nodes[current]!);
    pathEdges.unshift(prev.edge);
    current = prev.nodeId;
  }
  pathNodes.unshift(nodes[startNode]!);

  const totalDistance = pathEdges.reduce((sum, e) => sum + e.distance, 0);
  const totalHazard = pathEdges.reduce((sum, e) => sum + (e.hazardScore || 0), 0);

  return { path: pathNodes, edges: pathEdges, totalDistance, totalHazard };
}
