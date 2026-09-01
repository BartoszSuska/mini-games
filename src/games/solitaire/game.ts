import type { Card, GameState } from "./types"

export function dealGame(deck: Card[]): GameState {
    const tableau: Card[][] = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]

    let currentCardIndex = 0

    //deal cards to columns on tableau
    for (let column = 0; column < tableau.length; column++) {
        for (let row = 0; row <= column; row++){
            const card = {
                ...deck[currentCardIndex],
                faceUp: row === column //only the last card in each column is face up
            }

            tableau[column].push(card)

            currentCardIndex++
        }
    }

    //remaining cards go to stock
    const stock = deck
        .slice(currentCardIndex)
        .map((card) => ({
            ...card,
            faceUp: false
        }))

    return {
        stock,
        waste: [],
        foundations: [[], [], [], []],
        tableau,
    }
}