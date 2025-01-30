import { useInput, Port } from '../components/Nodes/Ports'
import ElementBase, { ElementTag } from '../components/Nodes/ElementBase'
import { ElementNodeProps } from '../nodeutils'

export default function ParagraphNode({ id, data }: ElementNodeProps<'paragraph'>) {
    const childrenInputProps = useInput({
        portID: "string",
        limit: false,
        onConnection: (newText) => {
            data.updateElement('text', newText)
        }
    })

    const tags: ElementTag[] = [
        { name: "Paragraph", value: "p" },
        { name: "Span", value: "span" },
        { name: "Code", value: "code" },
    ]

    return (
    <ElementBase output={true} tags={tags} data={data}>
        <Port
            {...childrenInputProps}
            label='Text'
        />
    </ElementBase>
    )
}