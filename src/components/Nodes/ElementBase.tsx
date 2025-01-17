import { PropsWithChildren, useCallback, useState } from "react";
import { Input, Output } from "./Ports";
import { DataType, ElementNodeData, ElementObject } from "../types";
import SelectField from "../SelectField";
import { useReactFlow } from "@xyflow/react";
import { updateElement } from "../../utilities";
import NodeShell from "./NodeShell";


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

export class ElementData {
    element: ElementObject;

    constructor(tag: keyof HTMLElementTagNameMap) {
        this.element = {
            tag: tag,
            children: [],
            renderOrder: 0,
            styling: []
        }
    }
}

export default function ElementBase({ name, height, output, tags, id, data, children }: PropsWithChildren<BaseNode>) {
    const { updateNodeData } = useReactFlow();
    const [tag, setTag] = useState(tags[0].value);
    const [renderOrder, setRenderOrder] = useState("0")

    let header = <p>{name}</p>
    let renderOrderInput = (
        <label className="text-xs text-dark-purple-700 p-1">
            Render Order:
            <div className="bg-dark-purple-950 rounded-lg inline">
            <input 
                inputMode="numeric"
                className="w-4 rounded-lg bg-dark-purple-950/0 mx-1 focus:outline-none" 
                onMouseDownCapture={(event) => event.stopPropagation()}
                value={renderOrder} 
                onChange={(event) => {changeRenderOrder(event.target.value); console.log(event.target.value)}}
                onBlur={() => {renderOrder === "" && (changeRenderOrder("0")); console.log(renderOrder)}}
            />
            </div>
        </label>
    )

    const onTagChange = (newTag: keyof HTMLElementTagNameMap): void => {
        setTag(newTag)
        updateNodeData(id, { element: updateElement(data, 'tag', newTag) })
        console.log(newTag)
    }

    const changeRenderOrder = (value: string) => {
        let numericValue = Number(value)
        numericValue = Math.min(numericValue, 99)
        numericValue = Math.max(numericValue, 0)
        let formattedValue = !isNaN(numericValue) ? numericValue.toString() : renderOrder
        setRenderOrder(formattedValue)

        updateNodeData(id, { element: updateElement(data, 'renderOrder', numericValue)})
    
        console.log(value)
    }

    if (output) {
        if(tags.length > 1) {
            header = (
                <Output id={"element"}> 
                    <SelectField<keyof HTMLElementTagNameMap> 
                    options={tags} 
                    onChange={onTagChange} 
                    currentValue={tag} 
                    /> 
                </Output>
            )
        } else {
            header = (
                <Output id={"element"} label={name} /> 
            )
        }
    }

    return (
        <NodeShell header={header} footer={renderOrderInput} height={height}>
            {children}
            <div className="mt-0"></div>
            <Input
                id="styling"
                label="Styling"
                limit={false}
                property="styling"
            />
        </NodeShell>
    );
}