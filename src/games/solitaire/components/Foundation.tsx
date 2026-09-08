import React from 'react'
import type { Card as CardType } from '../types'
import { useDroppable } from '@dnd-kit/react';
import Card from './Card'

function Foundation({
    foundation,
    index,
    activeDragId,
}: {
    foundation: CardType[];
    index: number;
    activeDragId: string | null;
}) {
    const {ref, isDropTarget} = useDroppable({
        id: `foundation-${index}`,
    });

    const topCard = foundation.at(-1);

    const isBeingDragged = 
        topCard &&
        activeDragId === `card-${topCard.id}`;

    return (
        <div className="solitaire__pile">


            <div
                ref={ref}
                className="solitaire__foundation-drop-zone"
                data-foundation-index={index}
            >
                {topCard ? (
                    <Card
                        card={topCard}
                        draggable={true}
                        style={{
                            visibility: isBeingDragged
                                ? "hidden"
                                : "visible"
                        }}
                    />
                ) : (
                    <div className="solitaire__card-placeholder" />
                )}
            </div>
        </div>
    );
}

export default Foundation