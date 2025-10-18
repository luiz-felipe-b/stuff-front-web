import React from "react";

interface InputButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    className?: string;
}

const InputButton: React.FC<InputButtonProps> = ({ icon, className = "", ...props }) => (
    <button
        type="button"
        tabIndex={-1}
        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer rounded-full text-stuff-light focus:outline-none hover:bg-stuff-light/20 ${className}`}
        {...props}
    >
        {icon}
    </button>
);

export default InputButton;
