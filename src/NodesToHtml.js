export function convertHtml(root) {
    const body = document.createElement('div')
    const children = root.data.children
    children.forEach(child => {
        const childElement = document.createElement(child.data.element)
        body.append(childElement)
        addChildren(child, childElement)
    });
    return body.outerHTML
}

const addChildren = (parentNode, parentElement) => {
    const children = parentNode.data.children
    children.forEach(child => {
        const childElement = document.createElement(child.data.element)
        parentElement.append(childElement)
        addChildren(child, childElement)
    });
}
/* <html>
    <body>
        <div>

        </div>
    </body>
</html> */