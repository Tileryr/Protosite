import { Node, NodeProps, XYPosition } from "@xyflow/react"
import { randomID } from "./utilities"
import { ElementData, ElementNodeData } from "./components/Nodes/ElementBase"
import { PortID } from "./components/Nodes/Ports"
import { DataType } from "./types"
import { StylingObject } from "./nodes/css/ClassNode"

export type AllNodeTypes = 
'html' | 'section' |'paragraph' | 'text' | 'styling' | 'list' | 'list-item' | 'table' | 'table-row' | 'table-data' | 'file' | 'image' | 'video' | 'audio' | 
'class' | 'class-output' | 'typography'

export type AnyNodeData = ElementData | ClassNodeData | { text: '' } | { styling: '' }

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

export class ClassNodeData implements ClassNodeDataType {
  styling: StylingObject = {}

  constructor() {
    this.updateStyling = this.updateStyling
  }

  updateStyling(property: string, value: any) {
    console.log(property, value)
    // this.styling = {...this.styling, [property]: value}
    this.styling[<any>property] = value
  }
}

export type ClassNodeDataType = {
  styling: StylingObject,
  updateStyling(property: string, value: any): void
}

export type ClassNodeProps<type extends string> = NodeProps<Node<ClassNodeDataType, type>>

export type ElementNodeProps<NodeType extends string> = NodeProps<Node<ElementNodeData, NodeType>>

export function handleID({ id, dataType, index }: { 
  id: string
  dataType: DataType
  index: number
}): PortID {
  return `${dataType}-${index}-${id}`
}