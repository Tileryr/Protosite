import { ClassInterface } from "./nodes/css/ClassNode"
import { ElementObject } from "./types"

export function convertHtml(root: ElementObject, classes: ClassInterface[] ) {
    const body = document.createElement('body')
    addChildren(root, body)
    return body
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement) => {
    const children = parentNode.children.filter((child) => child !== undefined)
    if(children) {
        children.sort((a, b) => b.renderOrder - a.renderOrder)
        console.log(children)
        children.forEach((child) => {
            const childElement = document.createElement(child.tag)
            child.text ? childElement.innerHTML = child.text : null

            console.log(child.classes)
            childElement.classList.add(...child.classes)

            for (const [property, value] of Object.entries(child.styling ?? {})) {
                childElement.style[<any>property] = value
            }

            Object.entries(child.attributes ?? {}).forEach(([ attribute, value ]) => {
                if(attribute === 'autoplay' && value === true) {
                    childElement!.dataset!.autoplay = 'true'
                    return
                }

                childElement.setAttribute(attribute, value)
            })

            parentElement.append(childElement)
            addChildren(child, childElement)
        });
    }
}
