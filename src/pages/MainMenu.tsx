import { useNavigate } from "react-router-dom";

function MainMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Game Center</h1>

      <button onClick={() => navigate("/solitaire")}>
        Zagraj w Pasjansa
      </button>
    </div>
  );
}

export default MainMenu;