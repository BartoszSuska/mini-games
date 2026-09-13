import type {Card, Suit, CardValue, CardRank} from "../common/typesUtils"
import type { SpiderDifficulty } from "./types"

const allSuits: Suit[] = [
    "hearts",
    "diamonds",
    "clubs",
    "spades"
]

const values: {value: CardValue; rank: CardRank}[] = [
    {value: "A", rank: 1},
    {value: "02", rank: 2},
    {value: "03", rank: 3},
    {value: "04", rank: 4},
    {value: "05", rank: 5},
    {value: "06", rank: 6},
    {value: "07", rank: 7},
    {value: "08", rank: 8},
    {value: "09", rank: 9},
    {value: "10", rank: 10},
    {value: "J", rank: 11},
    {value: "Q", rank: 12},
    {value: "K", rank: 13},
]

function getSuitsForDifficulty(
    difficulty: SpiderDifficulty
): Suit[] {
    switch (difficulty) {
        case "one-suit":
            return ["spades"]

        case "two-suit":
            return ["spades", "hearts"]

        case "four-suit":
            return allSuits
    }
}

export function createSpiderDeck(
    difficulty: SpiderDifficulty
): Card[] {
    const suits = getSuitsForDifficulty(difficulty)

    const deck: Card[] = []

    const copiesPerSuit = 104 / (suits.length * 13)

    for(let copy = 0; copy <copiesPerSuit; copy++){
        for(const suit of suits){
            for(const {value, rank} of values){
                deck.push({
                    id: `spider-${suit}-${value}-${copy}`,
                    suit,
                    rank,
                    value,
                    image: `/mini-games/cards/card_${suit}_${value}.png`,
                    faceUp: false,
                })
            }
        }
    }

    return deck;
}
