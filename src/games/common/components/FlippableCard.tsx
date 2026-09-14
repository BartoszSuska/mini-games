import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { Card as CardType } from "@/games/common/typesUtils";

type FlippableCardProps = {
    card: CardType;
    style?: CSSProperties;
    forceFaceDown?: boolean;
    revealDelay?: number;
};

function FlippableCard({
    card,
    style,
    forceFaceDown = false,
    revealDelay = 0,
}: FlippableCardProps) {
    const [revealed, setRevealed] = useState(
        !forceFaceDown && card.faceUp
    );

    useEffect(() => {
        if (forceFaceDown) {
            setRevealed(false);
            return;
        }

        if (!card.faceUp) {
            setRevealed(false);
            return;
        }

        const timeout = setTimeout(() => {
            setRevealed(true);
        }, revealDelay);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        forceFaceDown,
        card.faceUp,
        revealDelay,
    ]);

    return (
        <div
            className="flippable-card"
            style={style}
        >
            <div
                className={`flippable-card__inner ${
                    revealed
                        ? "flippable-card__inner--face-up"
                        : ""
                }`}
            >
                <img
                    className="flippable-card__face flippable-card__face--back"
                    src="/mini-games/cards/card_back.png"
                    alt=""
                    draggable={false}
                />

                <img
                    className="flippable-card__face flippable-card__face--front"
                    src={card.image}
                    alt={`${card.value} ${card.suit}`}
                    draggable={false}
                />
            </div>
        </div>
    );
}

export default FlippableCard;