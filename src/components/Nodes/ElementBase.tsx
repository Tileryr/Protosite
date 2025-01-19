import { PropsWithChildren, useState } from "react";
import { Input, Output } from "./Ports";
import { DataType, ElementObject } from "../../types";
import SelectField from "../Inputs/SelectField";
import { useReactFlow } from "@xyflow/react";
import { updateElement } from "../../utilities";
import NodeShell from "./NodeShell";
import { AllNodeTypes } from "../../nodeutils";

export type ElementNodeData = {
    element: ElementObject
    possibleParents?: AllNodeTypes | AllNodeTypes[]
    possibleChildren?: AllNodeTypes | AllNodeTypes[]
}

export interface ElementTag {
    name: string
    value: keyof HTMLElementTagNameMap
}

interface ElementNode {
    output: boolean
    tags: ElementTag[]
    id: string
    data: ElementNodeData
    height?: number
}

export class ElementData implements ElementNodeData {
    element: ElementObject;
    possibleParents?: AllNodeTypes | AllNodeTypes[]
    possibleChildren?: AllNodeTypes | AllNodeTypes[]

    constructor({ tag, possibleParents, possibleChildren }: {
        tag: keyof HTMLElementTagNameMap, 
        possibleParents?: AllNodeTypes | AllNodeTypes[], 
        possibleChildren?: AllNodeTypes | AllNodeTypes[]
    }) {
        this.element = {
            tag: tag,
            children: [],
            renderOrder: 0,
            styling: []
        }
        this.possibleParents = possibleParents
        this.possibleChildren = possibleChildren
    }
}

export default function ElementBase({ output, tags, id, data, children }: PropsWithChildren<ElementNode>) {
    const { updateNodeData } = useReactFlow();
    const [tag, setTag] = useState(tags[0].value);
    const [renderOrder, setRenderOrder] = useState("0")

    let header = <p>{tags[0].name}</p>

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
                <Output id="element" limit={false}> 
                    <SelectField<keyof HTMLElementTagNameMap> 
                    options={tags} 
                    onChange={onTagChange} 
                    currentValue={tag} 
                    /> 
                </Output>
            )
        } else {
            header = (
                <Output id="element" label={tags[0].name} limit={false}/> 
            )
        }
    }

    return (
        <NodeShell header={header} footer={renderOrderInput}>
            {children}
            <Input
                id="styling"
                label="Styling"
                limit={false}
                property="styling"
            />
        </NodeShell>
    );
}