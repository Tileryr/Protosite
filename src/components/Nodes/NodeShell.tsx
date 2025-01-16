import { PropsWithChildren, ReactElement } from "react";

export default function NodeShell({header, height, children}: PropsWithChildren<{
    header: ReactElement
    height?: number
}>) {
    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl shell' style={{height: height ? `${height}px` : 'auto'}}>
            <header className='p-2 bg-gray-200 header'>
                {header}
            </header>

            <div className='p-2 rounded-b-md'>
                <div className='grid grid-flow-row grid-cols-1'>
                    {children}
                </div>
            </div>
        </div>
    )
}