import type { Card as CardType } from "@/games/common/typesUtils";
import { calculateCardSpacing } from "@/games/common/layoutUtils";
import Card from "../../common/components/Card"
import { useDroppable } from "@dnd-kit/react";

type TableauProps = {
  tableau: CardType[][];
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
  activeDragId: string | null;
  invalidCardId: string | null;
};

type TableauColumnProps = {
  column: CardType[];
  columnIndex: number;
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
  activeDragId: string | null;
  invalidCardId: string | null;
}

const MIN_CARD_SPACING_RATIO = 0.08;
const MAX_CARD_SPACING_RATIO = 0.25;

function TableauColumn({
  column,
  columnIndex,
  cardHeight,
  availableHeight,
  onCardClick,
  activeDragId,
  invalidCardId,
}: TableauColumnProps) {
  const { ref } = useDroppable({
    id: `tableau-${columnIndex}`
  })

  const minSpacing = cardHeight * MIN_CARD_SPACING_RATIO

  const maxSpacing = cardHeight * MAX_CARD_SPACING_RATIO

  const spacing = calculateCardSpacing(
    column.length,
    availableHeight,
    cardHeight,
    minSpacing,
    maxSpacing
  )

  const columnHeight = Math.max(0, column.length - 1) * spacing + cardHeight

  const activeCardId = activeDragId?.replace("card-", "")

  const activeCardIndex = activeCardId
    ? column.findIndex((card) => card.id === activeCardId)
    : -1


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
          const isBeingDragged =
            activeCardIndex !== -1 &&
            cardIndex >= activeCardIndex
 

          return (
            <Card
              key={card.id}
              card={card}
              className="solitaire__tableau-card"
              invalid={invalidCardId === card.id}
              onClick={
                isTopCard
                  ? () => onCardClick(card, columnIndex)
                  : undefined 
              }
              style={
                {
                  "--card-top": `${cardIndex * spacing}px`,
                  visibility: isBeingDragged ? "hidden" : "visible"
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
  activeDragId,
  invalidCardId,
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
          activeDragId={activeDragId}
          invalidCardId={invalidCardId}
        />
      ))}
    </div>
  )  
}

export default Tableau;