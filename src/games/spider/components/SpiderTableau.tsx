import type { Card as CardType } from "@/games/common/typesUtils"
import Card from "@/games/common/components/Card"
import { calculateCardSpacing } from "@/games/common/layoutUtils"
import { canMoveFromTableau } from "../game"
import { useDroppable } from "@dnd-kit/react"

type SpiderTableauProps = {
    tableau: CardType[][];
    cardWidth: number;
    cardHeight: number;
    tableauHeight: number;
    tableauGap: number;
    activeDragId: string | null;
}

type SpiderTableauColumnProps = {
    tableau: CardType[][];
    column: CardType[];
    columnIndex: number;
    cardHeight: number;
    tableauHeight: number;
    activeDragId: string | null;
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
                        style={
                            {
                                "--card-top": `${cardIndex * spacing}px`,
                                visibility: isBeingDragged
                                    ? "hidden"
                                    : "visible"
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
    activeDragId
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
            {tableau.map((column, columnIndex) => (
                <SpiderTableauColumn
                    key={columnIndex}
                    tableau={tableau}
                    column={column}
                    columnIndex={columnIndex}
                    cardHeight={cardHeight}
                    tableauHeight={tableauHeight}
                    activeDragId={activeDragId}
                />
            ))}
        </div>
    )
}

export default SpiderTableau