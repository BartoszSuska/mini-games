import React from 'react'
import type { Card as CardType } from "@/games/common/typesUtils"
import Card from "@/games/common/components/Card"

type SpiderTopRowProps = {
    stock: CardType[];
    topRowRef: React.RefObject<HTMLDivElement | null>;
    onStockClick: () => void;
}

function SpiderTopRow({
    stock,
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
                    <p className='spider__pile-title'>
                        Stock
                    </p>

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
        </div>
    )
}

export default SpiderTopRow