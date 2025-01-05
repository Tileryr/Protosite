import { Node, useNodesData } from "@xyflow/react"
import { ElementObject, ElementNodeData } from "./components/types"

export function convertHtml(root: ElementObject ) {
    const body = document.createElement('div')
    addChildren(root, body)
    return body.outerHTML
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement) => {
    const children = parentNode.children
    children.sort((a, b) => b.renderOrder - a.renderOrder)
    children.forEach((child) => {
        const childElement = document.createElement(child.tag)
        child.text ? childElement.textContent = child.text : null

        child.styling.forEach(style => {
            for (const [property, value] of Object.entries(style)) {
                childElement.style[<any>property] = value
            }
            Object.entries(style)
        });

        parentElement.append(childElement)
        addChildren(child, childElement)
    });
}
