import React from 'react'
import { LanguageProvider, useLanguage } from '@/LanguageContext'
import { useNavigate } from "react-router-dom";

function Spider() {
    const navigate = useNavigate();
    const {t} = useLanguage()

    return (
        <main className="solitaire">
            <header className="solitaire__header">
                <button className="solitaire__back-button" onClick={() => navigate("/")}>
                    {t.utils.backToMenu}
                </button>

                <h2>{t.games.solitaire}</h2>

                <button className="solitaire__new-game-button">
                    {t.utils.newGame}
                </button>
            </header>
        </main>
    )
}

export default Spider