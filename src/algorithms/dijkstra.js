/*This function applies Dijkstra's algorithm and returns a list of all nodes in the order that they were visited during the algorithm. 
It also modifies the nodes so that they each point to the node that came before them in the traversal. 
This allows us to determine the shortest path between two nodes by starting at the end node 
and following the chain of previous nodes back to the start.*/

/*To clarify, Dijkstra's algorithm is a method for finding the shortest path between nodes in a graph. 
It starts by assigning a tentative distance to all nodes and selecting the node with the smallest distance as the current node. 
It then updates the distance to all adjacent nodes, marks the current node as visited, 
and selects the next unvisited node with the smallest distance. 
This process continues until all nodes have been visited or the target node is reached.*/
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return { visitedNodesInOrder, nodesVisited: visitedNodesInOrder.length };
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return { visitedNodesInOrder, nodesVisited: visitedNodesInOrder.length };
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

/*This function traces back from the finish node to find the shortest path. 
It should only be called after the Dijkstra algorithm has been run.*/
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}