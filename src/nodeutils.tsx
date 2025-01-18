import { XYPosition } from "@xyflow/react"
import { randomID } from "./utilities"
import { ElementData } from "./components/Nodes/ElementBase"

export type AllNodeTypes = 'html' | 'section' |'paragraph' | 'text' | 'styling' | 'list' | 'list-item'

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