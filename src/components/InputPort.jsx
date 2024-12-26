import { useEffect } from "react";
import { 
    Position, 
    useHandleConnections, 
    useNodesData,
    useNodeId,
    useReactFlow
} from "@xyflow/react";
import Port from "./NodePort";


export default function Input({ id, label, limit }) {
    const { updateNodeData } = useReactFlow(); 
    const nodeId = useNodeId();
    const connections = useHandleConnections({
        type: 'target',
        id
    })
    const connectedIds = connections.map(connection => connection.source)
    const connectedNodeData = useNodesData(connectedIds)
    
    useEffect(() => {
        updateNodeData(nodeId, { children: connectedNodeData})
    }, [nodeId, connectedNodeData, updateNodeData]) 

    return (
        <Port
            id={id}
            type='target' 
            position={Position.Right}
            label={label}
            limit={limit}
        />
    )
    
}