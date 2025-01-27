import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import NodeShell from "../../components/Nodes/NodeShell";
import { Output } from "../../components/Nodes/Ports";
import { useClasses } from "./ClassNode";
import { useEffect, useState } from "react";

type ClassOutputNode = Node<{class: ''}>
export default function ClassOutputNode({ id, selected }: NodeProps<ClassOutputNode>) {
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
            <div className={`bg-green-600 px-1 py-1 rounded outline-2
                ${selected ? "outline-green-400 outline" : " outline-white-50 hover:outline"}
            `}>
                <Output id='class' label='' limit={false}>
                    <select 
                        title="Class" 
                        className='appearance-none bg-green-500 rounded px-1 min-w-32' 
                        onChange={handleChange}
                        value={selectedClassIndex}
                    >
                        {currentClassValues.map(({ selector }, index) => {
                            return <option value={index} 
                            className="text-dry-purple-900 bg-bright-purple-50 w-full" 
                            key={classIDs[index]}
                            >{selector}</option>
                        })}
                    </select>
                </Output>
                
            </div>
    )
}