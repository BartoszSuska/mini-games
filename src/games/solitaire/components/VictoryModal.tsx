import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/LanguageContext";

type VictoryModalProps = {
    onNewGame: () => void
}

function VictoryModal({
    onNewGame,
}: VictoryModalProps) {
    const navigate = useNavigate()

    const {t} = useLanguage()

    function handleBackToMenu(){
        navigate("/")
    }
    return (
        <div className="solitaire__victory-backdrop">
            <div className="solitaire__victory-modal">
                <h2>Zwycięstwo!</h2>
                <div className="solitaire__victory-actions">
                    <button onClick={handleBackToMenu}>
                        {t.utils.backToMenu}
                    </button>
                    <button onClick={onNewGame}>
                        {t.utils.newGame}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VictoryModal