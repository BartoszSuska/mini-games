import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import type {GameState, Difficulty} from "../games/solitaire/types"
import type {Card as CardType} from "../games/common/typesUtils"
import { createDeck} from "../games/solitaire/deck"
import { shuffleDeck } from "@/games/common/deckUtils";
import { dealGame, drawFromStock, recycleWaste, moveCardToFoundation, getFoundationIndex, moveCardToTableau } from "../games/solitaire/game"
import Tableau from "../games/solitaire/components/Tableau"
import "../games/solitaire/solitaire.css"
import useSolitaireLayout from "../games/solitaire/hooks/useSolitaireLayout"
import TopRow from "../games/solitaire/components/TopRow";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import VictoryModal from "../games/solitaire/components/VictoryModal";
import { LanguageProvider, useLanguage } from "@/LanguageContext";
import DifficultyModal from "@/games/solitaire/components/DifficultyModal";

function Solitaire() {
  const navigate = useNavigate();

  const {t} = useLanguage()

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [invalidCardId, setInvalidCardId] = useState<string | null>(null)
  const DROP_ANIMATION_DURATION = 250

  useEffect(() => {
    setShowDifficultyModal(true)
  }, [])

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
  function showDifficultySetting(){
    setShowDifficultyModal(true)
  }

  function startNewGame(difficulty: Difficulty) {
    const newDeck = createDeck();

    const shuffledDeck = shuffleDeck(newDeck)

    const newGame = dealGame(shuffledDeck, difficulty)

    setGameState(newGame)
    setShowDifficultyModal(false)
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
      setInvalidCardId(card.id)
      setTimeout(() => {
        setInvalidCardId(null)
      }, 350)
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
      setInvalidCardId(card.id)
      setTimeout(() => {
        setInvalidCardId(null)
      }, 350)
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

  function SolitaireDragOverlay({
    gameState,
    cardWidth,
    cardHeight,
    sourceId,
  }: {
    gameState: GameState;
    cardWidth: number;
    cardHeight: number;
    sourceId: string;
  }) {
    const cardId = sourceId.replace("card-", "")

    //waste
    const wasteCard = gameState.waste.find(
      (card) => card.id === cardId
    )

    if(wasteCard){
      return (
        <img
          className="solitaire__drag-overlay-card"
          src={wasteCard.image}
          alt={`${wasteCard.value} ${wasteCard.suit}`}
          draggable={false}
        />
      )
    }

    //foundation
    const foundationIndex = gameState.foundations.findIndex(
      (foundation) =>
        foundation.some((card) => card.id === cardId)
    );

    if (foundationIndex !== -1) {
      const foundationCard =
        gameState.foundations[foundationIndex].at(-1);

      if (!foundationCard || foundationCard.id !== cardId) {
        return null;
      }

      return (
        <img
          className="solitaire__drag-overlay-card"
          src={foundationCard.image}
          alt={`${foundationCard.value} ${foundationCard.suit}`}
          draggable={false}
        />
      );
    }    

    //tableau
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

    //take all cards from dragged card to end of column
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
        className="solitaire__drag-overlay-stack"
        style={{
          width: `${cardWidth}px`,
          height: `${
            cardHeight +
            Math.max(0, cardsToMove.length - 1) * spacing
          }px`,
        }}
      >
        {cardsToMove.map((card, index) => (
          <img
            key={card.id}
            className="solitaire__drag-overlay-card"
            src={card.image}
            alt={`${card.value} ${card.suit}`}
            draggable={false}
            style={{
              top: `${index * spacing}px`
            }}
          />
        ))}
      </div>
    )
  }

  function isGameWon(gameState: GameState): boolean {
    return gameState.foundations.every(
      (foundation) => foundation.length === 13
    )
  }

  return (
    <main className="solitaire">
      <header className="solitaire__header">
        <button className="solitaire__back-button" onClick={() => navigate("/")}>
          {t.utils.backToMenu}
        </button>

        <h2>{t.games.solitaire}</h2>

        <button className="solitaire__new-game-button" onClick={showDifficultySetting}>
          {t.utils.newGame}
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
            onDragStart={(event) => {
              const source = event.operation.source;
              if(!source)
                return

              setActiveDragId(String(source.id))
            }}
            onDragEnd={(event) => {
                setTimeout(() => {
                  setActiveDragId(null);
                }, DROP_ANIMATION_DURATION)
              const source = event.operation.source;
              const target = event.operation.target;

              if(!source || !target || !gameState) {
                return;
              }

              const sourceId = String(source.id)
              const targetId = String(target.id)              

              const cardId = String(source.id).replace("card-", "")


              const card = 
                gameState?.waste.find((card) => card.id === cardId) ??
                gameState?.tableau
                  .flat()
                  .find((card) => card.id === cardId) ??
                gameState.foundations
                  .flat()
                  .find((card) => card.id === cardId)

              if(!card){
                return
              }

              const sourceType =
                gameState.waste.some((card) => card.id === cardId)
                  ? { type: "waste" as const }
                  : (() => {
                      const columnIndex = gameState.tableau.findIndex(
                        (column) =>
                          column.some((card) => card.id === cardId)
                      );

                      if (columnIndex !== -1) {
                        return {
                          type: "tableau" as const,
                          columnIndex,
                        };
                      }

                      const foundationIndex =
                        gameState.foundations.findIndex(
                          (foundation) =>
                            foundation.some((card) => card.id === cardId)
                        );

                      return {
                        type: "foundation" as const,
                        foundationIndex,
                      };
                    })();

              //Drop on foundation
              if (targetId.startsWith("foundation-")) {
                console.log(targetId)
                const foundationIndex = Number(
                  String(target.id).replace("foundation-", "")
                )
              
                setGameState(
                  moveCardToFoundation(
                    gameState,
                    card,
                    sourceType,
                    foundationIndex
                  )
                )
                
                return
              }

              //Drop on tableau
              if(targetId.startsWith("tableau-")) {
                console.log(targetId)

                const targetColumnIndex = Number(
                  targetId.replace("tableau-", "")
                )

                setGameState(
                  moveCardToTableau(
                    gameState,
                    card,
                    sourceType,
                    targetColumnIndex
                  )
                )

                return
              }
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
              activeDragId={activeDragId}
              invalidCardId={invalidCardId}
            />

            {/* Tableau */}
            <Tableau
              tableau={gameState.tableau}
              cardHeight={cardHeight}
              availableHeight={tableauHeight}
              onCardClick={handleTableauCardClick}
              activeDragId={activeDragId}
              invalidCardId={invalidCardId}
            />

            <DragOverlay>
              {(source) => {
                if(!gameState) {
                  return null
                }

                return (
                  <SolitaireDragOverlay
                    gameState={gameState}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    sourceId={String(source.id)}
                  />
                )
              }}
            </DragOverlay>
          </DragDropProvider>

          {isGameWon(gameState) && (
            <VictoryModal
              onNewGame={showDifficultySetting}
            />
          )}
        </div>
      )}

      {showDifficultyModal && (
        <DifficultyModal
          onSelect={startNewGame}
        />
      )}
    </main>
  );
}

export default Solitaire;