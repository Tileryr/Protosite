import { useState, useCallback, useRef } from 'react';

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { prettify } from 'htmlfy'

import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeTypes,
  type OnBeforeDelete,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './App.css'

import DivPanel from './components/DivPanel';
import RunPanel from './components/RunPanel';

import HtmlNode from './nodes/HtmlNode';
import DivNode from './nodes/DivNode';
import TextNode from './nodes/TextNode';
import ParagraphNode from './nodes/ParagraphNode';
import StylingNode from './nodes/StylingNode';

import NodeMenu from './components/NodeMenu';
import { randomID } from './utilities';
import ListNode, { ListItemNode } from './nodes/ListNode';
import GridResizer from './components/GridResizer';
import { AllNodeTypes } from './nodeutils';
import TableNode, { TableDataNode, TableRowNode } from './nodes/TableNode';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { element: {
      tag: 'body',
      children: []
    }},
    position: { x: 0, y: 0 },
    type: 'html',
  },
  {
    id: '2',
    data: { element: {
      tag: 'div',
      children: []
    }},
    position: { x: 100, y: 100 },
    type: 'section',
  },
  {
    id: '3',
    data: { element: {
      tag: 'p',
      children: []
    }},
    position: { x: 100, y: 100 },
    type: 'paragraph',
  },
  {
    id: '4',
    data: { 
      output: 'string',
      string: ''
    },
    position: { x: 100, y: 100 },
    type: 'styling',
  },
];

const initialEdges: Edge[] = [
];

const nodeTypes: NodeTypes = {
  'html': HtmlNode,
  'section': DivNode,
  'paragraph': ParagraphNode,
  'text': TextNode,
  'styling': StylingNode,
  'list': ListNode,
  'list-item': ListItemNode,
  'table': TableNode,
  'table-row': TableRowNode,
  'table-data': TableDataNode
};

hljs.registerLanguage('xml', xml)

function Flow() {
  const [html, setHtml] = useState<string>('')

  const iframeRef = useRef(null)
  const srcDoc: string = `
  <html>
    <body>
    ${html}
    </body>
  </html>
  `
  
  const highlightedText = hljs.highlight(prettify(html), { language: "xml" }).value
  console.log(html)
  console.log(highlightedText)
  return (
    <div className='flex w-screen h-screen'>
      <div className='h-screen w-[70%] border-highlight border-2 rounded-xl'>
        <ReactFlowProvider>
          <FlowProvider setHtml={setHtml}/>
        </ReactFlowProvider>
      </div>
      <GridResizer direction='horizontal' windowRef={iframeRef}/>
      <div className='side-bar h-screen w-[30%] '>
        <div className='website-container select-none -webkit-select-none border-highlight border-2 rounded-xl'>
          <iframe
            title='window'
            className='website-display select-none -webkit-select-none'
            srcDoc={srcDoc}
            ref={iframeRef}
          />
        </div>
        <GridResizer direction='vertical' windowRef={iframeRef}/>
        <div className='side-window border-highlight border-2 rounded-xl'>
          <pre>
            <code dangerouslySetInnerHTML={{__html: highlightedText}}>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function FlowProvider({setHtml}: {setHtml: React.Dispatch<React.SetStateAction<string>>}) {
  const { addNodes, screenToFlowPosition, getNode } = useReactFlow();
  
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [contextMenuToggled, setContextMenuToggled] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0})

  const reactFlowRef = useRef<HTMLDivElement>(null)

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

  const onBeforeDelete: OnBeforeDelete = async ({ nodes, edges }) => {
    const filteredNodes: Node[] = nodes.filter(node => node.id !== "1" ? true : false)
    return { nodes: filteredNodes, edges } 
  };
  
  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenuToggled(true);
    setContextMenuPosition({ x: event.pageX, y: event.pageY })
    console.log("BLABBER")
  }
  
  const addNode = (positionX: number, positionY: number, type: AllNodeTypes, data: Record<string, unknown>) => {
    const adjustedPos = screenToFlowPosition({
        x: positionX,
        y: positionY
    })

    const node: Node = {
      id: randomID(),
      data: data,
      position: { x: adjustedPos.x, y: adjustedPos.y },
      type: type,
    }

    addNodes(node)
  }

  return (
    <>
      <NodeMenu 
          position={contextMenuPosition}
          open={contextMenuToggled}
          addNode={(type: AllNodeTypes, data: Record<string, unknown>) => {
            let currentFlow = reactFlowRef.current
            let width = currentFlow ? currentFlow.offsetWidth : 0
            let height = currentFlow ? currentFlow.offsetHeight : 0
            addNode(width/2, height/2, type, data)
          }}
      />

      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        fitView
        nodeTypes={nodeTypes}
        onContextMenu={onContextMenu}
        onMouseDownCapture={() => setContextMenuToggled(false)}
        ref={reactFlowRef}
      >
        
        <Background bgColor='#1a1b31' variant={BackgroundVariant.Lines} color='#44478f' lineWidth={0.2}/>
        <Controls />
        <DivPanel />
        <RunPanel html={setHtml}/>
      </ReactFlow>
    </>
  )
}
export default Flow;