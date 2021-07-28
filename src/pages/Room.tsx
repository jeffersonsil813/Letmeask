import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import logoImg from '../assets/images/logo.svg';
import '../styles/room.scss'

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { FormEvent, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
    id: string
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
}>

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
}

export function Room() {
    const params = useParams<RoomParams>()
    const roomId = params.id
    const { user } = useAuth()
    const [newQuestion, setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])
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
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if (newQuestion.trim() === '') {
            toast.error('The question can not be empty!', {
                duration: 2000
            })
            return
        }

        if (!user) {
            toast.error("You must be logged in!", {
                duration: 2000
            })
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            // Highlighted é o destaque que o admin dá pra determinar que essa pergunta está sendo respondida atualmente.
            isHighlighted: false,
            // foi respondida?
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('')

        // Question sent
        toast.success("Question sent!", {
            duration: 2000
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>
                                Para enviar uma pergunta, <button>faça seu login.</button>
                            </span>
                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                        <Toaster />
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
        </div>
    )
}