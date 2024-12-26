import {
    Panel,
    useNodesData 
} from "@xyflow/react";

import { convertHtml } from '../NodesToHtml';

export default function RunPanel({ html }) {
    const rootNode = useNodesData('1')

    return (
        <Panel>
            <button onClick={() => html(convertHtml(rootNode))}>Run</button>
        </Panel>
    )
}