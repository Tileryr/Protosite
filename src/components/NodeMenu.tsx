import ContextMenu, { ContextMenuOption } from "./ContextMenu";

import { AllNodeTypes } from "../nodeutils";
import { ElementData } from "./Nodes/ElementBase";

export default function NodeMenu({ open, position, addNode }: { 
    open: boolean, 
    position: { x: number, y: number }
    addNode(nodeType: AllNodeTypes, nodeData: Record<string, unknown>): void
}) {
    
    const options: ContextMenuOption[] = [
        {
            label: "HTML",
            onClick: () => addNode("html", new ElementData({tag: 'body'}) as {}),
            innerMenuOptions: [{
                label: "Section",
                onClick: () => addNode("section", new ElementData({tag: 'div'}) as {}),
            },{
                label: "Text",
                onClick: () => addNode("text", {text: ''}),
            },{
                label: "Paragraph",
                onClick: () => addNode("paragraph", new ElementData({tag: 'p'}) as {}),
            },{
                label: "List",
                onClick: () => addNode("list", new ElementData({tag: 'ul', possibleChildren: 'list-item'}) as {}),
            },{
                label: "Table",
                onClick: () => addNode("table", new ElementData({tag: 'table'}) as {}),
            },{
                label: "File",
                onClick: () => addNode('file', {file: ''})
            },{
                label: "Image",
                onClick: () => addNode('image', new ElementData({ tag: 'img'}) as {})
            }
            ]
        },
    ]
    return (
        <ContextMenu
            positionX={position.x}
            positionY={position.y}
            open={open}
            options={options}
        />
    )
}