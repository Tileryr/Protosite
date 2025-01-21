import { Node, useNodeConnections, useNodeId, useReactFlow, XYPosition } from "@xyflow/react"
import { randomID } from "../../utilities"
import { AllNodeTypes, AnyNodeData, handleID, NewNode } from "../../nodeutils"
import { DataType } from "../../types"
import { useState } from "react"
import { PortID } from "../Nodes/Ports"
import CircleButton from "./CircleButton"

export default function AddNodeButton({ nodeData, nodeType, handleIndex, connectionType, limit, position, parentId }: {
    nodeData: AnyNodeData
    nodeType: AllNodeTypes
    connectionType: DataType
    limit: boolean
    handleIndex?: number
    position?: XYPosition
    parentId?: string
}) {
    const { addNodes, addEdges } = useReactFlow()
    const [disabled, setDisabled] = useState(false)
    const nodeID = useNodeId()!

    const checkLimit = () => {
        limit && connectedNodes.length > 0 ? setDisabled(true) : setDisabled(false)
    }

    const connectedNodes = useNodeConnections({ 
        handleType: 'target', 
        handleId: handleID({ id: nodeID, dataType: connectionType, index: handleIndex ?? 0}),
        onConnect: checkLimit,
        onDisconnect: checkLimit
    })

    
    const addItem = () => {
        const newItem: NewNode = new NewNode({data: nodeData, type: nodeType, position: position, parentId: parentId})
        const sourceHandle: PortID = handleID({ id: newItem.id, dataType: connectionType, index: 0})
        const targetHandle: PortID = handleID({ id: nodeID, dataType: connectionType, index: handleIndex ?? 0})

        addNodes(newItem as Node)
        addEdges({id: randomID(), source: newItem.id, target: nodeID, sourceHandle: sourceHandle, targetHandle: targetHandle })
    }
    return (
        <CircleButton onClick={addItem} disabled={disabled}/>
    )
}