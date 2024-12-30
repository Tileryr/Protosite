import * as flow from "@xyflow/react"

export type DataType = "element" | "string" | "number"

export interface ElementObject {
    tag: keyof HTMLElementTagNameMap
    children: ElementObject[]
    text?: string
}

export type ElementNodeData = {
    element: ElementObject
}

export type DataNodeData = {
    text: {
        value: ElementObject
        type: DataType
    }
}