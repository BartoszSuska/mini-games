import type { RefObject } from 'react'
import type { Card as CardType } from '../types'
import Card from './Card'
import Foundation from './Foundation'

type TopRowProps = {
    stock: CardType[];
    waste: CardType[];
    foundations: CardType[][];
    topRowRef: RefObject<HTMLDivElement | null>;
    onStockClick: () => void;
    onWasteClick: () => void;
    activeDragId: string | null;
    invalidCardId: string | null;
};

function TopRow({
    stock,
    waste,
    foundations,
    topRowRef,
    onStockClick,
    onWasteClick,
    activeDragId,
    invalidCardId
}: TopRowProps) {

    const visibleWaste = waste.slice(-3);

  return (
    <div 
        className="solitaire__top-row"
        ref={topRowRef}
    >
        <div className="solitaire__top-left">
            {/* Stock */}
            <div className="solitaire__pile">
                <h3 className="solitaire__pile-title">
                    Stock
                </h3>

                {stock.length > 0 ? (
                    <img
                    className="solitaire__card solitaire__stock-card"
                    src="/cards/card_back.png"
                    alt="Stock"
                    onClick={onStockClick}
                    />
                ) : (
                    <button
                        className="solitaire__card-placeholder"
                        onClick={onStockClick}
                        aria-label="Recycle waste"
                    >↻</button>
                )}
            </div>

            {/* Waste */}
            <div className="solitaire__pile">
                <h3 className="solitaire__pile-title">
                    Waste
                </h3>
                <div className="solitaire__waste">
                {visibleWaste.length === 0 ? (
                    <div className="solitaire__card-placeholder" />
                ) : (
                    visibleWaste.map((card, index) => {
                        const isTopWasteCard = index === visibleWaste.length - 1;

                        const isBeingDragged = activeDragId === `card-${card.id}`

                        return (
                            <Card
                                key={card.id}
                                card={card}
                                className="solitaire__waste-card"
                                draggable={isTopWasteCard}
                                invalid={invalidCardId===card.id}
                                onClick={
                                    isTopWasteCard
                                        ? onWasteClick
                                        : undefined
                                }
                                style={
                                    {
                                        "--waste-index": index,
                                        visibility: isBeingDragged
                                            ? "hidden"
                                            : "visible",
                                    } as React.CSSProperties
                                }
                            />
                        )

                    })
                )}
                </div>
            </div>
        </div>

        {/* Foundations */}
        <div className="solitaire__foundations">
            {foundations.map((foundation, index) => (
                <Foundation
                    key={index}
                    foundation={foundation}
                    index={index}
                />
            ))}
        </div>
    </div>
  )
}

export default TopRow