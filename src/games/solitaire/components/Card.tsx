import type { Card as CardType } from '../types'

type CardProps = {
    card: CardType;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

function Card({ card, className = "", style, onClick }: CardProps) {
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
      onClick={onClick}
    />
  );
}

export default Card