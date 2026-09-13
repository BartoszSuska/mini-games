import { useState, useEffect} from 'react'
import { LanguageProvider, useLanguage } from '@/LanguageContext'
import { useNavigate } from "react-router-dom";
import { createSpiderDeck } from '@/games/spider/deck';
import { dealFromStock, dealSpiderGame, moveSequenceToTableau } from '@/games/spider/game';
import SpiderTableau from '@/games/spider/components/SpiderTableau';
import useSpiderLayout from '@/games/spider/hooks/useSpiderLayout';
import type { SpiderDifficulty, SpiderGameState } from '@/games/spider/types';
import { shuffleDeck } from '@/games/common/deckUtils';
import SpiderTopRow from '@/games/spider/components/SpiderTopRow';
import "@/games/spider/spider.css"
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';

function Spider() {
    const navigate = useNavigate();
    const {t} = useLanguage()

    const [gameState, setGameState] = useState<SpiderGameState | null>(null)
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const DROP_ANIMATION_DURATION = 250;

    const difficulty: SpiderDifficulty = "one-suit"

    useEffect(() => {
        startNewGame(difficulty)
    }, [])

    const {
        boardRef,
        topRowRef,
        cardWidth,
        cardHeight,
        tableauGap,
        topRowGap,
        boardGap,
        tableauHeight
    } = useSpiderLayout(gameState)

    function startNewGame(
        difficulty: SpiderDifficulty
    ) {
        const newDeck = createSpiderDeck(difficulty)

        const shuffledDeck = shuffleDeck(newDeck)

        const newGame = dealSpiderGame(
            shuffledDeck,
            difficulty,
        )

        setGameState(newGame)
    }

    function handleStockClick() {
        if(!gameState){
            return
        }

        setGameState(
            dealFromStock(gameState)
        )
    }

    function handleDragEnd(event: any){
        if(!gameState){
            return
        }

        const {active, over} = event

        if(!over){
            return
        }

        const activeId = String(active.id)
        const overId = String(over.id)

        if(!activeId.startsWith("card-")){
            return
        }

        if(!overId.startsWith("tableau-")){
            return
        }

        const cardId = activeId.replace("card-", "")

        const targetColumnIndex = Number(
            overId.replace("tableau-", "")
        )

        if(
            !Number.isInteger(targetColumnIndex) ||
            targetColumnIndex < 0 ||
            targetColumnIndex >= gameState.tableau.length
        ) {
            return
        }

        let sourceColumnIndex = -1
        let cardIndex = -1

        for(
            let columnIndex = 0;
            columnIndex < gameState.tableau.length;
            columnIndex++
        ) {
            const index = gameState.tableau[columnIndex].findIndex(
                (card) => card.id === cardId
            )

            if(index !== -1){
                sourceColumnIndex = columnIndex
                cardIndex = index
                break
            }
        }

        if(
            sourceColumnIndex === -1 ||
            cardIndex === -1
        ) {
            return
        }

        const result = moveSequenceToTableau(
            gameState.tableau,
            gameState.completedSequences,
            sourceColumnIndex,
            cardIndex,
            targetColumnIndex
        )

        setGameState({
            ...gameState,
            tableau: result.tableau,
            completedSequences: result.completedSequences,
        })
    }

    function SpiderDragOverlay({
        gameState,
        cardWidth,
        cardHeight,
        sourceId,
    }: {
        gameState: SpiderGameState;
        cardWidth: number;
        cardHeight: number;
        sourceId: string;
    }) {
        const cardId = sourceId.replace("card-", "")

        const columnIndex = gameState.tableau.findIndex(
            (column) => column.some((card) => card.id === cardId)
        )

        if(columnIndex === -1){
            return null
        }

        const column = gameState.tableau[columnIndex]

        const cardIndex = column.findIndex(
            (card) => card.id === cardId
        )

        if(cardIndex === -1){
            return null
        }

        const cardsToMove = column.slice(cardIndex)

        const spacing = Math.min(
            cardHeight * 0.25,
            Math.max(
                cardHeight * 0.08,
                (window.innerHeight - cardHeight) /
                    Math.max(1, cardsToMove.length - 1)
            )
        )

        return (
            <div
                className='spider__drag-overlay-stack'
                style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight
                        + Math.max(0, cardsToMove.length -1) * spacing
                    }px`
                }}
            >
                {cardsToMove.map((card, index) => (
                    <img
                        key={card.id}
                        className='spider__drag-overlay-card'
                        src={card.image}
                        alt={`${card.value} ${card.suit}`}
                        draggable={false}
                        style={{
                            top: `${index * spacing}px`,
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <main className="spider">
            <header className="spider__header">
                <button
                    className="spider__back-button"
                    onClick={() => navigate("/")}
                >
                    {t.utils.backToMenu}
                </button>

                <h2>{t.games.spider}</h2>

                <button
                    className="spider__new-game-button"
                    onClick={() => startNewGame(difficulty)}
                >
                    {t.utils.newGame}
                </button>
            </header>

            {gameState && (
                <div
                    className="spider__board"
                    ref={boardRef}
                    style={
                        {
                            "--card-width": `${cardWidth}px`,
                            "--card-height": `${cardHeight}px`,
                            "--tableau-gap": `${tableauGap}px`,
                            "--top-row-gap": `${topRowGap}px`,
                            "--board-gap": `${boardGap}px`,
                        } as React.CSSProperties
                    }
                >
                    <DragDropProvider
                        onDragStart={(event) => {
                            const source = event.operation.source;

                            if (!source) {
                                return;
                            }

                            setActiveDragId(String(source.id));
                        }}

                        onDragEnd={(event) => {
                            setTimeout(() => {
                                setActiveDragId(null);
                            }, DROP_ANIMATION_DURATION);

                            const source = event.operation.source;
                            const target = event.operation.target;

                            if (!source || !target || !gameState) {
                                return;
                            }

                            const sourceId = String(source.id);
                            const targetId = String(target.id);

                            const cardId = sourceId.replace("card-", "");

                            if (!targetId.startsWith("tableau-")) {
                                return;
                            }

                            const targetColumnIndex = Number(
                                targetId.replace("tableau-", "")
                            );

                            if (
                                !Number.isInteger(targetColumnIndex)
                            ) {
                                return;
                            }

                            const sourceColumnIndex =
                                gameState.tableau.findIndex(
                                    (column) =>
                                        column.some(
                                            (card) => card.id === cardId
                                        )
                                );

                            if (sourceColumnIndex === -1) {
                                return;
                            }

                            const cardIndex =
                                gameState.tableau[sourceColumnIndex].findIndex(
                                    (card) => card.id === cardId
                                );

                            if (cardIndex === -1) {
                                return;
                            }

                            const result = moveSequenceToTableau(
                                gameState.tableau,
                                gameState.completedSequences,
                                sourceColumnIndex,
                                cardIndex,
                                targetColumnIndex
                            );

                            setGameState({
                                ...gameState,
                                tableau: result.tableau,
                                completedSequences:
                                    result.completedSequences,
                            });
                        }}
                    >
                        <SpiderTopRow
                            stock={gameState.stock}
                            topRowRef={topRowRef}
                            onStockClick={handleStockClick}
                        />

                        <SpiderTableau
                            tableau={gameState.tableau}
                            cardWidth={cardWidth}
                            cardHeight={cardHeight}
                            tableauHeight={tableauHeight}
                            tableauGap={tableauGap}
                            activeDragId={activeDragId}
                        />

                        <DragOverlay>
                            {(source) => {
                                if(!gameState){
                                    return null
                                }

                                return (
                                    <SpiderDragOverlay
                                        gameState={gameState}
                                        cardWidth={cardWidth}
                                        cardHeight={cardHeight}
                                        sourceId={String(source.id)}
                                    />
                                )
                            }}
                        </DragOverlay>
                    </DragDropProvider>
                </div>
            )}
        </main>
    )
}

export default Spider