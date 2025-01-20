import { ButtonHTMLAttributes } from "react";

export default function CircleButton({ disabled, onClick }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className="rounded-full h-4 aspect-square flex justify-center items-center mr-1
        bg-dry-purple-500 hover:bg-dry-purple-400 active:bg-dry-purple-300 active:text-dark-purple-900 disabled:bg-dry-purple-950 disabled:text-dry-purple-800"
        onClick={onClick} disabled={disabled}>
            <span>+</span>
        </button>
    )
}