import { PropsWithChildren } from "react";

export default function BaseElementNode({ name, height, children }: PropsWithChildren<{
    name: string
    height?: number
}>) {
    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl' style={{height: height ? `${height}px` : 'auto'}}>
            <header className='p-2 bg-gray-200 rounded-t-md'>
                <span>{name}</span>
            </header>

            <div className='p-2 rounded-b-md'>
                <div className='grid grid-flow-row grid-cols-1'>
                    {children}
                </div>
            </div>
        </div>
    );
}