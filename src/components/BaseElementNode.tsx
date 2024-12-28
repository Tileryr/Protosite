import { PropsWithChildren } from "react";
import { Output, Port } from "./Ports";
import { DataType } from "./types";

interface ElementNode {
    name: string
    height?: number
    output: true
    type: DataType
}

interface RootNode {
    name: string
    height?: number
    output?: false
    type?: undefined
} 

type BaseNode = ElementNode | RootNode  
export default function BaseElementNode({ name, height, output, type, children, }: PropsWithChildren<BaseNode>) {
    let header = <p>{name}</p>

    if (output) {
        header = <Output id={type} label={name} />
    }

    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl' style={{height: height ? `${height}px` : 'auto'}}>
            <header className='p-2 bg-gray-200 rounded-t-md'>
                {header}
            </header>

            <div className='p-2 rounded-b-md'>
                <div className='grid grid-flow-row grid-cols-1'>
                    {children}
                </div>
            </div>
        </div>
    );
}