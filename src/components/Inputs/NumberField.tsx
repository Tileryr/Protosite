import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react"

export default function useNumberField({ onChange, min = 0, max = 99 }: {
    onChange?: (x: number) => void
    min?: number
    max?: number
}): [DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number] {
    const [number, setNumber] = useState(min)

    const changeRenderOrder = (value: string) => {
        let numericValue = Number(value)
        numericValue = Math.min(numericValue, max)
        numericValue = Math.max(numericValue, min)
        let formattedValue = !isNaN(numericValue) ? numericValue : number
        setNumber(formattedValue)
        onChange?.(formattedValue)
    }

    const inputProps = {
        inputMode: "numeric",
        value: number,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeRenderOrder(event.target.value)
    }

    return [inputProps as DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, number]
}