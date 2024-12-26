import { useRef, useEffect } from "react";
import {
    Handle, 
    Position,
    useHandleConnections, 
    useNodesData,
    useNodeId,
    useReactFlow
} from "@xyflow/react";


export function Port({ type, position, id, label, limit }: {
    type: 'source' | 'target'
    position: Position
    id: string
    label: string
    limit?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div ref={ref} className={position === Position.Left ? 'justify-self-start' : 'justify-self-end' }>
            <label>{label}</label>
            <Handle 
                id={id}
                type={type}
                position={position}
                style={{ top: ref.current ? ref.current.offsetTop + 12 : 12 }}
                isConnectable={!limit}
            />
        </div>
    )
}


export function Output(props: {
    id: string
    label: string
}) {
    return (
        <Port
            {...props}
            type='source' 
            position={Position.Left}
        />
    )
    
}

export function Input(props: {
    id: string
    label: string
    limit?: boolean
}) {
    const { updateNodeData } = useReactFlow(); 
    const nodeId = useNodeId();
    const connections = useHandleConnections({
        type: 'target',
        id: props.id
    })
    const connectedIds = connections.map(connection => connection.source)
    const connectedNodeData = useNodesData(connectedIds)
    
    useEffect(() => {
        updateNodeData(nodeId!, { children: connectedNodeData})
    }, [nodeId, connectedNodeData, updateNodeData]) 

    return (
        <Port
            {...props}
            type='target' 
            position={Position.Right}
        />
    )
    
}