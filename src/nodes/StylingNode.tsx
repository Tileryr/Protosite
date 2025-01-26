import { useEffect, useState } from "react";
import OutputNode from "../components/Nodes/BaseOutputNode";
import InputField from "../components/Inputs/InputField";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { StylingObject } from "./css/ClassNode";

type StyleNodeData = {
    styling: StylingObject
}

type StyleNode = Node<StyleNodeData, 'styling'>

export default function StylingNode({ id, data }: NodeProps<StyleNode>) {
    const { updateNodeData } = useReactFlow()
    const [property, setProperty] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {updateNodeData(id, { styling: {[property]: value} }); console.log(data.styling)}, [property, value])
    return (
        <OutputNode name="Styling" type="styling">
            <InputField value={property} setValue={setProperty} label="Property:" type="text"/>
            <InputField value={value} setValue={setValue} label="Value:" type="text"/>
        </OutputNode>
    )
}

// styling: {background-color: red, color: blue}