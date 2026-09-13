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
            medium: "Średni",
            hard: "Trudny",
            drawOne: "Dobieraj 1 kartę",
            drawThree: "Dobieraj 3 karty",
            oneColor: "Jeden Kolor",
            twoColors: "Dwa Kolory",
            fourColors: "Cztery Kolory",
            victory: "Zwycięstwo!"
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
            medium: "Medium",
            hard: "Hard",
            drawOne: "Draw 1 card",
            drawThree: "Draw 3 cards",
            oneColor: "One Suit",
            twoColors: "Two Suits",
            fourColors: "Four Suits",
            victory: "Victory!",
        },
        games: {
            solitaire: "Solitaire",
            spider: "Spider",
        }        
    },
} as const