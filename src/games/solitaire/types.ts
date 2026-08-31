export type Suit = "hearts" | "diamonds" | "spades" | "clubs"

export type CardValue = "A" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "J" | "Q" | "K"

export type Card ={
    id: string
    suit: Suit
    value: CardValue
    image: string
    faceUp: boolean
}