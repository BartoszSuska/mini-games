import type { SpiderDifficulty } from "../types";
import { useLanguage } from "@/LanguageContext";

const difficultyCards = {
    "one-suit": [
        "/mini-games/cards/card_spades_K.png",
    ],
    "two-suit": [
        "/mini-games/cards/card_spades_K.png",
        "/mini-games/cards/card_hearts_K.png",
    ],
    "four-suit": [
        "/mini-games/cards/card_spades_K.png",
        "/mini-games/cards/card_hearts_K.png",
        "/mini-games/cards/card_diamonds_K.png",
        "/mini-games/cards/card_clubs_K.png",
    ],
};

type DifficultyModalProps = {
    onSelect: (difficulty: SpiderDifficulty) => void;
};

function DifficultyModal({
    onSelect,
}: DifficultyModalProps) {
    const { t } = useLanguage();

    return (
        <div className="spider__victory-backdrop">
            <div className="spider__victory-modal spider__difficulty-modal">
                <h2>{t.utils.chooseDifficulty}</h2>

                <div className="spider__difficulty-options">
                    <button
                        className="spider__difficulty-option"
                        onClick={() => onSelect("one-suit")}
                    >
                        <div className="spider__difficulty-cards spider__difficulty-cards--one">
                            {difficultyCards["one-suit"].map((image) => (
                                <img
                                    key={image}
                                    src={image}
                                    alt=""
                                />
                            ))}
                        </div>

                        <span>1 suit</span>
                        <small>Easy</small>
                    </button>

                    <button
                        className="spider__difficulty-option"
                        onClick={() => onSelect("two-suit")}
                    >
                        <div className="spider__difficulty-cards spider__difficulty-cards--two">
                            {difficultyCards["two-suit"].map((image) => (
                                <img
                                    key={image}
                                    src={image}
                                    alt=""
                                />
                            ))}
                        </div>

                        <span>2 suits</span>
                        <small>Medium</small>
                    </button>

                    <button
                        className="spider__difficulty-option"
                        onClick={() => onSelect("four-suit")}
                    >
                        <div className="spider__difficulty-cards spider__difficulty-cards--four">
                            {difficultyCards["four-suit"].map((image) => (
                                <img
                                    key={image}
                                    src={image}
                                    alt=""
                                />
                            ))}
                        </div>

                        <span>4 suits</span>
                        <small>Hard</small>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DifficultyModal;