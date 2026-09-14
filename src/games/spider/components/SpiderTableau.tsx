import type { Card as CardType } from "@/games/common/typesUtils"
import Card from "@/games/common/components/Card"
import { calculateCardSpacing } from "@/games/common/layoutUtils"
import { canMoveFromTableau } from "../game"
import { useDroppable } from "@dnd-kit/react"
import type { RefObject } from "react";

type SpiderTableauProps = {
    tableau: CardType[][];
    cardWidth: number;
    cardHeight: number;
    tableauHeight: number;
    tableauGap: number;
    activeDragId: string | null;
    invalidCardIds: string[];
    isDealing: boolean;
    stockRef: RefObject<HTMLDivElement | null>;
    dealId: number;    
}

type SpiderTableauColumnProps = {
    tableau: CardType[][];
    column: CardType[];
    columnIndex: number;
    cardHeight: number;
    tableauHeight: number;
    activeDragId: string | null;
    invalidCardIds: string[];
    isDealing: boolean;
    stockRef: RefObject<HTMLDivElement | null>;
    dealIndexStart: number;
    dealId: number;
}

const MIN_CARD_SPACING_RATIO = 0.08;
const MAX_CARD_SPACING_RATIO = 0.25;

function SpiderTableauColumn({
    tableau,
    column,
    columnIndex,
    cardHeight,
    tableauHeight,
    activeDragId,
    invalidCardIds,
    isDealing,
    stockRef,
    dealIndexStart,
    dealId,
}: SpiderTableauColumnProps) {
    const { ref } = useDroppable({
        id: `tableau-${columnIndex}`
    })
    
    const activeCardId = activeDragId?.replace("card-", "");

    const activeCardIndex = activeCardId
        ? column.findIndex(
            (card) => card.id === activeCardId
        )
        : -1;

    const minSpacing = cardHeight * MIN_CARD_SPACING_RATIO
    const maxSpacing = cardHeight * MAX_CARD_SPACING_RATIO

    const spacing = calculateCardSpacing(
        column.length,
        tableauHeight,
        cardHeight,
        minSpacing,
        maxSpacing,
    )

    const columnHeight = Math.max(0, column.length - 1) * spacing + cardHeight

    return (
        <div
            ref={ref}
            className="spider__tableau-column"
            style={{
                height: `${columnHeight}px`
            }}
        >
            {column.map((card, cardIndex) => {
                const canDrag = canMoveFromTableau(
                    tableau,
                    columnIndex,
                    cardIndex
                )

                const isBeingDragged =
                    activeCardIndex !== -1 &&
                    cardIndex >= activeCardIndex

                return(
                    <Card
                        key={card.id}
                        card={card}
                        className="spider__tableau-card"
                        draggable={canDrag}
                        invalid={invalidCardIds.includes(card.id)}
                        dealAnimation={{
                            enabled: isDealing,
                            originRef: stockRef,
                            index: dealIndexStart + cardIndex,
                            dealId,
                        }}
                        style={
                            {
                                "--card-top": `${cardIndex * spacing}px`,
                                visibility: isBeingDragged
                                    ? "hidden"
                                    : "visible",
                            } as React.CSSProperties
                        }
                    />
                )
            })}
        </div>
    )
}

function SpiderTableau({
    tableau,
    cardWidth,
    cardHeight,
    tableauHeight,
    tableauGap,
    activeDragId,
    invalidCardIds,
    isDealing,
    stockRef,
    dealId,
}: SpiderTableauProps){
    return (
        <div
            className="spider__tableau"
            style={{
                "--tableau-gap": `${tableauGap}px`,
                "--card-width": `${cardWidth}px`,
                "--card-height": `${cardHeight}px`
            } as React.CSSProperties}
        >
            {tableau.map((column, columnIndex) => {
                const dealIndexStart = tableau
                .slice(0, columnIndex)
                .reduce(
                    (total, column) => total + column.length,
                    0
                );

                return(
                    <SpiderTableauColumn
                        key={columnIndex}
                        tableau={tableau}
                        column={column}
                        columnIndex={columnIndex}
                        cardHeight={cardHeight}
                        tableauHeight={tableauHeight}
                        activeDragId={activeDragId}
                        invalidCardIds={invalidCardIds}
                        isDealing={isDealing}
                        stockRef={stockRef}
                        dealId={dealId}
                        dealIndexStart={dealIndexStart}
                    />
                )
            })}
        </div>
    )
}

export default SpiderTableau