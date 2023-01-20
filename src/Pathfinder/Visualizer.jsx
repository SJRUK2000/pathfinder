import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './Visualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 40;

export default class Visualizer extends Component {
  constructor() {
  super();
  this.state = {
    grid: [],
    mouseIsPressed: false,
    nodesVisited: 0,
    shortestPathLength: 0,
  };
}

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

visualizeDijkstra() {
  const {grid} = this.state;
  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
  const result = dijkstra(grid, startNode, finishNode);
  const visitedNodesInOrder = result.visitedNodesInOrder;
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  this.setState({
    nodesVisited: result.nodesVisited,
    shortestPathLength: nodesInShortestPathOrder.length,
  });
  this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
}
generateRandomWalls() {
    const { grid } = this.state;
    const newGrid = grid.slice();
    for (let row = 0; row < newGrid.length; row++) {
        for (let col = 0; col < newGrid[0].length; col++) {
            if (Math.random() < 0.2) {
                const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
                this.setState({ grid: newGrid });
            }
        }
    }
}
    reset() {
        this.clearPath(); // Call the clearPath method
        const grid = getInitialGrid();
        this.setState({ grid });
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        document.getElementById(`node-${startNode.row}-${startNode.col}`).className = 'node node-start';
        document.getElementById(`node-${finishNode.row}-${finishNode.col}`).className = 'node node-finish';
        }


// New clearPath method
    clearPath() {
        const {grid} = this.state;
        for (const row of grid) {
        for (const node of row) {
        if (node.isStart || node.isFinish) continue; // Skip start and finish nodes
        if (node.isWall) continue; // Skip wall nodes
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node'; // Reset node to default styling
        }
    }
}
  render() {
    const {grid, mouseIsPressed, nodesVisited, shortestPathLength} = this.state;

    return (
        <div className='bg'>
          <button className='button' onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
          <button className='button' onClick={() => this.reset()}>Reset</button>
          <button className='button' onClick={() => this.generateRandomWalls()}>Generate Random Walls</button>
          <p className='text'>Nodes Visited: {nodesVisited}</p>
          <p className='text'>Shortest Path Length: {shortestPathLength}</p>
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, isFinish, isStart, isWall} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

