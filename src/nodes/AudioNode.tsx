import { useEffect, useState } from "react";
import useTextField from "../components/Inputs/TextField";
import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import Warning from "../components/Warning";
import { ElementNodeProps } from "../nodeutils";
import { FakeFile } from "./FileNode";
import Checkbox from "../components/Inputs/Checkbox";

export default function AudioNode({ data }: ElementNodeProps<'audio'>) {
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
            if(file?.type?.startsWith('audio/')) {
                data.updateAttribute('src', file.url)
                setValidFile(true)
            } else {
                setValidFile(false)
            }
        }
    })

    
    useEffect(() => {
        const audio = new Audio()
        audio.onload = () => {
            if(audio.duration) setValidSource(true)
        }
        audio.onerror = () => {
            setValidSource(false)
        }
        audio.src = source
    }, [source])
    
    return (
        <ElementBase data={data} output tags={[{ name: 'Audio', value: 'audio' }]}>
            <Port 
                {...fileInputProps}
                label="File"
            >
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
        </ElementBase>
    )
}