import ContextMenu, { ContextMenuOption } from "./ContextMenu";

import { allNodeTypes } from "../App";
import { Node, NodeProps } from "@xyflow/react";
import { ElementData } from "./Nodes/ElementBase";

export default function NodeMenu({ open, position, addNode }: { 
    open: boolean, 
    position: { x: number, y: number }
    addNode(nodeType: allNodeTypes, nodeData: Record<string, unknown>): void
}) {
    
    const options: ContextMenuOption[] = [
        {
            label: "HTML",
            onClick: () => addNode("html", new ElementData('body') as {}),
            innerMenuOptions: [{
                label: "Section",
                onClick: () => addNode("section", new ElementData('div') as {}),
            },{
                label: "Text",
                onClick: () => addNode("text", {text: ''}),
            },{
                label: "Paragraph",
                onClick: () => addNode("paragraph", new ElementData('p') as {}),
            },{
                label: "List",
                onClick: () => addNode("list", new ElementData('ul') as {}),
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