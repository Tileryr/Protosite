import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import OutputNode from "../components/Nodes/BaseOutputNode";
import { useRef, useState } from "react";

type FileNodeData = {
    filesrc: string
}

type FileNode = Node<FileNodeData, 'file'>

export default function FileNode({ id, data }: NodeProps<FileNode>) {
    const { updateNodeData } = useReactFlow()
    const [currentFile, setCurrentFile] = useState<string | null>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = fileInputRef.current?.files
        if(!files) return
        const filesrc = URL.createObjectURL(files[0])
        setCurrentFile(filesrc)
        updateNodeData(id, { filesrc: filesrc})
    }

    return (
        <OutputNode name="File" type="filesrc">
            <label onClick={() => console.log(currentFile)}>
                File
                <input type="file" accept="image/*,audio/*,video/*" onChange={onChange} ref={fileInputRef}>
                
                </input>
            </label>
        </OutputNode>
    )
}