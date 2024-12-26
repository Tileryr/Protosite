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
            data: { children: [], element: 'div' },
            position: { x: 300, y: 300 },
            type: 'DivNode',
        }])
    }
    
    return (
        <Panel position='top-right'>
            <button onClick={newNode}>Div</button>
        </Panel>
    )
}

export default DivPanel;