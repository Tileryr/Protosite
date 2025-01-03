import { PropsWithChildren, useState } from "react";
import { Output, Port } from "./Ports";
import { DataType, ElementNodeData } from "./types";
import SelectField from "./SelectField";
import { useReactFlow, Node } from "@xyflow/react";
import { updateElement } from "../utilities";


export interface ElementTag {
    name: string
    value: keyof HTMLElementTagNameMap
}

interface ElementNode {
    name: string
    output: true
    type: DataType
    tags: ElementTag[]
    id: string
    data: ElementNodeData
    height?: number
}

interface RootNode {
    name: string
    output: false
    tags: ElementTag[]
    type?: DataType
    id: string
    data: ElementNodeData
    height?: number
} 

type BaseNode = ElementNode | RootNode  

export default function BaseElementNode({ name, height, output, type, tags, id, data, children }: PropsWithChildren<BaseNode>) {
    const { updateNodeData } = useReactFlow();
    const [tag, setTag] = useState(tags[0].value);
    let header = <p>{name}</p>

    const tagChange = (newTag: keyof HTMLElementTagNameMap): void => {
        setTag(newTag)
        updateNodeData(id, { element: updateElement(data, 'tag', newTag) })
        console.log(newTag)
    }

    if (output) {
        if(tags.length > 1) {
            header = (
                <Output id={type}> 
                    <SelectField<keyof HTMLElementTagNameMap> 
                    options={tags} 
                    onChange={tagChange} 
                    currentValue={tag} 
                    /> 
                </Output>
            )
        } else {
            header = (
                <Output id={type} label={name} /> 
            )
        }
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