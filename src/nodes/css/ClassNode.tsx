import { Node, NodeProps } from "@xyflow/react"
import NodeShell from "../../components/Nodes/NodeShell"
import { useEffect, useState } from "react"
import { create } from 'zustand'
import { Port, useInput } from "../../components/Nodes/Ports"

type Classes = Record<string, ClassInterface>

export type StylingObject = Partial<Record<keyof CSSStyleDeclaration, any>>

export interface ClassInterface {
    selector: string
    styling: StylingObject
}

type State = {
    classes: Classes
    imports: Record<string, string[]>
}

type Action = {
    updateClasses: (newClass: ClassInterface, id: string) => void
    updateClassSelector: (id: string, selector: string) => void
    updateClassStyling: (id: string, styling: Record<string, unknown>) => void
    removeClass: (id: string) => void
    getClass: (id: string) => ClassInterface
    getClasses: () => ClassInterface[]
    isSelectorTaken: (selector: string, ignore?: string) => boolean

    updateImports: (id: string, newImports: string[]) => void
    getImports: () => string[]
}

export const useClasses = create<State & Action>()((set, get) => ({
    classes: {},
    imports: {},
    updateClasses: (newClass, id) => set((state) => ({ classes: {...state.classes, [id]: newClass} })),
    updateClassSelector: (id, selector) => set((state) => ({ classes: {...state.classes, [id]: {
        ...state.classes[id],
        selector: selector
    } } })),
    updateClassStyling: (id, styling) => set((state) => ({ classes: {...state.classes, [id]: {
        ...state.classes[id],
        styling: styling
    } } })),
    removeClass: (id) => {
        const {[id]: {}, ...rest} = get().classes
        set(() => ({classes: rest}))
    },
    getClass: (id) => {
        return get().classes[id]
    },
    getClasses: () => Object.values(get().classes),
    getSelector: () => {},
    isSelectorTaken: (selector, ignore) => {
        const {[ignore ?? '']: {}, ...rest} = get().classes
        return Object.values(rest).some(({selector: currentSelector}) => currentSelector === selector)
    },

    updateImports: (id, newImports) => set((state) => ({ imports: {...state.imports, [id]: newImports}})),
    getImports: () => Object.values(get().imports).flat()
}))

export type ClassNodeData = { className: string }
export type ClassNode = Node<ClassNodeData, 'class'>

export default function ClassNode({ id }: NodeProps<ClassNode>) {
    const classAmount = useClasses((state) => Object.keys(state.classes).length)

    const [className, setClassName] = useState(`class${classAmount ? '-' + classAmount : ''}`)

    const updateClass = useClasses((state) => state.updateClasses)
    const updateImports = useClasses((state) => state.updateImports)
    const updateSelector = useClasses((state) => state.updateClassSelector)
    const updateStyling = useClasses((state) => state.updateClassStyling)
    const isSelectorTaken = useClasses((state) => state.isSelectorTaken)

    const currentStyling = useClasses((state) => state.classes[id]?.styling ?? {})

    const stylingInputProps = useInput({ portID: 'styling', limit: false, onConnection: (style, allStyling) => {
        const styling: StylingObject[] = style as StylingObject[] ?? []
        const imports: string[] = allStyling.map(styling => {
            return styling.imports as string[]
        }).flat()
        const mergedStyling = styling.reduce((currentStyling, newStyling) => {
            return {...currentStyling, ...newStyling}
        }, {})
        updateStyling(id, mergedStyling)
        updateImports(id, imports)
    }})

    useEffect(() => {
        updateClass({
            selector: className,
            styling: {}
        }, id)
    }, [id])
    
    const handleClassNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassName(event.target.value)
        updateSelector(id, event.target.value)
        console.log(currentStyling)
    }

    const handleBlur = () => {
        if(!className) {
            setClassName('Class')
            updateSelector(id, 'Class')
        }
        if(isSelectorTaken(`${className}`, id)) {
            setClassName(`${className}-1`)
            updateSelector(id, `${className}-1`)
        }
    }

    return (
        <NodeShell header={
            <input 
                aria-label="Class Name" 
                value={className} 
                onChange={handleClassNameChange}
                onBlur={handleBlur}
                className="bg-transparent nodrag focus:border-none focus:outline-none w-full"
            ></input>
        }>
        <Port 
            {...stylingInputProps}
            label="Styling"
        />
        </NodeShell>
    )
}