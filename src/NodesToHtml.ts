import { ElementObject } from "./types"

export function convertHtml(root: ElementObject ) {
    const body = document.createElement('div')
    addChildren(root, body)
    return body.outerHTML
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement) => {
    const children = parentNode.children.filter((child) => child !== undefined)
    if(children) {
        children.sort((a, b) => b.renderOrder - a.renderOrder)
        console.log(children)
        children.forEach((child) => {
            const childElement = document.createElement(child.tag)
            child.text ? childElement.innerHTML = child.text : null
            
            child.styling?.forEach(style => {
                for (const [property, value] of Object.entries(style)) {
                    childElement.style[<any>property] = value
                }
            });

            Object.entries(child.attributes ?? {}).forEach(([ attribute, value ]) => {
                childElement.setAttribute(attribute, value)
            })

            parentElement.append(childElement)
            addChildren(child, childElement)
        });
    }
    
}
