import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react"

export default function useNumberField({ onChange, min = 0, max = 99 }: {
    onChange?: (x: number) => void
    min?: number
    max?: number
}): [DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number] {
    const [number, setNumber] = useState<number>(min)
    const [visibleNumber, setVisibleNumber] = useState<string>(number.toString())

    const changeRenderOrder = (value: string) => {
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
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeRenderOrder(event.target.value),
        onBlur: () => {
            if(visibleNumber !== '')  return
            changeRenderOrder(min.toString())
        }
    }

    return [inputProps as DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number]
}