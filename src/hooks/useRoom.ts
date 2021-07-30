import { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likeCount: number
    likeId: string | undefined
}

// Record -> tipagem de {}
type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    // string -> chave e o {} seria o valor
    likes: Record<string, {
        authorId: string
    }>
}>

export function useRoom(roomId: string) {
    const { user } = useAuth()
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        // Referência da sala
        const roomRef = database.ref(`rooms/${roomId}`)

        // Pegando dados da sala. Once -> ouvir uma única vez
        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                // value[0] -> chave e value[1] -> valor
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    // some diferentemente do find não retorna o elemento e sim se ele foi achado ou não. Ele percorre o array e retorna true ou false de acordo com a condição dentro do ()
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return { questions, title }
}