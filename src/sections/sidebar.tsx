import { useState } from "react"
import GridResizer from "../components/GridResizer"
import { convertHtml } from "../NodesToHtml"
import { Node, useNodesData, useReactFlow } from "@xyflow/react"

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { prettify } from 'htmlfy'
import { ElementNodeData } from "../components/Nodes/ElementBase";
import { useClasses } from "../nodes/ClassNode";

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

    const handleLoad = () => {
        const iframeDoc = iframeRef.current?.contentWindow?.document
        const mediaElements = iframeDoc?.querySelectorAll<HTMLMediaElement>('[data-autoplay=true]')

        mediaElements?.forEach((mediaElement) => {
            mediaElement.autoplay = true
            delete mediaElement.dataset.autoplay         
        })

        const currentDocHTML = iframeDoc!.querySelector('html')!.outerHTML
        setSrcDoc(currentDocHTML)
    }

    const highlightedText = hljs.highlight(prettify(srcDoc), { language: "xml" }).value

    return (
         <div className='side-bar h-screen w-[30%] '>
            <button onClick={handleRun} className="w-8 aspect-square bg-bright-purple-600">Run</button>
            <div className='website-container select-none -webkit-select-none border-highlight border-2 rounded-xl'>
            <iframe
                title='window'
                className='website-display select-none -webkit-select-none'
                id='frame'
                srcDoc={srcDoc}
                onLoad={handleLoad}
                ref={iframeRef}
            />
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