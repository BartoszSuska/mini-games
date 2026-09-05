import type { Card as CardType } from '../types'

type CardProps = {
    card: CardType;
    className?: string;
    style?: React.CSSProperties;
}

function Card({ card, className = "", style }: CardProps) {
  return (
    <img
      className={`solitaire__card ${className}`}
      src={
        card.faceUp
          ? card.image
          : "/cards/card_back.png"
      }
      alt={`${card.value} ${card.suit}`}
      style={style}
    />
  );
}

export default Card