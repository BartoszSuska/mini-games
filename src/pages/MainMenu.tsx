import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

function MainMenu() {
  const navigate = useNavigate();
  const {t} = useLanguage()

  return (
    <div>
      {/* <h1>Game Center</h1> */}
      <h1>{t.mainMenu.title}</h1>
      <button onClick={() => navigate("/solitaire")}>
        {t.games.solitaire}
      </button>
      <button onClick={() => navigate("/spider")}>
        {t.games.spider}
      </button>
    </div>
  );
}

export default MainMenu;