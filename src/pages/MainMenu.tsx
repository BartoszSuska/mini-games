import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import { createDeck } from "@/games/solitaire/deck";
import "../MainMenu.css";

function MainMenu() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <main className="main-menu">
            <h1 className="main-menu__title">
                {t.mainMenu.title}
            </h1>

            <div className="main-menu__grid">
                <button
                    className="main-menu__game-card main-menu__game-card--solitaire"
                    onClick={() => navigate("/solitaire")}
                >
                    <div className="main-menu__game-image main-menu__game-image--solitaire">
                      <img
                          className="main-menu__solitaire-card main-menu__solitaire-card--back"
                          src="/mini-games/cards/card_back.png"
                          alt=""
                      />

                      <img
                          className="main-menu__solitaire-card main-menu__solitaire-card--ace"
                          src="/mini-games/cards/card_spades_A.png"
                          alt=""
                      />
                    </div>

                    <span className="main-menu__game-title">
                        {t.games.solitaire}
                    </span>
                </button>

                <button
                    className="main-menu__game-card main-menu__game-card--spider"
                    onClick={() => navigate("/spider")}
                >
                    <div className="main-menu__game-image main-menu__game-image--spider">
                        <img
                            src="/mini-games/other/card_back_spider.png"
                            alt=""
                        />
                    </div>

                    <span className="main-menu__game-title">
                        {t.games.spider}
                    </span>
                </button>
            </div>
        </main>
    );
}

export default MainMenu;