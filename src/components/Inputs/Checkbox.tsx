import { useState } from "react"

export default function Checkbox({ label }: {
    label: string
}) {
    const [checked, setChecked] = useState(false)
    const handleCheck = () => {
        setChecked(checkStatus => !checkStatus)
    }

    return (
        <label className="flex gap-1 items-center mt-1">
            

            {label}
            <input type="checkbox" 
            className='checkbox border-green-400 [--chkbg:theme(colors.green.400)] [--chkfg:theme(colors.white.50)] checkbox-sm inline-block' 
            onChange={handleCheck} 
            checked={checked}>
            </input>

        </label>
    )
}