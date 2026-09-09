import MainMenu from "./pages/MainMenu";

export const translations = {
    pl: {
        mainMenu: {
            title: "Centrum Gier",
        },
        utils: {
            newGame: "Nowa Gra",
            backToMenu: "Powrót do Menu",
            chooseDifficulty: "Wybierz poziom trudności",
            easy: "Łatwy",
            hard: "Trudny",
            drawOne: "Dobieraj 1 kartę",
            drawThree: "Dobieraj 3 karty",
        },
        games: {
            solitaire: "Pasjans",
            spider: "Pająk",
        }
    },

    en: {
        mainMenu: {
            title: "Game Center",
        },
        utils: {
            newGame: "New Game",
            backToMenu: "Back to Menu",
            chooseDifficulty: "Choose difficulty",
            easy: "Easy",
            hard: "Hard",
            drawOne: "Draw 1 card",
            drawThree: "Draw 3 cards",
        },
        games: {
            solitaire: "Solitaire",
            spider: "Spider",
        }        
    },
} as const