import { useEffect, useState } from "react";
import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import Warning from "../components/Warning";
import useTextField from "../components/Inputs/TextField";
import { FakeFile } from "./FileNode";

export default function ImageNode({id, data}: ElementNodeProps<'image'>) {
    const {text: source, textFieldProps: sourceFieldProps} = useTextField({
        onChange: (newValue) => data.updateAttribute('src', newValue)
    })

    const {textFieldProps: altFieldProps} = useTextField({
        onChange: (newValue) => data.updateAttribute('alt', newValue)
    })

    const [validSource, setValidSource] = useState(false)
    const [validFile, setValidFile] = useState(false)

    const fileInputProps = useInput({
        portID: 'file',
        limit: true,
        onConnection: (newFile) => {
            console.log(newFile)
            let file: FakeFile = newFile as FakeFile
            if(file?.type?.startsWith('image/')) {
                data.updateAttribute('src', file.url)
                setValidFile(true)
            } else {
                data.updateAttribute('src', '')
                setValidFile(false)
            }
        }
    })

    
    useEffect(() => {
        const image = new Image()
        image.onload = () => {
            if(image.width) setValidSource(true)
        }
        image.onerror = () => {
            setValidSource(false)
        }
        image.src = source
    }, [source])

    return (
        <ElementBase output={true} tags={[{ name: 'Image', value: 'img' }]} data={data}>
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
           <label>
                Alt:
                <input {...altFieldProps}/>
           </label>
        </ElementBase>
    )
}