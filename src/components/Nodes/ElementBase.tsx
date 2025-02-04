import { PropsWithChildren, useState } from "react";
import { useInput, Output, Port } from "./Ports";
import { ElementObject } from "../../types";
import SelectField from "../Inputs/SelectField";
import NodeShell from "./NodeShell";
import { AllNodeTypes } from "../../nodeutils";
import useNumberField from "../Inputs/NumberField";

export type ElementNodeData = {
    element: ElementObject
    possibleParents?: AllNodeTypes | AllNodeTypes[]
    possibleChildren?: AllNodeTypes | AllNodeTypes[]
    updateElement(property: keyof ElementObject, value: any): void
    updateAttribute(attribute: string, value: any): void
}

export interface ElementTag {
    name: string
    value: keyof HTMLElementTagNameMap
}

interface ElementNode {
    output: boolean
    tags: ElementTag[]
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
            renderOrder: 0,
            attributes: {},
            styling: {},
            children: [],
            classes: [],
        }
        this.possibleParents = possibleParents
        this.possibleChildren = possibleChildren
        this.updateAttribute = this.updateAttribute
        this.updateElement = this.updateElement
    }

    updateElement(property: keyof ElementObject, value: any): void {
        (this.element[property] as any) = value
    }

    updateAttribute(attribute: string, value: any): void {
        this.element.attributes[attribute] = value
        console.log([attribute, value])
    }
}

export default function ElementBase({ output, tags, data, children, width }: PropsWithChildren<ElementNode> & { width?: number }) {
    const classInputProps = useInput({
        portID: 'class',
        limit: false,
        onConnection: (classes) => {
            console.log(classes)
            data.updateElement('classes', classes)
        },
    })

    const [tag, setTag] = useState(tags[0].value);

    const [renderOrderInputProps] = useNumberField({
        onChange: (newRenderOrder) => data.updateElement('renderOrder', newRenderOrder),
    })

    let header = <p>{tags[0].name}</p>

    let renderOrderInput = (
        <label className="text-xs text-dark-purple-700 p-1">
            Render Order:
            <input 
                {...renderOrderInputProps}
                className="w-6 rounded-lg bg-dark-purple-950 mx-1 focus:outline-none pl-1" 
            />
        </label>
    )

    const onTagChange = (newTag: keyof HTMLElementTagNameMap): void => {
        setTag(newTag)
        data.updateElement('tag', newTag)
        console.log(newTag)
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
        <NodeShell header={header} footer={renderOrderInput} width={width}>
            {children}
            <Port 
                {...classInputProps}
                label="Classes"
            />
        </NodeShell>
    );
}