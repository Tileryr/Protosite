import { Handle, Position } from "@xyflow/react";
import { useRef } from "react";

export default function Port({ type, position, id, label, limit }) {
    const ref = useRef(null)

    // if output then just send data
    // PROBLEM outputs dont send anything cus input actually just read from our data
    // so if output then all you do update the data based on inputs
    // but inputs already update data
    // so outputs do nothing except match types

    // each input should update our nodes data accordingly
    // based on the data of the outputs from our node

    
    return (
        <div ref={ref} className={position === Position.Left ? 'justify-self-start' : 'justify-self-end' }>
            <label>{label}</label>
            <Handle 
                id={id}
                type={type}
                position={position}
                style={{ top: ref.current ? ref.current.offsetTop + 12 : 12 }}
                isConnectable={limit ? 1 : true}
            />
        </div>
    )
}