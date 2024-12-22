import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

function BaseElementNode({id, name, children}) {
    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl'>
            <header className='p-2 bg-gray-200 rounded-t-md'>
                <span>{name}</span>
            </header>

            <main className='p-2 rounded-b-md'>
                <div className='flex justify-between'>
                    <label>Parent</label>
                    <label>Children</label>
                </div>
                {children}
                <Handle
                    type='source' 
                    position={Position.Right}
                />
                <Handle
                    type='target'
                    position={Position.Left} 
                />
            </main>
        </div>
    )
}

export default BaseElementNode