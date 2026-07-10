import fs from "fs";

// Read the OSM data from the file we already downloaded
const osmData = JSON.parse(fs.readFileSync("osm-data.json", "utf-8"));

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aH = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  const c = 2 * Math.atan2(Math.sqrt(aH), Math.sqrt(1 - aH));
  return R * c;
}

function buildGraph(osm: any) {
  const nodeMap = new Map<number, { lat: number; lng: number }>();
  const ways: any[] = [];

  for (const el of osm.elements) {
    if (el.type === "node") {
      nodeMap.set(el.id as number, { lat: el.lat as number, lng: el.lon as number });
    } else if (el.type === "way") {
      ways.push(el);
    }
  }

  const nodes: Record<string, { lat: number; lng: number }> = {};
  const edges: { from: string; to: string; distance: number; hazardScore: number; segmentId?: string }[] = [];
  const addedNodes = new Set<number>();

  function getNodeId(id: number): string {
    return `n${id}`;
  }

  for (const way of ways) {
    const nodeIds: number[] = way.nodes as number[];
    if (nodeIds.length < 2) continue;

    for (const nodeId of nodeIds) {
      if (!addedNodes.has(nodeId)) {
        const n = nodeMap.get(nodeId);
        if (n) {
          nodes[getNodeId(nodeId)] = { lat: n.lat, lng: n.lng };
          addedNodes.add(nodeId);
        }
      }
    }

    for (let i = 1; i < nodeIds.length; i++) {
      const prevId = nodeIds[i - 1]!;
      const currId = nodeIds[i]!;
      const prevNode = nodeMap.get(prevId)!;
      const currNode = nodeMap.get(currId)!;
      if (prevNode && currNode) {
        const dist = haversine(prevNode, currNode);
        const hazard = (way.tags && way.tags.lit === "no") ? 2 : 0;
        edges.push({
          from: getNodeId(prevId),
          to: getNodeId(currId),
          distance: dist,
          hazardScore: hazard,
        });
      }
    }
  }

  return { nodes, edges };
}

(async function main() {
  console.log(`OSM data loaded. Elements: ${osmData.elements.length}`);
  const graph = buildGraph(osmData);
  console.log(`Graph built: ${Object.keys(graph.nodes).length} nodes, ${graph.edges.length} edges`);

  fs.writeFileSync("zone-graph.json", JSON.stringify(graph, null, 2));
  console.log("zone-graph.json saved. Restart server to use it.");
})();
