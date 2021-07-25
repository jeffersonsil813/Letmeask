import { ButtonHTMLAttributes } from 'react'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
    return (
        // ...props (spread operator) -> para passar todas as propriedades para o botão.
        <button className="button" {...props} />
    )
}