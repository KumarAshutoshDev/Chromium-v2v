const fs = require('fs');
const graph = require('./zone-graph.json');

// Node IDs in order on the route
const routeNodeIds = [
  'n10086861526', 'n11022205623', 'n10086861528', 'n11425338155',
  'n11022205622', 'n11425338154', 'n10595455527', 'n10060517398',
  'n12558269344', 'n12558269330', 'n11425338163', 'n11078621095',
  'n4960830670',  'n1557709035', 'n6573902917', 'n6573902918',
  'n6573902919',  'n6573902920', 'n6573902921', 'n6573902922', 'n6573902923'
];

let foundCount = 0;
for (let i = 0; i < routeNodeIds.length - 1; i++) {
  const from = routeNodeIds[i];
  const to = routeNodeIds[i+1];
  const edge = graph.edges.find(e => 
    (e.from === from && e.to === to) || (e.from === to && e.to === from)
  );
  if (edge) {
    edge.hazardScore = 1000;   // huge penalty
    console.log(`Edge ${from} → ${to} now has hazardScore 1000`);
    foundCount++;
    if (foundCount >= 5) break;
  }
}

if (foundCount > 0) {
  fs.writeFileSync('zone-graph.json', JSON.stringify(graph, null, 2));
  console.log(`zone-graph.json updated – marked ${foundCount} edges with extreme hazard.`);
} else {
  console.log('No matching edges found.');
}
