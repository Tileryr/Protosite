import { Position, } from "@xyflow/react";
import Port from "./NodePort";


export default function Output({ id, label }) {
    return (
        <Port
            id={id}
            type='source' 
            position={Position.Left}
            label={label}
        />
    )
    
}