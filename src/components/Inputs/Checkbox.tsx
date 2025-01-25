import { useState } from "react"

export default function Checkbox({ label, onCheck }: {
    label: string
    onCheck: (status: boolean) => void
}) {
    const [checked, setChecked] = useState(false)

    const handleCheck = () => {
        onCheck(!checked)
        setChecked(checkStatus => !checkStatus)
    }

    return (
        <label className="flex gap-1 items-center mt-1">
            <input type="checkbox" 
            className='checkbox border-green-400 [--chkbg:theme(colors.green.400)] [--chkfg:theme(colors.white.50)] checkbox-sm inline-block' 
            onChange={handleCheck} 
            checked={checked}>
            </input>

            {label}
            

        </label>
    )
}