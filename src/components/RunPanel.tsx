import {
    Node,
    Panel,
    useNodesData 
} from "@xyflow/react";

import { convertHtml } from '../NodesToHtml';
import { ElementNodeData } from "./Nodes/ElementBase";

export default function RunPanel({ html }: {
    html: React.Dispatch<React.SetStateAction<string>>
}) {
    const rootNode = useNodesData<Node<ElementNodeData>>('1')!
    return (
        <Panel>
            <button onClick={() => {
                
                html(convertHtml(rootNode.data.element))
            }}>Run</button>
        </Panel>
    )
}