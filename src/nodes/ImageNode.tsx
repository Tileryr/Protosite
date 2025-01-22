import ElementBase from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { ElementNodeProps } from "../nodeutils";

export default function ImageNode({id, data}: ElementNodeProps<'image'>) {
    const fileInputProps = useInput({
        portID: 'filesrc',
        limit: true,
        onConnection: (newFile) => {
            data.updateAttribute('src', newFile)
        }
    })

    return (
        <ElementBase output={true} tags={[{ name: 'Image', value: 'img' }]} id={id} data={data}>
            <Port 
                {...fileInputProps}
                label="File"
            />
        </ElementBase>
    )
}