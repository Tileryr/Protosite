import { Node, useNodeConnections, useNodeId, useReactFlow, XYPosition } from "@xyflow/react"
import { randomID } from "../../utilities"
import { AllNodeTypes, AnyNodeData, NewNode } from "../../nodeutils"
import { DataType } from "../../types"
import { useState } from "react"
import { PortID } from "../Nodes/Ports"

export default function AddNodeButton({ nodeData, nodeType, connectionType, limit, position, parentId }: {
    nodeData: AnyNodeData
    nodeType: AllNodeTypes
    connectionType: DataType
    limit: boolean
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
        handleId: connectionType,
        onConnect: checkLimit,
        onDisconnect: checkLimit
    })

    
    const addItem = () => {
        const newItem: NewNode = new NewNode(nodeData, nodeType, position, parentId)
        const sourceHandle: PortID = `${connectionType}-0-${newItem.id}`
        const targetHandle: PortID = `${connectionType}-0-${nodeID}`
        console.log(sourceHandle)
        console.log(targetHandle)
        addNodes(newItem as Node)
        
        addEdges({id: randomID(), source: newItem.id, target: nodeID, sourceHandle: sourceHandle, targetHandle: targetHandle })
    }
    return (
        <button className="rounded-full h-4 aspect-square flex justify-center items-center mr-1
        bg-dry-purple-500 hover:bg-dry-purple-400 active:bg-dry-purple-300 active:text-dark-purple-900 disabled:bg-dry-purple-950 disabled:text-dry-purple-800"
        onClick={addItem} disabled={disabled}>
            <span>+</span>
        </button>
    )
}