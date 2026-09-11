import type {Card} from "../common/typesUtils"

export type SpiderDifficulty =
    | "one-suit"
    | "two-suit"
    | "four-suit"

export type SpiderCardSource = {
    type: "tableau";
    columnIndex: number;
    cardIndex: number;
} | {
    type: "stock";
}

export type SpiderGameState = {
    stock: Card[];
    tableau: Card[][];
    completedSequences: Card[][];
    difficulty: SpiderDifficulty;
}