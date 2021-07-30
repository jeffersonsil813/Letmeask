import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

export function Button({ isOutlined = false, ...props }: ButtonProps) {
    return (
        // ...props (spread operator) -> para passar todas as propriedades para o botão.
        <button
            className={`button ${isOutlined ? 'outlined' : ''}`}
            {...props} />
    )
}