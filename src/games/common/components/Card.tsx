import type { CSSProperties } from "react";
import type { Card as CardType } from "@/games/common/typesUtils";
import { useDraggable } from "@dnd-kit/react";
import FlippableCard from "./FlippableCard";
import useCardDealAnimation from "../hooks/useCardDealAnimation";

type CardProps = {
    card: CardType;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    draggable?: boolean;
    invalid?: boolean;

    dealAnimation?: {
        enabled: boolean;
        originRef: React.RefObject<HTMLDivElement | null>;
        index: number;
        dealId: number;
    };
};

function Card({
    card,
    className = "",
    style,
    onClick,
    draggable = true,
    invalid = false,
    dealAnimation,
}: CardProps) {
    const { ref, isDragging } = useDraggable({
        id: `card-${card.id}`,
        disabled: !card.faceUp || !draggable,
        data: {
            cardId: card.id,
        },
    });

    const {
        cardRef,
        animationStyle,
    } = useCardDealAnimation({
        enabled: dealAnimation?.enabled ?? false,
        originRef:
          dealAnimation?.originRef ?? { current: null },
        index:
          dealAnimation?.index ?? 0,
        dealId:
          dealAnimation?.dealId ?? 0,
    });

    const isDealing = dealAnimation?.enabled ?? false;
    const revealDelay = isDealing 
      ? 450 + (dealAnimation?.index ?? 0) * 55
      : 0;

    const displayCard = isDealing
    ? {
        ...card,
        faceUp: false,
    }
    : card;

    return (
        <div
            ref={ref}
            className={`solitaire__card ${
                invalid
                    ? "solitaire__card--invalid-move"
                    : ""
            } ${className}`}
            style={style}
            onClick={onClick}
        >
              <div
                  ref={cardRef}
                  style={{
                      width: "100%",
                      height: "100%",
                      opacity: isDragging ? 0 : 1,
                      willChange: isDealing
                          ? "transform"
                          : undefined,
                  }}
              >
                <FlippableCard 
                  card={displayCard} 
                  forceFaceDown={isDealing}
                  revealDelay={revealDelay}
                />
            </div>
        </div>
    );
}

export default Card;