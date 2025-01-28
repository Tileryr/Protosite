import { useState, useCallback, useRef, useContext, Context, createContext } from 'react';

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
  OnDelete,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import DivPanel from './components/DivPanel';

import HtmlNode from './nodes/HtmlNode';
import DivNode from './nodes/DivNode';
import TextNode from './nodes/TextNode';
import ParagraphNode from './nodes/ParagraphNode';
import StylingNode from './nodes/StylingNode';
import FileNode from './nodes/FileNode';
import ImageNode from './nodes/ImageNode';
import TableNode, { TableDataNode, TableRowNode } from './nodes/TableNode';
import VideoNode from './nodes/VideoNode';
import AudioNode from './nodes/AudioNode';

import NodeMenu from './components/NodeMenu';
import { randomID } from './utilities';
import ListNode, { ListItemNode } from './nodes/ListNode';
import GridResizer from './components/GridResizer';
import { AllNodeTypes, NewNode } from './nodeutils';
import { ElementData } from './components/Nodes/ElementBase';
import Sidebar from './sections/sidebar';
import ClassNode, { useClasses } from './nodes/css/ClassNode';
import ClassOutputNode from './nodes/css/ClassOutputNode';
import TypographyNode from './nodes/css/TypographyNode';


const initialNodes: Node[] = [
  new NewNode({data: new ElementData({tag: 'html'}), type: 'html', id: '1'}) as Node,
  new NewNode({data: new ElementData({tag: 'div'}), type: 'section'}) as Node,
  new NewNode({data: new ElementData({tag: 'p'}), type: 'paragraph'}) as Node,
  new NewNode({data: {text: ''}, type: 'text'}) as Node,
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
  'table-data': TableDataNode,
  'file': FileNode,
  'image': ImageNode,
  'video': VideoNode,
  'audio': AudioNode,
  'class': ClassNode,
  'class-output': ClassOutputNode,
  'typography': TypographyNode
};

export const OpenContext = createContext(0)

function Flow() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [open, setOpen] = useState(0)

  return (
    <OpenContext.Provider value={open}>
    <div className='flex w-screen h-screen max-sm:flex-col'>
      <ReactFlowProvider>
        <div className='hidden max-sm:flex justify-center gap-2 py-1'>
          <button className='bg-bright-purple-600 rounded-full px-3' onClick={() => setOpen(0)}>Graph</button>
          <button className='bg-bright-purple-600 rounded-full px-3' onClick={() => setOpen(1)}>HTML</button>
        </div>
        <div className={`h-screen w-[70%] max-sm:w-full ${open === 0 ? '' : 'max-sm:hidden'} border-highlight border-2`}>
            <FlowProvider/>
        </div>
        <GridResizer direction='horizontal' windowRef={iframeRef}/>
        <Sidebar iframeRef={iframeRef}/>
      </ReactFlowProvider>
    </div>
    </OpenContext.Provider>
  );
}

function FlowProvider() {
  const { addNodes, screenToFlowPosition, } = useReactFlow();
  
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [contextMenuToggled, setContextMenuToggled] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0})

  const reactFlowRef = useRef<HTMLDivElement>(null)

  const removeClass = useClasses((state) => state.removeClass)
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
  
  const onDelete: OnDelete = ({ nodes, }) => {
    nodes.forEach(node => {
      if(node.type !== 'class') return
      removeClass(node.id)
    })
  }

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
        onDelete={onDelete}
        fitView
        nodeTypes={nodeTypes}
        onContextMenu={onContextMenu}
        onMouseDownCapture={() => setContextMenuToggled(false)}
        ref={reactFlowRef}
      >
        <Background bgColor='#1a1b31' variant={BackgroundVariant.Lines} color='#44478f' lineWidth={0.2}/>
        <Controls className='!bg-dry-purple-950 !text-dry-purple-700 !rounded !gap-1'/>
      </ReactFlow>
    </>
  )
}
export default Flow;