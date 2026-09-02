export function calculatedCardSpacing(
    cardCount: number,
    availableHeight: number,
    cardHeight: number,
    minSpacing: number,
    maxSpacing: number
): number {
    if(cardCount <= 1) {
        return maxSpacing
    }

    const gapCount = cardCount -1

    const availableSpaceForGaps = availableHeight - cardHeight

    const calculatedSpacing = availableSpaceForGaps / gapCount

    return Math.max(minSpacing, Math.min(maxSpacing, calculatedSpacing))
}