import { useState } from "react";
import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import Warning from "../components/Warning";

export default function VideoNode({data}: ElementNodeProps<'video'>) {
    const [validSource, setValidSource] = useState(false)
    const [validFile, setValidFile] = useState(false)

    const fileInputProps = useInput({
        portID: 'file',
        limit: true,
        onConnection: (newFile) => {
            if((newFile as File)?.type?.startsWith('video/')) {
                const fileURL = URL.createObjectURL(newFile as File)
                data.updateAttribute('src', fileURL)
                setValidFile(true)
            } else {
                setValidFile(false)
            }
        }
    })

    return (
        <ElementBase output tags={[{name: 'Video', value: 'video'}]} data={data}>
            <Port {...fileInputProps} label="File">
                <Warning on={fileInputProps.connections.length !== 0 && !validFile}/>
            </Port>
        </ElementBase>
    )
}