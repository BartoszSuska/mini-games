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