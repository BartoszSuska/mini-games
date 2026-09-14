import type { Card as CardType } from "@/games/common/typesUtils";
import { calculateCardSpacing } from "@/games/common/layoutUtils";
import Card from "../../common/components/Card"
import { useDroppable } from "@dnd-kit/react";
import type { RefObject } from "react";

type TableauProps = {
  tableau: CardType[][];
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
  activeDragId: string | null;
  invalidCardId: string | null;
  isDealing: boolean;
  stockRef: RefObject<HTMLDivElement | null>
  dealId: number;
};

type TableauColumnProps = {
  column: CardType[];
  columnIndex: number;
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
  activeDragId: string | null;
  invalidCardId: string | null;
  isDealing: boolean;
  stockRef: RefObject<HTMLDivElement | null>;
  dealIndexStart: number;
  dealId: number;
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
  isDealing,
  stockRef,
  dealIndexStart,
  dealId,
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
              dealAnimation={{
                  enabled: isDealing,
                  originRef: stockRef,
                  index: dealIndexStart + cardIndex,
                  dealId,
              }}              
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
  stockRef,
  isDealing,
  dealId,
}: TableauProps) {


  return (    
    <div className="solitaire__tableau">
      {tableau.map((column, columnIndex) => {
        const dealIndexStart = tableau
          .slice(0, columnIndex)
          .reduce((total, column) => total + column.length, 0)
      
        return (
          <TableauColumn
            key={columnIndex}
            column={column}
            columnIndex={columnIndex}
            cardHeight={cardHeight}
            availableHeight={availableHeight}
            onCardClick={onCardClick}
            activeDragId={activeDragId}
            invalidCardId={invalidCardId}
            isDealing={isDealing}
            stockRef={stockRef}
            dealIndexStart={dealIndexStart}
            dealId={dealId}
          />
        )
      })}
    </div>
  )  
}

export default Tableau;