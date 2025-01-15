import { allNodeTypes } from "../App"

export type DataType = "element" | "string" | "number" | "styling"

//Move unsure properies to main data objects?

export type StylingObject = Partial<Record<keyof CSSStyleDeclaration, any>>

export interface ElementObject {
    tag: keyof HTMLElementTagNameMap
    children: ElementObject[]
    renderOrder: number
    styling?: StylingObject[]
    text?: string
}

export type ElementNodeData = {
    element: ElementObject
    possibleParents?: allNodeTypes | allNodeTypes[]
}

export type AnyNodeData = ElementNodeData | { text: '' } | { styling: '' }

export type DataNodeData = {
    text: {
        value: ElementObject
        type: DataType
    }
}