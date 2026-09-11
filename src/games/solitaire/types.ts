import type { Card } from "../common/typesUtils"

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

