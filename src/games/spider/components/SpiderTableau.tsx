import type { Card as CardType } from "@/games/common/typesUtils"
import Card from "@/games/common/components/Card"
import { calculateCardSpacing } from "@/games/common/layoutUtils"
import { canMoveFromTableau } from "../game"

type SpiderTableauProps = {
    tableau: CardType[][];
    cardWidth: number;
    cardHeight: number;
    tableauHeight: number;
    tableauGap: number;
}

function SpiderTableau({
    tableau,
    cardWidth,
    cardHeight,
    tableauHeight,
    tableauGap,
}: SpiderTableauProps){
    return (
        <div
            className="spider__tableau"
            style={{
                height: tableauHeight,
                columnGap: tableauGap,
            }}
        >
            {tableau.map((column, columnIndex) => {
                const cardSpacing = calculateCardSpacing(
                    column.length,
                    tableauHeight,
                    cardHeight,
                    16,
                    cardHeight * 0.75
                )

                return (
                    <div
                        key={columnIndex}
                        className="spider__tableau-column"
                    >
                        {column.map((card, cardIndex) => {
                            const canDrag =
                                canMoveFromTableau(
                                    tableau,
                                    columnIndex,
                                    cardIndex
                                )

                            const isLastCard =
                                cardIndex === column.length - 1
                        
                            return (
                                <Card
                                    key={card.id}
                                    card={card}
                                    draggable={canDrag}
                                    style={{
                                        width: cardWidth,
                                        height: cardHeight,
                                        marginBottom: isLastCard
                                            ? 0
                                            : -cardHeight + cardSpacing
                                    }}
                                />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default SpiderTableau