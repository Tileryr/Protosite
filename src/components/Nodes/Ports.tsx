import React, { useRef, useEffect, useState, useMemo, PropsWithChildren } from "react";
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
    Node,
    getOutgoers
} from "@xyflow/react";

import { DataType, ElementObject } from "../../types";
import { AllNodeTypes, AnyNodeData, handleID } from "../../nodeutils";
import { ElementNodeData } from "./ElementBase";

export type PortID = `${DataType}-${number}-${string}` | DataType

interface PortProperties {
    type: 'source' | 'target'
    position: Position
    id: DataType
    index?: number
    label: string
    limit: boolean
    connections: Connection[]
}

export function Port({ type, position, id, index, label, limit, connections, children }: PropsWithChildren<PortProperties>) {
    const { getNode, getNodes, getEdges } = useReactFlow()
    const UpdateNodeInternals = useUpdateNodeInternals();

    const nodeId = useNodeId()!;
    const [portID] = useState<PortID>(`${id}-${index ?? 0}-${nodeId}`)
    const ref = useRef<HTMLDivElement>(null);
    const currentNode: Pick<Node, "type" | "id" | "data"> = useNodesData(nodeId)!;

    const isVertical = useMemo(() => position === Position.Top || position === Position.Bottom, [position])

    const handleOffsetLeft = useMemo(() => {

        return ref.current ? ref.current.offsetLeft + (ref.current.offsetWidth/2)  : 0
    } ,[ref.current?.offsetLeft])
    const handleOffsetTop = useMemo(() => ref.current ? ref.current.offsetTop + 12 : 0 ,[ref.current?.offsetTop])

    useEffect(() => UpdateNodeInternals(nodeId), [handleOffsetLeft, handleOffsetTop])

    const isValidConnection: IsValidConnection = ({sourceHandle, targetHandle, source, target}) => {
        const nodes = getNodes()
        const edges = getEdges()

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

        const notSelf = target !== source
        const sameType = sourceType === targetType

        const isRecursive = (node: Node, visited = new Set()) => {
            if(visited.has(node.id)) return false;

            visited.add(node.id)

            for(const outgoer of getOutgoers(node, nodes, edges)) {
                if(outgoer.id === source) return true;
                if(isRecursive(outgoer, visited)) return true;
            }
        }

        return sameType && notSelf && validChild && validParent && !isRecursive(targetNode as Node)
    }

    const isConnectable = () => {
        return limit ? connections.length < 1 : true
    }

    return (
        <div ref={ref} className={position === Position.Left ? 'justify-self-start flex items-center' : 'justify-self-end flex items-center' }>
            {type === 'target' && children}
            <label onClick={() => console.log(handleOffsetLeft)}>{label}</label>
            {type === 'source' && children}
            <Handle 
                id={portID}
                type={type}
                position={position}
                className="handle"
                style={{ 
                    top: !isVertical ? handleOffsetTop : '',
                    left: isVertical ? handleOffsetLeft : ''
                }}
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
    //nodeData.data.updateElement(property, newPropertyValue
    return (
        <Port
            id={id}
            index={index}
            label={label ? label : ''}
            limit={limit}
            type='source' 
            position={Position.Left}
            connections={connections}
        >   
            {children}
        </Port>
    )
    
}

interface InputProps {
    portID: DataType
    limit: boolean
    index?: number
    onConnection: (x: unknown) => void
}

export function useInput({ portID, limit, index, onConnection }: InputProps) {
    const nodeId = useNodeId()!;

    const connections = useNodeConnections({
        handleType: 'target',
        handleId: handleID({ id: nodeId, dataType: portID, index: index ?? 0}),
    })

    const connectedIds = connections.map(connection => connection.source)
    const connectedNodes = useNodesData(connectedIds)
    const connectedOutputs = connectedNodes.map(connectedNode => connectedNode.data[portID])
    
    console.log(connectedOutputs)
    console.log(JSON.stringify(connectedOutputs))
    useEffect(() => {
        const newPropertyValue = limit ? connectedOutputs[0] : connectedOutputs
        console.log("WHAT")
        onConnection?.(newPropertyValue)
    }, [JSON.stringify(connectedOutputs)])
    
    
    const portProps: Pick<PortProperties, 'id' | 'limit' | 'type' | 'connections' | 'index' | 'position'> = {
        id: portID,
        limit: limit,
        type: 'target',
        connections: connections,
        index: index,
        position: Position.Right
    }

    return portProps
}

export function IterableInput({portID, index, label, limit, position, onConnection, children}: PropsWithChildren<InputProps & {
    label: string
    position?: Position
}>) {
    const portProps = useInput({ portID, limit, index, onConnection})
    
    return (
        <Port
            {...portProps}
            label={label}
            position={position ?? portProps.position}
        >
            {children}
        </Port>
    )
}

