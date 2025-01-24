import { useState } from "react"

export default function useTextField({ onChange }: { onChange: (x: string) => void }) {
    const [text, setText] = useState('')

    const textFieldProps = {
        className: "block w-full rounded-full bg-dry-purple-950 pl-1 leading-4 placeholder:text-dark-purple-900 invalid:text-background nodrag disabled:bg-dark-purple-950", 
        value: text, 
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value)
            onChange(event.target.value)
        },
    }

    return { textFieldProps, text }
}