import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react"

export interface NumberFieldProps {
    onChange?: (x: number) => void
    onBlur?: (x: number) => number
    min?: number
    max?: number
}
export default function useNumberField({ onChange, onBlur, min = 0, max = 99 }: NumberFieldProps):
[DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number] 
{
    const [number, setNumber] = useState<number>(min)
    const [visibleNumber, setVisibleNumber] = useState<string>(number.toString())

    const reformatNumber = (value: string) => {
        if(value === '') {setVisibleNumber(''); return}
        let numericValue = Number(value.replace(/\D/g,''))
        numericValue = Math.min(numericValue, max)
        numericValue = Math.max(numericValue, min)
        let formattedValue = !isNaN(numericValue) ? numericValue : number
        setNumber(formattedValue)
        setVisibleNumber(formattedValue.toString())
        onChange?.(formattedValue)
    }

    const inputProps = {
        inputMode: "numeric",
        value: visibleNumber,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setVisibleNumber(event.target.value)
            if(!isNaN(Number(event.target.value))) {
                setNumber(Number(event.target.value))
            } else {
                setNumber(min)
            }
        },
        onBlur: () => {
            if(onBlur) {
                reformatNumber(onBlur(number).toString())
                return
            }
            reformatNumber(visibleNumber)
        }
    }

    return [inputProps as DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number]
}