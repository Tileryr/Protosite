import Input from '../components/InputPort'
import Output from '../components/OutputPort'
import ElementBase from '../components/BaseElementNode'

export default function ParagraphNode({ id, }) {
    return (
    <ElementBase name="Paragraph" id={id} type='input'>
        <Output
            id='node'
            label='Element'
        />
        <Input
            id='string'
            label='String'
            limit={false}
        />
    </ElementBase>
    )
}