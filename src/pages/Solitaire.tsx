import { useNavigate } from "react-router-dom";
import { useState } from "react"
import type {GameState} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"
import { dealGame } from "../games/solitaire/game"
import "../games/solitaire/solitaire.css"

function Solitaire() {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null)

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
            {/* Stock */}
            <div className="solitaire__pile">
              <h3 className="solitaire__pile-title">
                Stock
              </h3>

              {gameState.stock.length > 0 && (
                <img
                  className="solitaire__card"
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
          <div className="solitaire__tableau">
            {gameState.tableau.map(
              (column, columnIndex) => (
                <div 
                  className="solitaire__column" 
                  key={columnIndex}
                >
                  {column.map(
                    (card, cardIndex) => (
                      <img 
                        key={card.id} 
                        className={`solitaire__card ${
                          cardIndex > 0 
                            ? "solitaire__card--stacked" 
                            : ""
                        }`} 
                        src={ 
                          card.faceUp 
                            ? card.image 
                            : "/cards/card_back.png"
                        } 
                        alt={`${card.value} ${card.suit}`} 
                      />
                    )
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Solitaire;