import { useCallback } from 'react';
import { 
    Handle,
    Position, 
    useReactFlow,
    useNodesData,
    useHandleConnections,
} from '@xyflow/react';

function HtmlNode({id, data}) {
    const children = useHandleConnections({
        type: 'source',
        id: 'children',
    })
    const childrenIDs = children.map(child => child?.target)
    const childrenNodes = useNodesData(childrenIDs)
    const childTypes = childrenNodes.map(childNode => childNode?.data.type)
    // updateNodeData(id, {children: children})
    
    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl'>
            <header className='p-2 bg-gray-200 rounded-t-md'>
                <span>HTML</span>
            </header>

            <main className='p-2 rounded-b-md'>
                <div className='flex justify-end'>
                    <label>Children</label>
                    <Handle
                        type='source' 
                        position={Position.Right}
                        id='children'
                        style={{top: 60}}
                    />
                </div>
                <button onClick={console.log(childTypes)}>CHILDREN</button>
            </main>
        </div>
    )
}

export default HtmlNode;