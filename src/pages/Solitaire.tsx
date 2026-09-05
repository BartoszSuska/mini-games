import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"
import type {GameState} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"
import { dealGame } from "../games/solitaire/game"
import { calculatedCardSpacing } from "../games/solitaire/layout"
import Tableau from "../games/solitaire/components/Tableau"
import "../games/solitaire/solitaire.css"

function Solitaire() {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<GameState | null>(null)
  const boardRef = useRef<HTMLDivElement | null>(null)
  const topRowRef = useRef<HTMLDivElement | null>(null)

  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 })
  const [topRowHeight, setTopRowHeight] = useState(0)

  /* Resize observers for board and top row */
  useEffect(() => {
    const boardElement = boardRef.current;
    const topRowElement = topRowRef.current;

    if (!boardElement || !topRowElement) {
      return;
    }

    const boardResizeObserver = new ResizeObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        const { width, height } = entry.contentRect;

        setBoardSize({
          width,
          height,
        });
      }
    );

    const topRowResizeObserver = new ResizeObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        setTopRowHeight(entry.contentRect.height);
      }
    );

    boardResizeObserver.observe(boardElement);
    topRowResizeObserver.observe(topRowElement);

    return () => {
      boardResizeObserver.disconnect();
      topRowResizeObserver.disconnect();
    };
  }, [gameState]);

  /* card and board layout scaling */

  const CARD_ASPECT_RATIO = 7 / 10;

  const TABLEAU_COLUMNS = 7;

  const MAX_CARD_WIDTH = 150;

  const MAX_TABLEAU_GAP = 15;

  const tableauGap = Math.min(
    MAX_TABLEAU_GAP,
    boardSize.width * 0.015
  );

  const totalGapWidth =
    tableauGap * (TABLEAU_COLUMNS - 1);

  const availableWidthForCards = Math.max(
    0,
    boardSize.width - totalGapWidth
  );

  const cardWidthFromWidth =
    availableWidthForCards / TABLEAU_COLUMNS;


  /* vertical layout */

  const MAX_BOARD_GAP = 24;

  const boardGap = Math.min(
    MAX_BOARD_GAP,
    boardSize.height * 0.03
  );

  const tableauHeight = Math.max(
    0,
    boardSize.height -
      topRowHeight -
      boardGap
  );


  /* longest tableau column */

  const longestColumnLength = gameState
    ? Math.max(
        ...gameState.tableau.map(
          (column) => column.length
        )
      )
    : 0;


  /* card size limited by height */

  const MIN_CARD_SPACING_RATIO = 0.08;

  const cardHeightMultiplier =
    1 +
    Math.max(0, longestColumnLength - 1) *
      MIN_CARD_SPACING_RATIO;

  const cardHeightFromHeight =
    tableauHeight / cardHeightMultiplier;

  const cardWidthFromHeight =
    cardHeightFromHeight * CARD_ASPECT_RATIO;


  /* final card size */

  const cardWidth = Math.min(
    MAX_CARD_WIDTH,
    cardWidthFromWidth,
    cardWidthFromHeight
  );

  const cardHeight =
    cardWidth / CARD_ASPECT_RATIO;


  /* top row spacing */

  const MAX_TOP_ROW_GAP = 20;

  const topRowGap = Math.min(
    MAX_TOP_ROW_GAP,
    boardSize.width * 0.02
  );

  /* start new game */
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
          <div className="solitaire__tableau-scroll">
            <Tableau
              tableau={gameState.tableau}
              cardHeight={cardHeight}
              availableHeight={tableauHeight}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Solitaire;