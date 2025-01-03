import { Node, useReactFlow } from "@xyflow/react";
import ContextMenu, { ContextMenuOption } from "./ContextMenu";
import { randomID } from "../utilities";

import { allNodeTypes } from "../App";

export default function NodeMenu({ open, position, addNode }: { 
    open: boolean, 
    position: { x: number, y: number }
    addNode(nodeType: allNodeTypes): void
}) {
    const options: ContextMenuOption[] = [
        {
            label: "HTML",
            onClick: () => addNode("html"),
            innerMenuOptions: [{
                label: "Section",
                onClick: () => addNode("section"),
            },{
                label: "Text",
                onClick: () => addNode("text"),
            },{
                label: "Paragraph",
                onClick: () => addNode("paragraph"),
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