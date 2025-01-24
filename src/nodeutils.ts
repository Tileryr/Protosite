import { Node, NodeProps, XYPosition } from "@xyflow/react"
import { randomID } from "./utilities"
import { ElementData, ElementNodeData } from "./components/Nodes/ElementBase"
import { PortID } from "./components/Nodes/Ports"
import { DataType } from "./types"

export type AllNodeTypes = 
  'html' | 'section' |'paragraph' | 'text' | 'styling' | 'list' | 'list-item' | 'table' | 'table-row' | 'table-data' | 'file' | 'image' | 'video' | 'audio'

export type AnyNodeData = ElementData | { text: '' } | { styling: '' }

export class NewNode {
  data!: AnyNodeData;
  type!: AllNodeTypes;
  id: string = randomID();
  position: XYPosition = {x: 0, y: 0};
  parentId?: string;
  
  constructor(nodeProperties: Partial<NewNode>) {
    //Remove undefined properties
    Object.keys(nodeProperties)
    .forEach(key => nodeProperties[key as keyof NewNode] === undefined ? delete nodeProperties[key as keyof NewNode] : {})
    Object.assign(this, nodeProperties)
  }
}

export type ElementNodeProps<NodeType extends string> = NodeProps<Node<ElementNodeData, NodeType>>

export function handleID({ id, dataType, index }: { 
  id: string
  dataType: DataType
  index: number
}): PortID {
  return `${dataType}-${index}-${id}`
}