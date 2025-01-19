import React, { useRef, useEffect, useState } from "react";
import {
    Handle, 
    Position,
    useNodesData,
    useNodeId,
    useReactFlow,
    useUpdateNodeInternals,
    IsValidConnection,
    useNodeConnections,
    Connection,
    Node
} from "@xyflow/react";

import { DataType, ElementObject } from "../../types";
import { randomID, updateElement } from "../../utilities";
import { AllNodeTypes, AnyNodeData } from "../../nodeutils";
import { ElementNodeData } from "./ElementBase";

type PortID = `${DataType}-${string}`

export function Port({ type, position, id, label, limit, connections, children }: {
    type: 'source' | 'target'
    position: Position
    id: PortID
    label: string
    limit: boolean
    connections: Connection[]
    isConnectable?: () => boolean
    children?: React.ReactElement
}) {
    const { getNode } = useReactFlow()
    const UpdateNodeInternals = useUpdateNodeInternals();

    const ref = useRef<HTMLDivElement>(null);
    const nodeId = useNodeId()!;
    const currentNode: Pick<Node, "type" | "id" | "data"> = useNodesData(nodeId)!;

    let [handlePos, setHandlePos] = useState(12)

    useEffect(() => setHandlePos(ref.current ? ref.current.offsetTop + 12 : 0), [ref.current?.offsetTop])
    useEffect(() => UpdateNodeInternals(nodeId), [handlePos])

    const isValidConnection: IsValidConnection = ({sourceHandle, targetHandle, source, target}) => {
        const isSource = type === 'source'
        const incomingNode = getNode(isSource ? target : source)!

        const sourceType = sourceHandle?.split('-', 1)[0]
        const targetType = targetHandle?.split('-', 1)[0]

        const sourceNode = isSource ? currentNode : incomingNode
        const targetNode = isSource ? incomingNode : currentNode

        const sourceNodeData: AnyNodeData = sourceNode.data as AnyNodeData
        const targetNodeData: AnyNodeData = targetNode.data as AnyNodeData

        const validParent = 'possibleParents' in sourceNodeData && sourceNodeData.possibleParents
        ? sourceNodeData.possibleParents.includes(targetNode.type as AllNodeTypes)
        : true
        
        const validChild = 'possibleChildren' in targetNodeData && targetNodeData.possibleChildren
        ? targetNodeData.possibleChildren.includes(sourceNode.type as AllNodeTypes)
        : true

        return sourceType === targetType && target !== source && validChild && validParent 
    }

    const isConnectable = () => {
        return limit ? connections.length < 1 : true
    }

    return (
        <div ref={ref} className={position === Position.Left ? 'justify-self-start flex items-center' : 'justify-self-end flex items-center' }>
            {type === 'target' && children}
            <label>{label}</label>
            {type === 'source' && children}
            <Handle 
                id={id}
                type={type}
                position={position}
                className="handle"
                style={{ top: handlePos}}
                isValidConnection={isValidConnection}
                isConnectable={isConnectable()}
            />
        </div>
    )
}

export function Output({ id, label, limit, children }: {
    id: DataType // data property that is outputted
    limit: boolean
    label?: string
    children?: React.ReactElement
}) {
    const [portID] = useState<PortID>(`${id}-${randomID()}`)

    const connections = useNodeConnections({
        handleType: 'source',
        handleId: id,
    })

    return (
        <Port
            id={portID}
            label={label ? label : ''}
            limit={limit}
            type='source' 
            position={Position.Left}
            isConnectable={() => true}
            connections={connections}
        >   
            {children}
        </Port>
    )
    
}

export function Input({id, label, limit, property, children}: {
    id: DataType
    label: string
    limit: boolean
    property: keyof ElementObject
    children?: React.ReactElement
}) {
    //do later: group stylings into big object
    const { updateNodeData } = useReactFlow(); 
    const [portID] = useState<PortID>(`${id}-${randomID()}`)

    const nodeId = useNodeId()!;
    const nodeData = useNodesData<Node<ElementNodeData>>(nodeId)!
    const connections = useNodeConnections({
        handleType: 'target',
        handleId: id,
    })

    const connectedIds = connections.map(connection => connection.source)
    const connectedNodes = useNodesData(connectedIds)
    const connectedOutputs = connectedNodes.map(connectedNode => connectedNode.data[id])
    
    useEffect(() => {
        const addedProperty = limit ? connectedOutputs[0] : connectedOutputs
        updateNodeData(nodeId, { element: updateElement(nodeData.data, property, addedProperty) })
    }, [JSON.stringify(connectedOutputs)]) 

    return (
        <Port
            id={portID}
            label={label}
            limit={limit}
            type='target' 
            position={Position.Right}
            connections={connections}
        >
            {children}
        </Port>
    )
    
}

// data { outputs: { string: "asdasdads" | element: { tag: 'div', children: [{ tag: 'p' }]}}}
// data of element: { element: {tag: "skibidi", text: "asdasdasd", classes: "asd asd asd asd"}, output: [element, string]}