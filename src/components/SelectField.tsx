import { randomID } from "../utilities"

interface SelectOption<valueType extends string> {
    name: string
    value: valueType
}

export interface Field<valueType extends string> {
    options: SelectOption<valueType>[] 
    currentValue: valueType
    onChange(x: valueType): void
}
// SETING TYPE GENERICS

export default function SelectField<valueType extends string>({options, currentValue, onChange}: Field<valueType>) {
    return (
        <select aria-label="Select-field" onChange={event => onChange(event.target.value as valueType)} value={currentValue} className='noDrag'>
            {options.map(option => 
                <option value={option.value} key={randomID()} >{option.name}</option>
            )}
        </select>
    )
}