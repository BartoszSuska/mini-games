import type { Card as CardType } from '../types'
import type { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/react';

type CardProps = {
    card: CardType;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    draggable?: boolean;
}

function Card({ card, className = "", style, onClick, draggable=true }: CardProps) {
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
      className={`solitaire__card ${className}`}
      src={
        card.faceUp
          ? card.image
          : "/cards/card_back.png"
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