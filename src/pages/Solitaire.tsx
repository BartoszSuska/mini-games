import { useNavigate } from "react-router-dom";
import { useState } from "react"
import type {GameState, Card as CardType} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"
import { dealGame, drawFromStock, recycleWaste, moveCardToFoundation } from "../games/solitaire/game"
import Tableau from "../games/solitaire/components/Tableau"
import "../games/solitaire/solitaire.css"
import useSolitaireLayout from "../games/solitaire/hooks/useSolitaireLayout"
import TopRow from "../games/solitaire/components/TopRow";

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
    console.log("TEST")

    if(!gameState){
      return
    }

    const card = gameState.waste.at(-1)

    if(!card){
      return
    }

    setGameState(
      moveCardToFoundation(
        gameState,
        card,
        {type: "waste"}
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

    setGameState(
      moveCardToFoundation(
        gameState,
        card,
        {
          type: "tableau",
          columnIndex,
        }
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
        </div>
      )}
    </main>
  );
}

export default Solitaire;