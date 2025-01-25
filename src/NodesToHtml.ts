import { ElementObject } from "./types"

export function convertHtml(root: ElementObject ) {
    const body = document.createElement('div')
    addChildren(root, body).forEach((autoplayableMediaElement) => {
        console.log(autoplayableMediaElement)
        autoplayableMediaElement!.dataset!.autoplay = 'true'
        // autoplayableMediaElement.setAttribute('autoplay', 'true')
    })
    return body.outerHTML
}

const addChildren = (parentNode: ElementObject, parentElement: HTMLElement, autoplay: HTMLMediaElement[] = []) => {
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
                if(attribute === 'autoplay' && value === true) {autoplay.push(childElement as HTMLMediaElement); return}
                console.log([attribute, value])
                childElement.setAttribute(attribute, value)
            })

            parentElement.append(childElement)
            addChildren(child, childElement, autoplay)
        });
    }
    return autoplay
}
