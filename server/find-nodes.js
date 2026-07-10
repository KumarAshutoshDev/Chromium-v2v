const graph = require('./zone-graph.json');
const coords = [[77.5947137,12.9716564],[77.5948264,12.9716117],[77.5949903,12.9715583],[77.5950091,12.9716014],[77.5950181,12.9716523],[77.5950224,12.9716747],[77.5950442,12.971723],[77.5951136,12.971694],[77.5951284,12.9717279],[77.5952956,12.9716627],[77.5953032,12.971681],[77.5953218,12.971728],[77.5953161,12.971759],[77.5957141,12.9725726],[77.5959071,12.972519],[77.5960359,12.9725779],[77.5961325,12.9726668],[77.596221,12.9728079],[77.5962344,12.9728916],[77.5962102,12.9730406],[77.5961378,12.9731582]];
const nodes = graph.nodes;
const matches = [];
for (const c of coords) {
  let closest = null;
  let minDist = Infinity;
  for (const id of Object.keys(nodes)) {
    const node = nodes[id];
    if (!node) continue;
    const d = Math.sqrt((node.lng - c[0])**2 + (node.lat - c[1])**2);
    if (d < minDist) { minDist = d; closest = id; }
  }
  if (closest) matches.push(closest);
}
console.log('Node IDs on route:', [...new Set(matches)]);
