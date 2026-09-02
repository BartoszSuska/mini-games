import { useEffect, useRef, useState } from "react";

import type { Card } from "../types";
import { calculatedCardSpacing } from "../layout";

type TableauProps = {
  tableau: Card[][];
};

const CARD_ASPECT_RATIO = 5 / 7;

const MIN_CARD_SPACING = 15;
const MAX_CARD_SPACING = 35;

function Tableau({ tableau }: TableauProps) {
  const tableauRef = useRef<HTMLDivElement | null>(null);

  const [tableauHeight, setTableauHeight] = useState(0);
  const [cardWidth, setCardWidth] = useState(100);

  useEffect(() => {
    const element = tableauRef.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;

      setTableauHeight(height);

      /*
       * Tableau ma 7 kolumn.
       * Obliczamy szerokość pojedynczej kolumny.
       */
      const columnWidth = width / 7;

      /*
       * Karta nie powinna być szersza niż kolumna.
       * Możemy zostawić trochę miejsca po bokach.
       */
      const newCardWidth = Math.min(
        100,
        Math.max(55, columnWidth * 0.9)
      );

      setCardWidth(newCardWidth);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const cardHeight =
    cardWidth / CARD_ASPECT_RATIO;

  return (
    <div
      ref={tableauRef}
      className="solitaire__tableau"
    >
      {tableau.map((column, columnIndex) => {
        const spacing = calculatedCardSpacing(
          column.length,
          tableauHeight,
          cardHeight,
          MIN_CARD_SPACING,
          MAX_CARD_SPACING
        );

        const columnHeight =
          (column.length - 1) * spacing +
          cardHeight;

        return (
          <div
            className="solitaire__column"
            key={columnIndex}
            style={{
              height: `${columnHeight}px`,
            }}
          >
            {column.map((card, cardIndex) => (
              <img
                key={card.id}
                className="solitaire__card solitaire__tableau-card"
                src={
                  card.faceUp
                    ? card.image
                    : "/cards/card_back.png"
                }
                alt={`${card.value} ${card.suit}`}
                style={
                  {
                    "--card-width": `${cardWidth}px`,
                    "--card-top": `${cardIndex * spacing}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Tableau;