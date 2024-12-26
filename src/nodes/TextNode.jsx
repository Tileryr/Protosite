import ElementBase from '../components/BaseElementNode'
import Output from '../components/OutputPort'

export default function TextNode({ id, data }) {
    return (
    <ElementBase name="Text" id={id} type='input' height='300px'>
        <textarea className='w-full h-full'>

        </textarea>
    </ElementBase>
    )
}