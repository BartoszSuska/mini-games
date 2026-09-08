import React from 'react'
import type { Card as CardType } from '../types'
import { useDroppable } from '@dnd-kit/react';
import Card from './Card'

function Foundation({
    foundation,
    index,
}: {
    foundation: CardType[];
    index: number;
}) {
    const {ref, isDropTarget} = useDroppable({
        id: `foundation-${index}`,
    });

    const topCard = foundation.at(-1);

    return (
        <div className="solitaire__pile">
            <h3 className="solitaire__pile-title">
                Foundation
            </h3>

            <div
                ref={ref}
                className="solitaire__foundation-drop-zone"
                data-foundation-index={index}
            >
                {topCard ? (
                    <img
                        className="solitaire__card"
                        src={topCard.image}
                        alt={`${topCard.value} ${topCard.suit}`}
                    />
                ) : (
                    <div className="solitaire__card-placeholder" />
                )}
            </div>
        </div>
    );
}

export default Foundation