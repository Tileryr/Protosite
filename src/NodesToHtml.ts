import { ClassInterface } from "./nodes/ClassNode"
import { ElementObject } from "./types"

export function convertHtml(root: ElementObject, classes: ClassInterface[] ) {
    const html = document.createElement('html')
    html.appendChild(document.createElement('head'))
    const body = html.appendChild(document.createElement('body'))
    addChildren(root, body)

    const styleElement = document.createElement('style')
    const styleSheet = new CSSStyleSheet

    for (const currentClass of classes) {
        const classStyling = currentClass.styling
        let stylingString = ''
        for (const [property, value] of Object.entries(classStyling)) {
            stylingString += `${property}: ${value};\n`
        }
        console.log(`${currentClass.name} {\n ${stylingString}}`)
        styleSheet.insertRule(`${currentClass.name} {${stylingString}}`, styleSheet.cssRules.length)
    }
    const newDocument = new DocumentFragment
    console.log(html.ownerDocument)
    return html.outerHTML
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement) => {
    const children = parentNode.children.filter((child) => child !== undefined)
    if(children) {
        children.sort((a, b) => b.renderOrder - a.renderOrder)
        console.log(children)
        children.forEach((child) => {
            const childElement = document.createElement(child.tag)
            child.text ? childElement.innerHTML = child.text : null

            for (const [property, value] of Object.entries(child.styling ?? {})) {
                childElement.style[<any>property] = value
            }

            Object.entries(child.attributes ?? {}).forEach(([ attribute, value ]) => {
                if(attribute === 'autoplay' && value === true) {
                    childElement!.dataset!.autoplay = 'true'
                    return
                }

                console.log([attribute, value])
                childElement.setAttribute(attribute, value)
            })

            parentElement.append(childElement)
            addChildren(child, childElement)
        });
    }
}
