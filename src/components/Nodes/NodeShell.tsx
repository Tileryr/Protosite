import { useNodeId, useReactFlow } from "@xyflow/react";
import { PropsWithChildren, ReactElement } from "react";

export default function NodeShell({header, footer, height, width, children}: PropsWithChildren<{
    header?: ReactElement
    footer?: ReactElement
    height?: number
    width?: number
}>) {
    const { getNode } = useReactFlow()
    const nodeID = useNodeId()!
    const selected = getNode(nodeID)?.selected ?? false

    return (
        <div 
            className={`rounded-sm bg-white shadow-xl shell inline-block outline-2
                ${selected ? "outline-bright-purple-400 outline" : " outline-white-50 hover:outline"}
            `}
            style={{
                height: height ? `${height}px` : 'auto',
                minWidth: width ? `${width}rem` : '16rem',
                
            }}
        >
            <header className='header rounded-t-sm'>
                {header}
            </header>

            <main className='p-2 rounded-b-md'>
                {children}
            </main>

            <footer className="bg-dry-purple-950 flex justify-end rounded-b-sm">
                {footer}
            </footer>
        </div>
    )
}