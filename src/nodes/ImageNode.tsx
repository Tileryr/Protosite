import { useEffect, useMemo, useState } from "react";
import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";
import Warning from "../components/Warning";
import useTextField from "../components/Inputs/TextField";

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
            let file: any = newFile
            if(file?.type?.startsWith('image/')) {
                data.updateAttribute('src', file.url)
                setValidFile(true)
            } else {
                setValidFile(false)
            }
        }
    })

    
    useEffect(() => {
        const URLIsImage = async (URL: string) => {
            try {
                const res = await fetch(URL)
                if(!res.ok) {
                    throw new Error('no image :/')   
                }
                const blob = await res.blob()
                setValidSource(blob.type.startsWith('image/'))
                
            } catch (error) {
                setValidSource(false)
            } 
        }
        URLIsImage(source)
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