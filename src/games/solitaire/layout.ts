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

    if(availableHeight <= 0) {
        return maxSpacing
    }

    const gapCount = cardCount -1

    const availableSpaceForGaps = Math.max(0, availableHeight - cardHeight)

    const calculatedSpacing = availableSpaceForGaps / gapCount

    return Math.max(minSpacing, Math.min(maxSpacing, calculatedSpacing))
}