import type { Difficulty } from "../types";
import { useLanguage } from "@/LanguageContext";

type DifficultyModalProps = {
    onSelect: (difficulty: Difficulty) => void;
};

function DifficultyModal({
    onSelect,
}: DifficultyModalProps) {
    const {t} = useLanguage()

    return (
        <div className="solitaire__victory-backdrop">
            <div className="solitaire__victory-modal solitaire__difficulty-modal">
                <h2>{t.utils.chooseDifficulty}</h2>

                <div className="solitaire__difficulty-options">
                    <button
                        className="solitaire__difficulty-option"
                        onClick={() => onSelect("easy")}
                    >
                        <div className="solitaire__difficulty-cards solitaire__difficulty-cards--easy">
                            <img
                                src="/mini-games/cards/card_back.png"
                                alt=""
                            />
                        </div>

                        <span>{t.utils.easy}</span>
                        <small>{t.utils.drawOne}</small>
                    </button>

                    <button
                        className="solitaire__difficulty-option"
                        onClick={() => onSelect("hard")}
                    >
                        <div className="solitaire__difficulty-cards solitaire__difficulty-cards--hard">
                            <img
                                src="/mini-games/cards/card_back.png"
                                alt=""
                            />
                            <img
                                src="/mini-games/cards/card_back.png"
                                alt=""
                            />
                            <img
                                src="/mini-games/cards/card_back.png"
                                alt=""
                            />
                        </div>

                        <span>{t.utils.hard}</span>
                        <small>{t.utils.drawThree}</small>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DifficultyModal;