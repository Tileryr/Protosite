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

    const onTagChange = (newTag: keyof HTMLElementTagNameMap): void => {
        setTag(newTag)
        updateNodeData(id, { element: updateElement(data, 'tag', newTag) })
        console.log(newTag)
    }

    const changeRenderOrder = (value: string) => {
        let formattedValue = value ? Number(value).toString() : ''
        setRenderOrder(formattedValue)
        updateNodeData(id, { element: updateElement(data, 'renderOrder', Number(value))})
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
        <NodeShell header={header} height={height}>
            {children}
            <div className="mt-0"></div>
            <Input
                id="styling"
                label="Styling"
                limit={false}
                property="styling"
            />
            <label className="text-xs justify-self-end">
                Render Order:
                <input 
                    type="number" 
                    className="w-14" 
                    onMouseDownCapture={(event) => event.stopPropagation()}
                    value={renderOrder} 
                    onChange={(event) => changeRenderOrder(event.target.value)}
                    onBlur={() => {!renderOrder && (changeRenderOrder("0")); console.log("a")}}
                />
            </label>
        </NodeShell>
    );
}