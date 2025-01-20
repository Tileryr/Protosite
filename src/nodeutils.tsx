import { Node, NodeProps, useNodeId, XYPosition } from "@xyflow/react"
import { randomID } from "./utilities"
import { ElementData, ElementNodeData } from "./components/Nodes/ElementBase"
import { PortID } from "./components/Nodes/Ports"
import { DataType } from "./types"

export type AllNodeTypes = 
  'html' | 'section' |'paragraph' | 'text' | 'styling' | 'list' | 'list-item' | 'table' | 'table-row' | 'table-data'

export type AnyNodeData = ElementData | { text: '' } | { styling: '' }

export class NewNode {
  data: AnyNodeData
  id: string = randomID()
  type: AllNodeTypes
  position: XYPosition = {x: 0, y: 0}
  parentId?: string
  constructor(data: AnyNodeData, type: AllNodeTypes, position?: XYPosition, parentId?: string) {
    this.data = data
    this.type = type
    this.parentId = parentId
    this.position = position ?? this.position
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