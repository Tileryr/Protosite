export type DataType = "element" | "string" | "number"

//Move unsure properies to main data objects?

export interface ElementObject {
    tag: keyof HTMLElementTagNameMap
    children: ElementObject[]
    renderOrder: number
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