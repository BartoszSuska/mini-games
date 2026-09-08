import type { Card as CardType } from "../types";
import { calculatedCardSpacing } from "../layout";
import Card from "./Card"
import { useDroppable } from "@dnd-kit/react";

type TableauProps = {
  tableau: CardType[][];
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
};

type TableauColumnProps = {
  column: CardType[];
  columnIndex: number;
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
}

const MIN_CARD_SPACING_RATIO = 0.08;
const MAX_CARD_SPACING_RATIO = 0.25;

function TableauColumn({
  column,
  columnIndex,
  cardHeight,
  availableHeight,
  onCardClick,
}: TableauColumnProps) {
  const { ref } = useDroppable({
    id: `tableau-${columnIndex}`
  })

  const minSpacing = cardHeight * MIN_CARD_SPACING_RATIO

  const maxSpacing = cardHeight * MAX_CARD_SPACING_RATIO

  const spacing = calculatedCardSpacing(
    column.length,
    availableHeight,
    cardHeight,
    minSpacing,
    maxSpacing
  )

  const columnHeight = Math.max(0, column.length - 1) * spacing + cardHeight

  return (
    <div
      ref={ref}
      className="solitaire__column"
      style={{
        height: `${columnHeight}px`
      }}
    >
      {column.length === 0 ? (
        <div className="solitaire__card-placeholder" />
      ) : (
        
        column.map((card, cardIndex) => {
          const isTopCard = cardIndex === column.length -1
          if(card.faceUp){
            console.log(
              "COLUMN",
              columnIndex,
              column.map(card => card.id)
            ); 
          }
 
          return (
            <Card
              key={card.id}
              card={card}
              className="solitaire__tableau-card"
              onClick={
                isTopCard
                  ? () => onCardClick(card, columnIndex)
                  : undefined 
              }
              style={
                {
                  "--card-top": `${cardIndex * spacing}px`,
                } as React.CSSProperties
              }
            />
          )
        })
      )}
    </div>
  )
}

function Tableau({
  tableau,
  cardHeight,
  availableHeight,
  onCardClick,
}: TableauProps) {
  return (
    <div className="solitaire__tableau">
      {tableau.map((column, columnIndex) => (
        <TableauColumn
          key={columnIndex}
          column={column}
          columnIndex={columnIndex}
          cardHeight={cardHeight}
          availableHeight={availableHeight}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )  
}

export default Tableau;