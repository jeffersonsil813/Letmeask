import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

type User = {
    id: string,
    name: string,
    avatar: string
}

type AuthContextType = {
    // User ou indefinido
    user: User | undefined,
    signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
    // ReactNode porque recebe um componente
    children: ReactNode
}

// Criando um contexto para compartilhar informações entre os componentes. createContext({} -> formato do valor que será passado para o contexto, poderia ser '', [], false, true)
// export const AuthContext = createContext({} as any -> isso para ignorar o typescript)
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    // <User> -> o state é do tipo User
    const [user, setUser] = useState<User>()

    // useEffect é um hook que dispara uma função sempre que algo acontece. O segundo parâmetro sempre vai ser um array. Como o array está vazio a função é disparada uma única vez.
    useEffect(() => {
        // se for detectado que o usuário já tinha logado na aplicação anteriormente. Isso tudo serve para trazer os dados do usuário na tela, ou seja, mesmo que o usuário feche a aplicação ou dê um F5, as informações ficarão acessíveis.
        const unsubscribe = auth.onAuthStateChanged(user => {
            // O usuário tem informações?
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.')
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            // toda vez que o useEffect for utilizado e dentro dele houver um eventListener, é recomendado se livrar dessas "ouvidorias" de eventos, para evitar erros futuros. -> Boa prática
            unsubscribe()
        }
    }, [])

    async function signInWithGoogle() {
        // autenticação com o google
        const provider = new firebase.auth.GoogleAuthProvider()

        // Login com Popup
        const result = await auth.signInWithPopup(provider)

        // foi retornado um usuário dessa autenticação?
        if (result.user) {
            // nome do usuário, link da foto de perfil do google do usuário e o uid é o identificador único daquele usuário
            const { displayName, photoURL, uid } = result.user

            // se o usuário não tiver um nome ou uma foto
            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })

        }
    }

    return <>
        {/* Todo provider precisa de um value(valor do contexto) */}
        {/* value={{ user }} -> compartilhando as informações do usuário que está logado e a função para logar. */}
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    </>
}