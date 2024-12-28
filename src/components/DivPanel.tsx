import {
    Panel,
    useReactFlow
} from '@xyflow/react';

import { randomID } from '../utilities';

function DivPanel() {
    const { addNodes } = useReactFlow();

    function newNode() {
        addNodes([{
            id: randomID(),
            data: { element: {
                tag: 'div',
                children: []
            }},
            position: { x: 300, y: 300 },
            type: 'div',
        }])
    }
    
    return (
        <Panel position='top-right'>
            <button onClick={newNode}>Div</button>
        </Panel>
    )
}

export default DivPanel;