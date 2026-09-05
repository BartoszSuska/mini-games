import type { RefObject } from 'react'
import type { Card as CardType } from '../types'
import Card from './Card'

type TopRowProps = {
    stock: CardType[];
    waste: CardType[];
    foundations: CardType[][];
    topRowRef: RefObject<HTMLDivElement | null>;
    onStockClick: any
};

function TopRow({
    stock,
    waste,
    foundations,
    topRowRef,
    onStockClick
}: TopRowProps) {
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

                {waste.length > 0 ? (
                    <Card
                        card={waste[waste.length - 1]}
                    />
                ) : (
                    <div className="solitaire__card-placeholder" />
                )}
            </div>
        </div>

        {/* Foundations */}
        <div className="solitaire__foundations">
            {foundations.map(
            (_, index) => (
                <div className="solitaire__pile" key={index}>
                    <h3 className="solitaire__pile-title">
                        Foundation
                    </h3>

                    <div className="solitaire__card-placeholder" />
                </div>
            )
            )}
        </div>
    </div>
  )
}

export default TopRow