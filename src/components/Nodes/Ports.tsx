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
import { updateElement } from "../../utilities";
import { AllNodeTypes, AnyNodeData, handleID } from "../../nodeutils";
import { ElementNodeData } from "./ElementBase";

export type PortID = `${DataType}-${number}-${string}` | DataType

export function Port({ type, position, id, index, label, limit, connections, children }: {
    type: 'source' | 'target'
    position: Position
    id: DataType
    index?: number
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
    
    const [portID] = useState<PortID>(`${id}-${index ?? 0}-${nodeId}`)

    let [handlePos, setHandlePos] = useState(12)

    useEffect(() => setHandlePos(ref.current ? ref.current.offsetTop + 12 : 0), [ref.current?.offsetTop])
    useEffect(() => UpdateNodeInternals(nodeId), [handlePos])

    const isValidConnection: IsValidConnection = ({sourceHandle, targetHandle, source, target}) => {
        const isSource = type === 'source'
        const incomingNode = getNode(isSource ? target : source)!

        const sourceType = sourceHandle?.split('-')[0]
        const targetType = targetHandle?.split('-')[0]

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

        console.log([sourceHandle, targetHandle])
        console.log([sourceType, targetType])
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
                id={portID}
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

export function Output({ id, label, index, limit, children }: {
    id: DataType // data property that is outputted
    index?: number
    limit: boolean
    label?: string
    children?: React.ReactElement
}) {
    const nodeId = useNodeId()!
    
    const connections = useNodeConnections({
        handleType: 'source',
        handleId: handleID({ id: nodeId, dataType: id, index: index ?? 0}),
    })

    return (
        <Port
            id={id}
            index={index}
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

export function Input({id, index, label, limit, property, children}: {
    id: DataType
    index?: number
    label: string
    limit: boolean
    property: keyof ElementObject
    children?: React.ReactElement
}) {
    //do later: group stylings into big object
    const { updateNodeData } = useReactFlow(); 

    const nodeId = useNodeId()!;
    const nodeData = useNodesData<Node<ElementNodeData>>(nodeId)!
    const connections = useNodeConnections({
        handleType: 'target',
        handleId: handleID({ id: nodeId, dataType: id, index: index ?? 0}),
    })

    const connectedIds = connections.map(connection => connection.source)
    const connectedNodes = useNodesData(connectedIds)
    const connectedOutputs = connectedNodes.map(connectedNode => connectedNode.data[id])
    
    useEffect(() => {
        const addedProperty = limit ? connectedOutputs[0] : connectedOutputs
        updateNodeData(nodeId, { element: updateElement(nodeData.data, property, addedProperty) })
        if(limit && Array.isArray(nodeData.data.element[property])) {
            const newPropertyArray = [...nodeData.data.element[property]]
            newPropertyArray[index ?? 0] = addedProperty
            updateNodeData(nodeId, { element: updateElement(nodeData.data, property, newPropertyArray) })
            console.log(newPropertyArray)
        }
    }, [JSON.stringify(connectedOutputs)]) 
    
    return (
        <Port
            id={id}
            index={index}
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