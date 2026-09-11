import type { Card } from "@/games/common/typesUtils"
import type { SpiderDifficulty, SpiderGameState, SpiderCardSource } from "./types"

const TABLEAU_COLUMN_COUNT = 10

export function dealSpiderGame(
    deck: Card[],
    difficulty: SpiderDifficulty
): SpiderGameState {
    const tableau: Card[][] = Array.from(
        {length: TABLEAU_COLUMN_COUNT},
        () => []
    )

    let currenCardIndex = 0

    //first 4 columns = 6 cards / last 6 columns = 5 cards

    for(let column = 0; column < TABLEAU_COLUMN_COUNT; column++){
        const cardsInColumn = column < 4 ? 6 : 5

        for(let row = 0; row < cardsInColumn; row++){
            const card = deck[currenCardIndex]

            if(!card){
                break
            }

            tableau[column].push({
                ...card,
                faceUp: row === cardsInColumn - 1,
            })

            currenCardIndex++;
        }
    }

    const stock = deck
        .slice(currenCardIndex)
        .map((card) => ({
            ...card,
            faceUp: false,
        }))

    return {
        stock,
        tableau,
        completedSequences: [],
        difficulty,
    }
}
    
export function dealFromStock(
    gameState: SpiderGameState
): SpiderGameState {
    if(gameState.stock.length < TABLEAU_COLUMN_COUNT){
        return gameState
    }

    if(gameState.tableau.some((column) => column.length === 0)){
        return gameState
    }

    const stock = [...gameState.stock]
    const tableau = gameState.tableau.map(
        (column) => [...column]
    )

    for(let columnIndex = 0; columnIndex < TABLEAU_COLUMN_COUNT; columnIndex++){
        const card = stock.pop();

        if(!card){
            break
        }

        tableau[columnIndex].push({
            ...card,
            faceUp: true,
        })
    }

    return{
        ...gameState,
        stock,
        tableau,
    }
}

export function revealTopCard(
    column: Card[]
): Card[] {
    if(column.length === 0){
        return column;
    }

    const topCard = column.at(-1)

    if(!topCard || topCard.faceUp) {
        return column
    }

    return [
        ...column.slice(0, -1),
        {
            ...topCard,
            faceUp: true,
        },
    ]
}

export function isValidSpiderSequence(
    cards: Card[]
): boolean {
    if(cards.length === 0){
        return false
    }

    if(cards.some((card) => !card.faceUp)){
        return false
    }

    for(let i = 0; i < cards.length - 1; i++) {
        const current = cards[i]
        const next = cards[i + 1]

        if(current.rank !== next.rank + 1){
            return false
        }

        if(current.suit !== next.suit){
            return false
        }
    }

    return true
}

export function canMoveFromTableau(
    tableau: Card[][],
    columnIndex: number,
    cardIndex: number,
): boolean {
    const column = tableau[columnIndex]

    if(!column){
        return false
    }

    const cardsToMove = column.slice(cardIndex)

    return isValidSpiderSequence(cardsToMove)
}

export function canPlaceSequenceOnTableau(
    tableau: Card[][],
    targetColumnIndex: number,
    cardsToMove: Card[],
): boolean {
    if(cardsToMove.length === 0){
        return false
    }

    const targetColumn = tableau[targetColumnIndex]

    if(!targetColumn){
        return false
    }

    if(targetColumn.length === 0){
        return true
    }

    const targetCard = targetColumn.at(-1)

    if(!targetCard){
        return false
    }

    return cardsToMove[0].rank === targetCard.rank - 1
}

export function moveSequenceToTableau(
    gameState: SpiderGameState,
    sourceColumnIndex: number,
    cardIndex: number,
    targetColumnIndex: number,
): SpiderGameState {
    const sourceColumn = gameState.tableau[sourceColumnIndex]
    const targetColumn = gameState.tableau[targetColumnIndex]

    if(!sourceColumn || !targetColumn){
        return gameState
    }

    if(sourceColumnIndex === targetColumnIndex){
        return gameState
    }

    const cardsToMove = sourceColumn.slice(cardIndex)

    if(!isValidSpiderSequence(cardsToMove)){
        return gameState
    }

    if(!canPlaceSequenceOnTableau(gameState.tableau, targetColumnIndex, cardsToMove)){
        return gameState
    }

    const tableau = gameState.tableau.map(
        (column) => [...column]
    )

    tableau[sourceColumnIndex] = tableau[sourceColumnIndex].slice(0, cardIndex)

    tableau[targetColumnIndex] = [
        ...tableau[targetColumnIndex],
        ...cardsToMove,
    ]

    tableau[sourceColumnIndex] = revealTopCard(tableau[sourceColumnIndex])

    const result = removeCompletedSequences(
        tableau,
        gameState.completedSequences,
    )

    return {
        ...gameState,
        tableau: result.tableau,
        completedSequences: result.completedSequences,
    }
}

function isCompleteSpiderSequence(
    cards: Card[]
): boolean {
    if(cards.length !== 13){
        return false
    }

    if(cards.some((card) => !card.faceUp)){
        return false
    }

    for(let i = 0; i < 13; i++){
        const card = cards[i]

        if(card.rank !== 13 - i){
            return false
        }

        if(i > 0 && card.suit !== cards[0].suit){
            return false
        }
    }

    return true
}

function removeCompletedSequences(
    tableau: Card[][],
    completedSequences: Card[][],
): {
    tableau: Card[][];
    completedSequences: Card[][];
} {
    const newTableau = tableau.map((column) => [...column])
    const newCompletedSequences = [...completedSequences]

    for(let columnIndex = 0; columnIndex < newTableau.length; columnIndex++){
        const column = newTableau[columnIndex]

        if(column.length < 13){
            continue
        }

        const sequence = column.slice(-13)

        if(!isCompleteSpiderSequence(sequence)){
            continue
        }

        newTableau[columnIndex] = column.slice(0, -13)
        newCompletedSequences.push(sequence)

        newTableau[columnIndex] = revealTopCard(newTableau[columnIndex])
    }

    return {
        tableau: newTableau,
        completedSequences: newCompletedSequences,
    }
}