import { useState } from "react"
import GridResizer from "../components/GridResizer"
import { convertHtml } from "../NodesToHtml"
import { Node, useNodesData, useReactFlow } from "@xyflow/react"

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { prettify } from 'htmlfy'
import { ElementNodeData } from "../components/Nodes/ElementBase";
import { useClasses } from "../nodes/ClassNode";
import Window from "./Window";

hljs.registerLanguage('xml', xml)

export default function Sidebar({ iframeRef }: {
    iframeRef: React.RefObject<HTMLIFrameElement>
}) {
    const getClasses = useClasses((state) => state.getClasses)
    const rootNode = useNodesData<Node<ElementNodeData>>('1')!

    const [srcDoc, setSrcDoc] = useState('')

    const handleRun = () => {
        let newHTML = convertHtml(rootNode.data.element, getClasses())

        setSrcDoc(newHTML)
        console.log(newHTML)
        iframeRef.current?.contentWindow?.location.reload()

    }

    const highlightedText = hljs.highlight(prettify(srcDoc), { language: "xml" }).value

    return (
         <div className='side-bar h-screen w-[30%] '>
            <button onClick={handleRun} className="w-8 aspect-square bg-bright-purple-600">Run</button>
            <div className='website-container select-none -webkit-select-none border-highlight border-2 rounded-xl'>
                <Window srcDoc={srcDoc} setSrcDoc={setSrcDoc} iframeRef={iframeRef}/>
            </div>
            <GridResizer direction='vertical' windowRef={iframeRef}/>
            <div className='side-window border-highlight border-2 rounded-xl'>
            <pre>
                <code dangerouslySetInnerHTML={{__html: highlightedText}}>
                </code>
            </pre>
            </div>
        </div>
    )
}