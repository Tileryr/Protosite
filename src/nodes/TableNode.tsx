import { useState } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { Input } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import { useUpdateNodeInternals } from "@xyflow/react";
import CircleButton from "../components/Inputs/CircleButton";

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

    return (
        <ElementBase tags={tags} output={true} id={id} data={data}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            >
                <AddNodeButton 
                    nodeData={new ElementData({tag: 'td'})} 
                    nodeType="table-data" 
                    connectionType="element" 
                    limit={false}
                />
            </Input>
        </ElementBase>
    )
}

export function TableDataNode({ id, data }: ElementNodeProps<'table-data'>) {
    const tags: ElementTag[] = [{
        name: 'Table-Data', value: 'td'
    }]

    return (
        <ElementBase tags={tags} output={true} id={id} data={data}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
        </ElementBase>
    )
}