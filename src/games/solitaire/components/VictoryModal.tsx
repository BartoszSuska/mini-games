import { useNavigate } from "react-router-dom"

type VictoryModalProps = {
    onNewGame: () => void
}

function VictoryModal({
    onNewGame,
}: VictoryModalProps) {
    const navigate = useNavigate()

    function handleBackToMenu(){
        navigate("/")
    }
    return (
        <div className="solitaire__victory-backdrop">
            <div className="solitaire__victory-modal">
                <h2>Zwycięstwo!</h2>
                <div className="solitaire__victory-actions">
                    <button onClick={handleBackToMenu}>
                        Powrót do Menu
                    </button>
                    <button onClick={onNewGame}>
                        Nowa Gra
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VictoryModal