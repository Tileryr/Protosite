import { Node, NodeProps } from "@xyflow/react";
import OutputNode from "../components/Nodes/BaseOutputNode";
import { useRef, useState } from "react";

type FileNodeData = {
    filesrc: string
}

type FileNode = Node<FileNodeData, 'file'>

export default function FileNode({ id }: NodeProps<FileNode>) {
    const [currentFile, setCurrentFile] = useState<string | null>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = fileInputRef.current?.files
        if(!files) return
        setCurrentFile(URL.createObjectURL(files[0]))
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