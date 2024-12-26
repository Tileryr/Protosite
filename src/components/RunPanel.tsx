import {
    Node,
    Panel,
    useNodesData 
} from "@xyflow/react";

import { convertHtml } from '../NodesToHtml';

export default function RunPanel({ html }: {
    html: React.Dispatch<React.SetStateAction<string>>
}) {
    
    const rootNode = useNodesData('1')
2
    return (
        <Panel>
            <button onClick={() => html(convertHtml(rootNode!))}>Run</button>
        </Panel>
    )
}