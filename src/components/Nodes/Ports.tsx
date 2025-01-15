import React, { useRef, useEffect, Children, useState } from "react";
import {
    Handle, 
    Position,
    useHandleConnections, 
    useNodesData,
    useNodeId,
    useReactFlow,
    useUpdateNodeInternals,
    IsValidConnection,
    Node,
} from "@xyflow/react";

import { HTMLNode } from "../../nodes/HtmlNode";
import { AnyNodeData, DataType, ElementObject } from "../types";
import { updateElement } from "../../utilities";
import { allNodeTypes } from "../../App";

export function Port({ type, position, id, label, isConnectable, children }: {
    type: 'source' | 'target'
    position: Position
    id: string
    label: string
    isConnectable: () => boolean
    children?: React.ReactElement
}) {
    const { getNode } = useReactFlow()
    const UpdateNodeInternals = useUpdateNodeInternals();

    const ref = useRef<HTMLDivElement>(null);
    const nodeId = useNodeId()!;
    const nodeData: AnyNodeData = useNodesData(nodeId)!.data as AnyNodeData;

    let [handlePos, setHandlePos] = useState(12)

    useEffect(() => setHandlePos(ref.current ? ref.current.offsetTop + 12 : 0), [ref.current?.offsetTop])
    useEffect(() => UpdateNodeInternals(nodeId), [handlePos])

    const isValidConnection: IsValidConnection = ({sourceHandle, targetHandle, source, target}) => {
        const isSource = type === 'source'
        const incomingNode = getNode(isSource ? target : source)!
        const incomingNodeData: AnyNodeData = incomingNode.data as AnyNodeData
        const incomingNodeType = incomingNode.type! as allNodeTypes

        const sourceNodeData = isSource ? nodeData : incomingNodeData
        const targetNodeData = isSource ? incomingNodeData : nodeData

        const validNodeType = 'possibleParents' in sourceNodeData && sourceNodeData.possibleParents
        ? sourceNodeData.possibleParents.includes(incomingNodeType)
        : true
        
        console.log(incomingNode)
        return sourceHandle === targetHandle && target !== source && validNodeType
    }

    return (
        <div ref={ref} className={position === Position.Left ? 'justify-self-start' : 'justify-self-end' }>
            <label onClick={() => console.log(nodeData)}>{label}</label>
            {children}
            <Handle 
                id={id}
                type={type}
                position={position}
                style={{ top: handlePos }}
                isConnectable={isConnectable()}
                isValidConnection={isValidConnection}
            />
        </div>
    )
}


export function Output({ id, label, children }: {
    id: DataType // data property that is outputted
    label?: string
    children?: React.ReactElement
}) {
    return (
        <Port
            id={id}
            label={label ? label : ''}
            type='source' 
            position={Position.Left}
            isConnectable={() => true}
        >   
            {children}
        </Port>
    )
    
}

export function Input(props: {
    id: DataType
    label: string
    limit?: boolean
    property: keyof ElementObject
}) {
    //do later: group stylings into big object

    const { updateNodeData } = useReactFlow(); 
    const nodeId = useNodeId()!;
    const nodeData = useNodesData<HTMLNode>(nodeId)!
    const connections = useHandleConnections({
        type: 'target',
        id: props.id
    })

    const connectedIds = connections.map(connection => connection.source)
    const connectedNodes = useNodesData(connectedIds)
    const connectedOutputs = connectedNodes.map(connectedNode => connectedNode.data[props.id])

    const isConnectable = () => {
        return props.limit ? connections.length < 1 : true
    }
    
    useEffect(() => {
        const addedProperty = props.limit ? connectedOutputs[0] : connectedOutputs
        updateNodeData(nodeId, { element: updateElement(nodeData.data, props.property, addedProperty) })
    }, [JSON.stringify(connectedOutputs)]) 

    return (
        <Port
            {...props}
            type='target' 
            position={Position.Right}
            isConnectable={isConnectable}
        >
        </Port>
    )
    
}

// data { outputs: { string: "asdasdads" | element: { tag: 'div', children: [{ tag: 'p' }]}}}
// data of element: { element: {tag: "skibidi", text: "asdasdasd", classes: "asd asd asd asd"}, output: [element, string]}