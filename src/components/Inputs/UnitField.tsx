import { PropsWithChildren, useState } from "react";
import useNumberField, { NumberFieldProps } from "./NumberField";

export default function UnitField({ onChange, label, min, max, children }: PropsWithChildren<Pick<NumberFieldProps, 'min' | 'max'> & {
    onChange: (value: number, unit: string) => void
    label: string
}>) {
    const [unit, setUnit] = useState('px')
    const [inputProps, inputValue] = useNumberField({
        min,
        max,
        onChange: (newValue) => onChange(newValue, unit)
    })

    const handleFontUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(event.target.value)
        onChange(inputValue, event.target.value)
    }

    return (
        <label>
            {label}
            {children}
            <div className="flex">
                <input {...inputProps} className="rounded-l-full bg-dry-purple-950 pl-1 leading-4 flex-shrink nodrag">
                </input>
                <select className="inline-block bg-dry-purple-950 rounded-r-full ml-1 flex-grow nodrag" onChange={handleFontUnitChange}>
                    <option value='px'>px</option>
                    <option value='%'>%</option>
                    <option value='rem'>rem</option>
                    <option value='em'>em</option>
                    <option value='vw'>vw</option>
                    <option value=''></option>
                </select>
            </div>
        </label>
    )
}