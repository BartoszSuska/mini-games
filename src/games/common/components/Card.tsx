import type { Card as CardType } from '@/games/common/typesUtils'
import type { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/react';

type CardProps = {
    card: CardType;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    draggable?: boolean;
    invalid?: boolean;
}

function Card({ card, className = "", style, onClick, draggable=true, invalid=false }: CardProps) {
  const {ref, isDragging} = useDraggable({
    id: `card-${card.id}`,
    disabled: !card.faceUp || !draggable,
    data: {
      cardId: card.id,
    }
  })

  return (
    <img
      ref={ref}
      className={`card ${className} ${invalid ? "card--invalid-move":""}`}
      src={
        card.faceUp
          ? card.image
          : "/mini-games/cards/card_back.png"
      }
      alt={`${card.value} ${card.suit}`}
      draggable={false}
      style={{
        ...style,
        opacity: isDragging ? 0 : 1
      }}
      onClick={onClick}
    />
  );
}

export default Card