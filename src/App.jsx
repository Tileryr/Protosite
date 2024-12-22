import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css'

import BaseElementNode from './nodes/ElementBase';
import HtmlNode from './nodes/HtmlNode';
import DivNode from './nodes/DivNode';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello', children: [] },
    position: { x: 0, y: 0 },
    type: 'HtmlNode',
  },
  {
    id: '2',
    data: { label: 'World', children: [], type: 'div' },
    position: { x: 100, y: 100 },
    type: 'DivNode',
  },
  {
    id: '3',
    data: { label: 'World', children: [], type: 'img' },
    position: { x: 200, y: 100 },
    type: 'DivNode',
  },
];

const initialEdges = [
  
];

const nodeTypes = {
  HtmlNode,
  BaseElementNode,
  DivNode,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
 
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <Panel position='top-right'>
          <button>BUTTON</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
 
export default Flow;