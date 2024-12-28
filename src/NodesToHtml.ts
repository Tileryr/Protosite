import { Node, useNodesData } from "@xyflow/react"
import { ElementObject, HTMLElementNodeData } from "./components/types"

export function convertHtml(root: ElementObject ) {
    const body = document.createElement('div')
    addChildren(root, body)
    return body.outerHTML
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement) => {
    //DO LATER: ADD PROPER TYPE FOR HTMLELEMENTNODES
    const children = parentNode.children
    children.forEach((child) => {
        const childElement = document.createElement(child.tag)
        child.text ? childElement.textContent = child.text : null
        parentElement.append(childElement)
        addChildren(child, childElement)
    });
}
