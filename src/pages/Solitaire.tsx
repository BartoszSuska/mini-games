import { useNavigate } from "react-router-dom";
import { useState } from "react"
import type {GameState, Card as CardType} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"
import { dealGame, drawFromStock, recycleWaste, moveCardToFoundation, getFoundationIndex } from "../games/solitaire/game"
import Tableau from "../games/solitaire/components/Tableau"
import "../games/solitaire/solitaire.css"
import useSolitaireLayout from "../games/solitaire/hooks/useSolitaireLayout"
import TopRow from "../games/solitaire/components/TopRow";
import { DragDropProvider } from "@dnd-kit/react";

function Solitaire() {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null)

  const {
    boardRef,
    topRowRef,
    cardWidth,
    cardHeight,
    tableauGap,
    topRowGap,
    boardGap,
    tableauHeight,
  } = useSolitaireLayout(gameState);

  /* start new game */
  function startNewGame() {
    const newDeck = createDeck();

    const shuffledDeck = shuffleDeck(newDeck)

    const newGame = dealGame(shuffledDeck)

    setGameState(newGame)
  }

  function handleStockClick() {
    if(!gameState){
      return
    }

    if(gameState.stock.length > 0) {
      setGameState(drawFromStock(gameState))
      return
    }

    setGameState(recycleWaste(gameState))
  }

  function handleWasteClick() {
    if(!gameState){
      return
    }

    const card = gameState.waste.at(-1)

    if(!card){
      return
    }

    const foundationIndex = getFoundationIndex(
      card,
      gameState.foundations
    )

    if(foundationIndex === -1) {
      return
    }

    setGameState(
      moveCardToFoundation(
        gameState,
        card,
        {type: "waste"},
        foundationIndex
      )
    )
  }

  function handleTableauCardClick(
    card: CardType,
    columnIndex: number
  ) {
    if (!gameState) {
      return;
    }

    const foundationIndex = getFoundationIndex(
      card,
      gameState.foundations
    )

    if(foundationIndex === -1) {
      return
    }

    setGameState(
      moveCardToFoundation(
        gameState,
        card,
        {
          type: "tableau",
          columnIndex,
        },
        foundationIndex
      )
    );
  }

  return (
    <main className="solitaire">
      <header className="solitaire__header">
        <button className="solitaire__back-button" onClick={() => navigate("/")}>
          Back to Menu
        </button>

        <h1>Pasjans</h1>

        <button className="solitaire__new-game-button" onClick={startNewGame}>
          New Game
        </button>
      </header>

      {gameState && (
        <div 
          className="solitaire__board" 
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
            onDragEnd={(event) => {
              const source = event.operation.source;
              const target = event.operation.target;

              if(!source || !target) {
                return;
              }

              const cardId = String(source.id).replace("card-", "")
              const foundationIndex = Number(
                String(target.id).replace("foundation-", "")
              )

              const card = 
                gameState?.waste.find((card) => card.id === cardId) ??
                gameState?.tableau
                  .flat()
                  .find((card) => card.id === cardId)

              if(!card || !gameState){
                return
              }

              const sourceType =
                gameState.waste.some((card) => card.id === cardId)
                  ? {type: "waste" as const}
                  : (() => {
                    const columnIndex = gameState.tableau.findIndex(
                      (column) =>
                        column.some((card) => card.id === cardId)
                    )

                    return {
                      type: "tableau" as const,
                      columnIndex,
                    }
                  })()

              setGameState(
                moveCardToFoundation(
                  gameState,
                  card,
                  sourceType,
                  foundationIndex
                )
              )     
            }}
          >
            {/* Top row: stock, waste and foundations */}
            <TopRow
              stock={gameState.stock}
              waste={gameState.waste}
              foundations={gameState.foundations}
              topRowRef={topRowRef}
              onStockClick={handleStockClick}
              onWasteClick={handleWasteClick}
            />

            {/* Tableau */}
            <Tableau
              tableau={gameState.tableau}
              cardHeight={cardHeight}
              availableHeight={tableauHeight}
              onCardClick={handleTableauCardClick}
            />
          </DragDropProvider>
        </div>
      )}
    </main>
  );
}

export default Solitaire;