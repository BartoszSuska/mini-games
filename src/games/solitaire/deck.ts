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

const cards: { value: CardValue; rank: number }[] = [
    { value: "A", rank: 1 },
    { value: "02", rank: 2 },
    { value: "03", rank: 3 },
    { value: "04", rank: 4 },
    { value: "05", rank: 5 },
    { value: "06", rank: 6 },
    { value: "07", rank: 7 },
    { value: "08", rank: 8 },
    { value: "09", rank: 9 },
    { value: "10", rank: 10 },
    { value: "J", rank: 11 },
    { value: "Q", rank: 12 },
    { value: "K", rank: 13 },
];

export function createDeck(): Card[] {
    const deck: Card[] = []

    for (const suit of suits){
        for (const { value, rank } of cards){
            deck.push({
                id: `${suit}-${value}`,
                suit,
                rank,
                value,
                image: `/mini-games/cards/card_${suit}_${value}.png`,
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