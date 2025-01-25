import { useEffect, useMemo, useRef, useState } from "react"
import GridResizer from "../components/GridResizer"
import { convertHtml } from "../NodesToHtml"
import { Node, useNodesData } from "@xyflow/react"

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import { prettify } from 'htmlfy'
import { ElementNodeData } from "../components/Nodes/ElementBase";

hljs.registerLanguage('xml', xml)

export default function Sidebar({ iframeRef }: {
    iframeRef: React.RefObject<HTMLIFrameElement>
}) {
    const rootNode = useNodesData<Node<ElementNodeData>>('1')!

    const [srcDoc, setSrcDoc] = useState('')

    const handleRun = () => {
        console.count()
        const iframeDoc = iframeRef.current?.contentWindow?.document
        if(iframeDoc) {
          const media: NodeListOf<HTMLMediaElement> = iframeDoc.querySelectorAll('video, audio')
          media.forEach((mediaElement) => {
            
            mediaElement.pause()
            mediaElement.src = "";
            mediaElement.remove()
          })
        }
        let newHTML = convertHtml(rootNode.data.element)
        setSrcDoc(`
            <html>
                <body>
                ${newHTML}
                </body>
            </html>
        `)
        console.log(newHTML)
        iframeRef.current?.contentWindow?.location.reload()

    }

    const handleLoad = () => {
        const iframeDoc = iframeRef.current?.contentWindow?.document
        const mediaElements = iframeDoc?.querySelectorAll<HTMLMediaElement>('video, audio')
        // console.log(iframeRef.current?.contentWindow?.document)
        mediaElements?.forEach((mediaElement) => {
            console.log(mediaElement)
            if(mediaElement?.dataset?.autoplay === 'true') {
                mediaElement.autoplay = true
                mediaElement.play()
                delete mediaElement.dataset.autoplay
            }            
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
            <button onClick={() => {}}>Locked</button>
            </div>
        </div>
    )
}