import { Node, useNodesData } from "@xyflow/react"

type NodeData = Pick<Node, "data" | "id" | "type">

export function convertHtml(root: NodeData ) {
    const body = document.createElement('div')
    addChildren(root, body)
    return body.outerHTML
}

const addChildren = (parentNode: NodeData, parentElement: HTMLElement) => {
    //DO LATER: ADD PROPER TYPE FOR HTMLELEMENTNODES
    const children = parentNode.data.children as NodeData[]
    children.forEach((child: any) => {
        const childElement = document.createElement(child!.data.element as string)
        parentElement.append(childElement)
        addChildren(child, childElement)
    });
}
