import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react';

import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from "../components/Button"
import { database } from '../services/firebase';

export function NewRoom() {
    const { user } = useAuth()
    const history = useHistory()
    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim() === '') {
            return
        }

        // lá dentro do banco de dados eu vou ter uma separação chamada rooms.
        const roomRef = database.ref('rooms')

        // Jogando informação pra dentro de rooms
        const firebaseRoom = await roomRef.push({
            // Título da sala
            title: newRoom,
            authorId: user?.id,
        })

        // Depois de criar a sala, o usuário é redirecionado para a sala com o id dela. Key = id da sala.
        history.push(`/room/${firebaseRoom.key}`)
    }

    return <>
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>

                    {/* Como aqui eu tenho uma âncora (<a>) posso usar o Link do react-router-dom */}
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    </>
}