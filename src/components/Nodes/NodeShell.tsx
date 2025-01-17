import { PropsWithChildren, ReactElement } from "react";

export default function NodeShell({header, footer, height, children}: PropsWithChildren<{
    header: ReactElement
    footer?: ReactElement
    height?: number
}>) {
    return (
        <div className='w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl shell' style={{height: height ? `${height}px` : 'auto'}}>
            <header className='header'>
                {header}
            </header>

            <main className='p-2 rounded-b-md'>
                {children}
            </main>

            <footer className="bg-dry-purple-950 flex justify-end">
                {footer}
            </footer>
        </div>
    )
}