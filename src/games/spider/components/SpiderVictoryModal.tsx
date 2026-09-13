import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/LanguageContext";

type SpiderVictoryModalProps = {
    onNewGame: () => void
}

function SpiderVictoryModal({
    onNewGame,
}: SpiderVictoryModalProps) {
    const navigate = useNavigate()

    const {t} = useLanguage()

    function handleBackToMenu(){
        navigate("/")
    }
    return (
        <div className="spider__victory-backdrop">
            <div className="spider__victory-modal">
                <h2>{t.utils.victory}</h2>
                <div className="spider__victory-actions">
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

export default SpiderVictoryModal