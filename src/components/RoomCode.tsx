import toast from 'react-hot-toast'
import copyImg from '../assets/images/copy.svg'
import '../styles/room-code.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        // API do navegador para copiar (não roda em alguns navegadores)
        navigator.clipboard.writeText(props.code)
        toast.success('Copied!', {
            duration: 1000,
            position: 'top-center'
        })
    }

    return (
        <button onClick={copyRoomCodeToClipboard} className="room-code">
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}