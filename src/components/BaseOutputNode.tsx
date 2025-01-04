import { PropsWithChildren } from "react";
import { Output } from "./Ports";
import { DataType } from "./types";
import NodeShell from "./NodeShell";

export default function OutputNode({ name, height, type, children }: PropsWithChildren<{
    name: string
    height?: number
    type: DataType
}>) {
    const header = <Output id={type} label={name} /> 

    return (
        <NodeShell header={header} height={height}> 
            {children}
        </NodeShell>
    );
}