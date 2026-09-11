import type {Card, CardRank, CardValue, Suit} from "../common/typesUtils"
import { shuffleDeck } from "../common/deckUtils";

const suits: Suit[] = [
    "hearts",
    "diamonds",
    "clubs",
    "spades"
]

const values: CardValue[] = [
    "A", "02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K"
]

const cards: { value: CardValue; rank: CardRank }[] = [
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