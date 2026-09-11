import type { Suit } from "./typesUtils";

export type CardColor = "red" | "black";

export function getCardColor(suit: Suit): CardColor {
    if (suit === "hearts" || suit === "diamonds") {
        return "red";
    }

    return "black";
}