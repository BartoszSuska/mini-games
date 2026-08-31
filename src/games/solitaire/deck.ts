import type {Card, CardValue, Suit} from "./types"

const suits: Suit[] = [
    "hearts",
    "diamonds",
    "clubs",
    "spades"
]

const values: CardValue[] = [
    "A", "02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K"
]

export function createDeck(): Card[] {
    const deck: Card[] = []

    for (const suit of suits){
        for (const value of values){
            deck.push({
                id: `${suit}-${value}`,
                suit,
                value,
                image: `/cards/card_${suit}_${value}.png`,
                faceUp: false
            })
        }
    }

    return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
    const shuffledDeck = [...deck]

    for (let i = shuffledDeck.length - 1; i > 0; i--){
        const randomIndex: number = Math.floor(Math.random() * (i + 1));

        [
            shuffledDeck[i],
            shuffledDeck[randomIndex]
        ] = [
            shuffledDeck[randomIndex],
            shuffledDeck[i]
        ]
    }

    return shuffledDeck
}