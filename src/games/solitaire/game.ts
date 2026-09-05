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

export function drawFromStock(gameState: GameState): GameState {
    if(gameState.stock.length === 0) {
        return gameState
    }

    const stock = [...gameState.stock]
    const waste = [...gameState.waste]

    const card = stock.pop()

    if(!card){
        return gameState
    }

    waste.push({
        ...card,
        faceUp: true,
    })

    return {
        ...gameState,
        stock,
        waste
    }
}

export function recycleWaste(gameState: GameState): GameState {
    if(gameState.stock.length > 0){
        return gameState
    }

    if(gameState.waste.length === 0){
        return gameState
    }

    const stock = [...gameState.waste]
        .reverse()
        .map((card) => ({
            ...card,
            faceUp: false,
        }))
    
    return {
        ...gameState,
        stock,
        waste: []
    }
}