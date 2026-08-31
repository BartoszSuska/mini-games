import { useNavigate } from "react-router-dom";

function Solitaire() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>
        ← Wróć do menu
      </button>

      <h1>Pasjans</h1>

      <p>Tu będzie plansza gry.</p>
    </div>
  );
}

export default Solitaire;