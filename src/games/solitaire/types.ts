export type Suit = "hearts" | "diamonds" | "spades" | "clubs"

export type CardRank = | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 

export type CardValue = "A" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "J" | "Q" | "K"

export type Card ={
    id: string
    suit: Suit
    rank: number
    value: CardValue
    image: string
    faceUp: boolean
}

export type Difficulty = "easy" | "hard"

export type GameState = {
    stock: Card[]
    waste: Card[]
    foundations: Card[][]
    tableau: Card[][]
    difficulty: Difficulty
}

export type CardSource = 
    | {
        type: "waste"
    }
    | {
        type: "tableau"
        columnIndex: number
    }
    | {
        type: "foundation"
        foundationIndex: number
    }

