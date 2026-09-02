import { useNavigate } from "react-router-dom";
import { useState } from "react"
import type {GameState} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"
import { dealGame } from "../games/solitaire/game"
import { calculatedCardSpacing } from "../games/solitaire/layout"
import Tableau from "../games/solitaire/components/Tableau"
import "../games/solitaire/solitaire.css"

function Solitaire() {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null)

  /* card layout scaling */
  const CARD_WIDTH = 100;
  const CARD_HEIGHT = 140;

  const MIN_CARD_SPACING = 15;
  const MAX_CARD_SPACING = 35;

  const TABLEAU_HEIGHT = 600;

  function startNewGame() {
    const newDeck = createDeck();

    const shuffledDeck = shuffleDeck(newDeck)

    const newGame = dealGame(shuffledDeck)

    setGameState(newGame)
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
        <div className="solitaire__board">
           {/* Top row: stock, waste and foundations */}
          <div className="solitaire__top-row">
            <div className="solitaire__top-left">
              {/* Stock */}
              <div className="solitaire__pile">
                <h3 className="solitaire__pile-title">
                  Stock
                </h3>

                {gameState.stock.length > 0 && (
                  <img
                    className="solitaire__card solitaire__stock-card"
                    src="/cards/card_back.png"
                    alt="Stock"
                  />
                )}
              </div>

              {/* Waste */}
              <div className="solitaire__pile">
                <h3 className="solitaire__pile-title">
                  Waste
                </h3>

                <div className="solitaire__card-placeholder" />
              </div>
            </div>

            {/* Foundations */}
            <div className="solitaire__foundations">
              {gameState.foundations.map(
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

          {/* Tableau */}
          <Tableau tableau={gameState.tableau} />
        </div>
      )}
    </main>
  );
}

export default Solitaire;