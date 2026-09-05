import { useEffect, useRef, useState } from 'react'
import type { GameState } from '../types'

function useSolitaireLayout(
    gameState: GameState | null
) {
    const boardRef = useRef<HTMLDivElement | null>(null)
    const topRowRef = useRef<HTMLDivElement | null>(null)

    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 })
    const [topRowHeight, setTopRowHeight] = useState(0)

    /* Resize observers for board and top row */
    useEffect(() => {
        const boardElement = boardRef.current;
        const topRowElement = topRowRef.current;

        if (!boardElement || !topRowElement) {
        return;
        }

        const boardResizeObserver = new ResizeObserver(
        ([entry]) => {
            if (!entry) {
            return;
            }

            const { width, height } = entry.contentRect;

            setBoardSize({
            width,
            height,
            });
        }
        );

        const topRowResizeObserver = new ResizeObserver(
        ([entry]) => {
            if (!entry) {
            return;
            }

            setTopRowHeight(entry.contentRect.height);
        }
        );

        boardResizeObserver.observe(boardElement);
        topRowResizeObserver.observe(topRowElement);

        return () => {
        boardResizeObserver.disconnect();
        topRowResizeObserver.disconnect();
        };
    }, [gameState]);

    /* card and board layout scaling */
    const CARD_ASPECT_RATIO = 7 / 10;
    const TABLEAU_COLUMNS = 7;
    const MAX_CARD_WIDTH = 150;
    const MAX_TABLEAU_GAP = 15;

    const tableauGap = Math.min(
    MAX_TABLEAU_GAP,
    boardSize.width * 0.015
    );

    const totalGapWidth =
    tableauGap * (TABLEAU_COLUMNS - 1);

    const availableWidthForCards = Math.max(
    0,
    boardSize.width - totalGapWidth
    );

    const cardWidthFromWidth =
    availableWidthForCards / TABLEAU_COLUMNS;

    /* vertical layout */
    const MAX_BOARD_GAP = 24;

    const boardGap = Math.min(
    MAX_BOARD_GAP,
    boardSize.height * 0.03
    );

    const tableauHeight = Math.max(
    0,
    boardSize.height -
        topRowHeight -
        boardGap
    );

    /* longest tableau column */
    const longestColumnLength = gameState && gameState.tableau.length > 0
    ? Math.max(
        ...gameState.tableau.map(
            (column) => column.length
        )
    )
    : 0;

    /* card size limited by height */
    const MIN_CARD_SPACING_RATIO = 0.08;

    const cardHeightMultiplier = 1 + Math.max(0, longestColumnLength - 1) * MIN_CARD_SPACING_RATIO;

    const cardHeightFromHeight =
        tableauHeight / cardHeightMultiplier;

    const cardWidthFromHeight =
        cardHeightFromHeight * CARD_ASPECT_RATIO;

    /* final card size */
    const cardWidth = Math.min(
        MAX_CARD_WIDTH,
        cardWidthFromWidth,
        cardWidthFromHeight
    );

    const cardHeight =
        cardWidth / CARD_ASPECT_RATIO;

    /* top row spacing */
    const MAX_TOP_ROW_GAP = 20;

    const topRowGap = Math.min(
        MAX_TOP_ROW_GAP,
        boardSize.width * 0.02
    );

    return {
        boardRef,
        topRowRef,

        cardWidth,
        cardHeight,

        tableauGap,
        topRowGap,
        boardGap,

        tableauHeight,
    };
}


export default useSolitaireLayout