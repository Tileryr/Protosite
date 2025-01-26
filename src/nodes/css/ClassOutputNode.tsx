import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import NodeShell from "../../components/Nodes/NodeShell";
import { Output } from "../../components/Nodes/Ports";
import { useClasses } from "./ClassNode";
import { useEffect, useState } from "react";

type ClassOutputNode = Node<{class: ''}>
export default function ClassOutputNode({ id }: NodeProps<ClassOutputNode>) {
    const { updateNodeData } = useReactFlow()
    const classes = useClasses((state) => state.classes)
    const classIDs = Object.keys(classes)
    const classValues = Object.values(classes)
    const [currentClassValues, setCurrentClassValues] = useState(classValues)
    const [selectedClassIndex, setSelectedClassIndex] = useState(0)
    const [selectedClassID, setSelectedClassID] = useState('')
    const selectedClass = currentClassValues[selectedClassIndex] ?? currentClassValues[0] ?? {selector: '', styling: {}}

    useEffect(() => {
        updateNodeData(id, { class: selectedClass.selector})
    }, [selectedClass.selector])

    useEffect(() => {
        const correctedIndex = classIDs.indexOf(selectedClassID)
        if(correctedIndex === -1) {
            setSelectedClassIndex(0)
        } else {
            setSelectedClassIndex(correctedIndex)
        }
        setCurrentClassValues(classValues)
    }, [classIDs.length, classValues.length])

    useEffect(() => {
        setCurrentClassValues(classValues)
    }, [JSON.stringify(classValues)])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let newIndex = Number(event.target.value)

        setSelectedClassIndex(newIndex)
        setSelectedClassID(classIDs[newIndex])
    }

    return (
        <NodeShell header={<Output id='class' label={selectedClass.selector} limit={false}></Output>}>
            <select 
                title="Class" 
                className='nodrag appearance-none bg-bright-purple-800 rounded my-1 pl-1' 
                onChange={handleChange}
                value={selectedClassIndex}
            >
                {currentClassValues.map(({ selector }, index) => {
                    return <option value={index} 
                    className="text-dry-purple-900 bg-bright-purple-50" 
                    key={classIDs[index]}
                    >{selector}</option>
                })}
            </select>
        </NodeShell>
    )
}