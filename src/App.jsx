import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css'

import DivPanel from './components/DivPanel';
import RunPanel from './components/RunPanel';

import HtmlNode from './nodes/HtmlNode';
import DivNode from './nodes/DivNode';
import TextNode from './nodes/TextNode';
import ParagraphNode from './nodes/ParagraphNode';

const initialNodes = [
  {
    id: '1',
    data: { children: [], element: 'body' },
    position: { x: 0, y: 0 },
    type: 'HtmlNode',
  },
  {
    id: '2',
    data: { children: [], element: 'div' },
    position: { x: 100, y: 100 },
    type: 'DivNode',
  },
  {
    id: '3',
    data: { children: [], element: 'p' },
    position: { x: 200, y: 100 },
    type: 'ParagraphNode',
  },
  {
    id: '4',
    data: { children: [], element: '' },
    position: { x: 200, y: 100 },
    type: 'TextNode',
  },
];

const initialEdges = [
];

const nodeTypes = {
  HtmlNode,
  DivNode,
  ParagraphNode,
  TextNode,

};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [html, setHtml] = useState('')
  const srcDoc = `
    <html>
      <body>
      <p>ASDASDASD</p>
      ${html}
      </body>
    </html>
  `
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
  
  const onBeforeDelete = useCallback(
    ({nodes, edges}) => {
      //FIX EDGES DELETNG ON HTML DELETE
      return { nodes: nodes.filter(node => node.id !== "1" ? true : false), edges: edges }
    }, []
  ) 
  
  const isValidConnection = ({sourceHandle, targetHandle, source, target}) => {
    return sourceHandle === targetHandle && target !== source
  }

  return (
    <div className='flex'>
      <div style={{ height: '100vh', width: '70vw' }}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onBeforeDelete={onBeforeDelete}
          fitView
          nodeTypes={nodeTypes}
          isValidConnection={isValidConnection}
        >
          <Background />
          <Controls />
          <DivPanel position='top-left' />
          <RunPanel html={setHtml}/>
        </ReactFlow>
      </div>
      <div>
        <iframe
          srcDoc={srcDoc}
        />
        <pre>
          <code>
            {html}     
          </code>
        </pre>
      </div>
    </div>
  );
}
 
export default Flow;