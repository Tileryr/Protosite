import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

function BaseElementNode() {
    return (
        <>
            <Handle position={Position.Right} />
            <div>
                <label htmlFor="text">Child</label>
                <input id="text" name="text" className="nodrag" />
            </div>
        </>
    )
}

export default BaseElementNode