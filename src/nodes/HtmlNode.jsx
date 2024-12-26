import Input from '../components/InputPort'

import ElementBase from '../components/BaseElementNode'

export default function HtmlNode({ id }) {
    return (
        <ElementBase name="HTML" id={id} type='root'>
            <Input
                id='node'
                label='Children'
                limit={false}
            />
        </ElementBase>
    )
}
