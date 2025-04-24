// components/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`
        cursor-pointer
        bg-gradient-to-b from-indigo-500 to-indigo-600
        shadow-[0px_4px_32px_0_rgba(99,102,241,.70)]
        px-6 py-3
        rounded-xl
        border-[1px] border-slate-500
        text-white font-medium
        group
        ${className}
      `}
    >
      <div className="relative overflow-hidden h-6">
        <p className="transform group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {children}
        </p>
        <p className="absolute top-7 left-0 transform group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {children}
        </p>
      </div>
    </button>
  )
}

export default Button
