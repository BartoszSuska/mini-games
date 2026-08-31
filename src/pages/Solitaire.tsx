import { useNavigate } from "react-router-dom";
import { useState } from "react"
import type {Card} from "../games/solitaire/types"
import { createDeck, shuffleDeck} from "../games/solitaire/deck"

function Solitaire() {
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Card[]>([])

  function startNewGame() {
    const newDeck = createDeck();

    const shuffledDeck = shuffleDeck(newDeck)

    setDeck(shuffledDeck)

    console.log(deck)
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>
        ← Wróć do menu
      </button>

      <h1>Pasjans</h1>

      <button onClick={startNewGame}>
        Nowa Gra
      </button>

      <p>Liczba kart: {deck.length}</p>
      
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {deck.slice(0, 5).map((card) => (
          <img
            key={card.id}
            src={card.image}
            alt={`${card.value} ${card.suit}`}
            style={{
              width: "100px",
            }}
          />
        ))}
      </div>

      <p>Tu będzie plansza gry.</p>
    </div>
  );
}

export default Solitaire;