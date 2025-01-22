import { useState } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { Input, Output, Port, useInput, VerticalInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import { Position, useUpdateNodeInternals } from "@xyflow/react";
import CircleButton from "../components/Inputs/CircleButton";
import useNumberField from "../components/Inputs/NumberField";
import NodeShell from "../components/Nodes/NodeShell";

export default function TableNode({ id, data }: ElementNodeProps<'table'>) {
    const updateNodeInternals = useUpdateNodeInternals();

    const [rowAmount, setRowAmount] = useState(1)

    const tags: ElementTag[] = [{
        name: 'Table', value: 'table'
    }]

    const addRow = () => {
        setRowAmount(prev => prev + 1)
        updateNodeInternals(id)
    }

    return (
        <ElementBase tags={tags} output={true} id={id} data={data} >
            {Array.from({length: rowAmount}, (number, index) => (
                <Input
                    id='element'
                    index={index}
                    label='Row'
                    limit={true}
                    property='children'
                    key={`${id}-${index}`}
                >
                    <AddNodeButton 
                        nodeData={new ElementData({tag: 'tr'})} 
                        nodeType="table-row" 
                        connectionType="element" 
                        handleIndex={index}
                        limit={true}
                    />
                </Input>
            ))}
            <p className="justify-self-end flex items-center text-dry-purple-400">
                <CircleButton onClick={addRow}/>
                Row
            </p>
        </ElementBase>
    )
}

export function TableRowNode({ id, data }: ElementNodeProps<'table-row'>) {
    const tags: ElementTag[] = [{
        name: 'Table-Row', value: 'tr'
    }]

    const [dataSlots, setDataSlots] = useState(1)
    const dataGap = 64
    
    return (
        <div className="flex">
            <NodeShell header={<Output id="element" label={tags[0].name} limit={false}/> }>
                <div 
                    className="flex flex-row justify-around"
                    style={{ gap: dataGap }}
                >
                    {Array.from({length: dataSlots}, (number, index) => (
                        <VerticalInput index={index} key={`${id}-${index}`}> 
                            <AddNodeButton 
                                nodeData={new ElementData({tag: 'td'})} 
                                nodeType="table-data" 
                                connectionType="element"
                                handleIndex={index} 
                                limit={true}
                            />
                        </VerticalInput>
                    ))}
                </div>
            </NodeShell>
            <div 
                className="w-8 bg-bright-purple-500 self-stretch rounded-r-sm text-center text-xl leading-[3]"
                onClick={() => setDataSlots(prev => prev + 1)
            }>
                +
            </div>
        </div>
    )
}

export function TableDataNode({ id, data }: ElementNodeProps<'table-data'>) {
    const [columnSpanProps, columnSpan] = useNumberField({min: 1, max: 99, onChange: (newColSpan) => 
        data.updateAttribute('colspan', newColSpan)
    })

    const [rowSpanProps, rowSpan] = useNumberField({min: 1, max: 99, onChange: (newRowSpan) => 
        data.updateAttribute('rowspan', newRowSpan)
    })

    
    const tags: ElementTag[] = [{
        name: 'Table-Data', value: 'td'
    }]

    return (
        <ElementBase tags={tags} output={true} id={id} data={data} width={8}>

            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
            <label className="block">
                Column Span:
                <br></br>
                <input
                    {...columnSpanProps}
                    className="w-full rounded-full bg-dry-purple-950 pl-1 leading-4">
                </input>
            </label>
            <label className="block">
                Row Span:
                <br></br>
                <input {...rowSpanProps} className="w-full rounded-full bg-dry-purple-950 pl-1 leading-4" pattern="[0-9]*"></input>
            </label>
        </ElementBase>
    )
}