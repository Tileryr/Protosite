import { useEffect, useState } from "react";
import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import Warning from "../components/Warning";
import { FakeFile } from "./FileNode";
import useTextField from "../components/Inputs/TextField";
import Checkbox from "../components/Inputs/Checkbox";

export default function VideoNode({data}: ElementNodeProps<'video'>) {
    const {text: source, textFieldProps: sourceFieldProps} = useTextField({
        onChange: (newValue) => data.updateAttribute('src', newValue)
    })
    
    const [validSource, setValidSource] = useState(false)
    const [validFile, setValidFile] = useState(false)

    const fileInputProps = useInput({
        portID: 'file',
        limit: true,
        onConnection: (newFile) => {
            let file: FakeFile = newFile as FakeFile
            if(file?.type?.startsWith('video/')) {
                data.updateAttribute('src', file.url)
                setValidFile(true)
                
            } else {
                setValidFile(false)
            }
        }
    })

    useEffect(() => {
        const video = document.createElement('video')
        video.onload = () => {
            if(video.width) setValidSource(true)
        }
        video.onerror = () => {
            setValidSource(false)
        }
        video.src = source
    }, [source])

    return (
        <ElementBase output tags={[{name: 'Video', value: 'video'}]} data={data}>
            <Port {...fileInputProps} label="File">
                <Warning on={fileInputProps.connections.length !== 0 && !validFile}/>
            </Port>
            <label>
                Source:
                <Warning on={!validSource && source !== ''}/>
                <input {...sourceFieldProps}
                placeholder="Link" 
                disabled={fileInputProps.connections.length !== 0}
                >
                </input>
            </label>
            <Checkbox label="Controls?" onCheck={(checked) => data.updateAttribute('controls', checked)}/>
            <Checkbox label="Autoplay?" onCheck={(checked) => data.updateAttribute('autoplay', checked)}/>
            <Checkbox label="Autoplay?" onCheck={(checked) => data.updateAttribute('loop', checked)}/>
        </ElementBase>
    )
}