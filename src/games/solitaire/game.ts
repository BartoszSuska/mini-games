import type { Card, GameState, CardSource } from "./types"
import { getCardColor } from "./card"

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

export function getFoundationIndex(
    card: Card,
    foundations: Card[][]
): number {
    return foundations.findIndex((foundation) => {
        if(foundation.length === 0){
            return card.rank === 1;
        }

        const topCard = foundation[foundation.length - 1]

        return (
            topCard.suit === card.suit &&
            card.rank === topCard.rank + 1
        )
    })
}

export function moveCardToFoundation(
    gameState: GameState,
    card: Card,
    source: CardSource,
    foundationIndex: number
): GameState {
    const foundation = gameState.foundations[foundationIndex];

    if (!foundation) {
        return gameState;
    }

    if (foundation.length === 0) {
        if (card.rank !== 1) {
            return gameState;
        }
        } else {
            const topCard = foundation.at(-1);

            if (
                !topCard ||
                topCard.suit !== card.suit ||
                card.rank !== topCard.rank + 1
            ) {
                return gameState;
            }
    }

    if(!card.faceUp){
        return gameState
    }

    const foundations = gameState.foundations.map(
        (foundation, index) =>
            index === foundationIndex
                ? [...foundation, card]
                : foundation
    )

    let waste = gameState.waste
    let tableau = gameState.tableau

    if(source.type === "waste") {
        waste = gameState.waste.slice(0, -1)
    }

    if (source.type === "tableau") {
        tableau = gameState.tableau.map(
            (column, index) => {
                if (index !== source.columnIndex) {
                    return column;
                }

                const newColumn = column.slice(0, -1);

                const lastCard = newColumn.at(-1);

                if (lastCard && !lastCard.faceUp) {
                    newColumn[newColumn.length - 1] = {
                        ...lastCard,
                        faceUp: true,
                    };
                }

                return newColumn;
            }
        );
    }

    return {
        ...gameState,
        waste,
        tableau,
        foundations
    }
}

export function moveCardToFoundationWithoutGameRules(
  gameState: GameState,
  card: Card,
  source: CardSource,
  foundationIndex: number
): GameState {
    if (!card.faceUp) {
        return gameState;
    }

    const foundations = gameState.foundations.map(
        (foundation, index) =>
        index === foundationIndex
            ? [...foundation, card]
            : foundation
    );

    let waste = gameState.waste;
    let tableau = gameState.tableau;

    if(source.type === "waste") {
        waste = gameState.waste.slice(0, -1)
    }

    if (source.type === "tableau") {
        tableau = gameState.tableau.map(
            (column, index) => {
                if (index !== source.columnIndex) {
                    return column;
                }

                const newColumn = column.slice(0, -1);

                const lastCard = newColumn.at(-1);

                if (lastCard && !lastCard.faceUp) {
                    newColumn[newColumn.length - 1] = {
                        ...lastCard,
                        faceUp: true,
                    };
                }

                return newColumn;
            }
        );
    }

    return {
        ...gameState,
        waste,
        tableau,
        foundations
    }
}

function canPlaceOnTableau(
    card: Card,
    targetColumn: Card[]
): boolean {
    const topCard = targetColumn.at(-1)

    if(!topCard){
        return card.rank === 13
    }

    if(card.rank !== topCard.rank -1){
        return false
    }

    if(getCardColor(card.suit) === getCardColor(topCard.suit)){
        return false
    }

    return true
}

export function moveCardToTableau(
    gameState: GameState,
    card: Card,
    source: CardSource,
    targetColumnIndex: number
): GameState {
    if(!card.faceUp){
        return gameState
    }

    if(targetColumnIndex < 0 || targetColumnIndex >= gameState.tableau.length) {
        return gameState
    }

    const targetColumn = gameState.tableau[targetColumnIndex]

    if(!canPlaceOnTableau(card, targetColumn)){
        return gameState
    }

    let cardsToMove: Card[] = []

    if(source.type === "tableau") {
        if(source.columnIndex === targetColumnIndex){
            return gameState
        }

        const sourceColumn = gameState.tableau[source.columnIndex]
        
        const cardIndex = sourceColumn.findIndex(
            (sourceCard) => sourceCard.id === card.id
        )

        if(cardIndex === -1){
            return gameState
        }

        cardsToMove = sourceColumn.slice(cardIndex)
    } else{
        cardsToMove = [card]
    }

    let tableau = gameState.tableau.map( 
        (column, index) => { 
            if ( source.type === "tableau" && index === source.columnIndex ) 
            { 
                const cardIndex = column.findIndex( 
                    (sourceCard) => sourceCard.id === card.id ); 
                    
                    if (cardIndex === -1) 
                    { 
                        return column; 
                    } 
                    const newColumn = column.slice(0, cardIndex); 
                    const lastCard = newColumn.at(-1); 
                    
                    if (lastCard && !lastCard.faceUp) 
                    { 
                        newColumn[newColumn.length - 1] = { ...lastCard, faceUp: true, }; 
                    } 
                    return newColumn; 
                } 
                return column; 
            } 
        );    

    tableau = tableau.map(
        (column, index) => {
            if(index === targetColumnIndex){
                return [...column, ...cardsToMove]
            }

            return column
        }
    )

    let waste = gameState.waste

    if(source.type === "waste"){
        waste = gameState.waste.slice(0, -1)
    }

    return {
        ...gameState,
        waste,
        tableau,
    }
}
