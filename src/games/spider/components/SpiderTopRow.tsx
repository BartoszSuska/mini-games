import React from 'react'
import type { Card as CardType } from "@/games/common/typesUtils"
import Card from "@/games/common/components/Card"

type SpiderTopRowProps = {
    stock: CardType[];
    completedSequences: CardType[][];
    topRowRef: React.RefObject<HTMLDivElement | null>;
    onStockClick: () => void;
}

function SpiderTopRow({
    stock,
    completedSequences,
    topRowRef,
    onStockClick,
}: SpiderTopRowProps) {
    const topCard = stock.at(-1)

    return (
        <div
            ref={topRowRef}
            className='spider__top-row'
        >
            <div className='spider__top-left'>
                <div className='spider__pile'>
                    <div
                        className='spider__stock'
                        onClick={onStockClick}
                    >
                        {topCard ? (
                            <Card
                                card={topCard}
                                draggable={false}
                            />
                        ): (
                            <div className='spider__card-placeholder' />
                        )}
                    </div>
                </div>
            </div>

            <div className='spider__completed'>
                {Array.from({length: 8}).map((_, index) => {
                    const sequence = completedSequences[index]
                    const topCard = sequence?.[0]

                    return (
                        <div
                            key={index}
                            className='spider__completed-slot'
                        >
                            {topCard ? (
                                <img
                                    className="spider__completed-card"
                                    src={topCard.image}
                                    alt={`Completed sequence ${index+1}`}
                                    draggable={false}
                                />
                            ): (
                                <div className='spider__completed-placeholder' />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SpiderTopRow