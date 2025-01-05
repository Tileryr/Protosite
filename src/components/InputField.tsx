import { HTMLInputTypeAttribute } from "react"

export default function InputField({ value, setValue, label, type, }: { 
    value: any
    setValue: React.Dispatch<React.SetStateAction<any>>
    label: string 
    type: HTMLInputTypeAttribute
}) {
    return (
        <label htmlFor={label}>
            {label}
            <input id={label} className="nodrag" type={type} value={value} onChange={(event) => setValue(event.target.value)}></input>
        </label>

    )
}