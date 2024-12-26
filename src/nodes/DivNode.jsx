import Input from '../components/InputPort';
import Output from '../components/OutputPort';

import ElementBase from '../components/BaseElementNode';

export default function DivNode({ id, data }) {
    return (
    <ElementBase name="Div" id={id} data={data}>
        <Output
            id='node'
            label='Element'
        />

        <Input
            id='node'
            label='Children'
            limit={false}
        />
    </ElementBase>
    )
}

