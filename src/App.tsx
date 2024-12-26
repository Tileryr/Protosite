import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeTypes,
  type OnBeforeDelete,
  type IsValidConnection
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css'

import DivPanel from './components/DivPanel';
import RunPanel from './components/RunPanel';

import HtmlNode from './nodes/HtmlNode';
import DivNode from './nodes/DivNode';
import TextNode from './nodes/TextNode';
import ParagraphNode from './nodes/ParagraphNode';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { children: [], element: 'body' },
    position: { x: 0, y: 0 },
    type: 'html',
  },
  {
    id: '2',
    data: { children: [], element: 'div' },
    position: { x: 100, y: 100 },
    type: 'div',
  },
  {
    id: '3',
    data: { text: '', element: 'p' },
    position: { x: 200, y: 100 },
    type: 'paragraph',
  },
  {
    id: '4',
    data: { children: [], element: '' },
    position: { x: 200, y: 100 },
    type: 'text',
  },
];

const initialEdges: Edge[] = [
];

const nodeTypes: NodeTypes = {
  'html': HtmlNode,
  'div': DivNode,
  'paragraph': ParagraphNode,
  'text': TextNode,
};

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [html, setHtml] = useState<string>('')

  const srcDoc: string = `
    <html>
      <body>
      <p>ASDASDASD</p>
      ${html}
      </body>
    </html>
  `
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
 
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );
  
  // const onBeforeDelete: OnBeforeDelete = async
  //   ({ nodes, edges }: {nodes: Node[], edges: Edge[]}) => {
  //     //FIX EDGES DELETNG ON HTML DELETE
  //     const filteredNodes: Node[] = nodes.filter(node => node.id !== "1" ? true : false)
  //     return true
  //     // return { nodes: filteredNodes, edges } 
  //   }
  
  const onBeforeDelete: OnBeforeDelete = async ({ nodes, edges }) => {
    const filteredNodes: Node[] = nodes.filter(node => node.id !== "1" ? true : false)
    return { nodes: filteredNodes, edges } 
  };
  
  const isValidConnection: IsValidConnection = ({sourceHandle, targetHandle, source, target}) => {
    return sourceHandle === targetHandle && target !== source
  }

  return (
    <div className='flex'>
      <div className='h-screen w-[70vw]'>
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
          <DivPanel />
          <RunPanel html={setHtml}/>
        </ReactFlow>
      </div>
      <div>
        <iframe
          title='window'
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