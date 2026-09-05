import type { Card } from "../types";
import { calculatedCardSpacing } from "../layout";

type TableauProps = {
  tableau: Card[][];
  cardHeight: number;
  availableHeight: number;
};

const MIN_CARD_SPACING_RATIO = 0.08;
const MAX_CARD_SPACING_RATIO = 0.25;



function Tableau({
  tableau,
  cardHeight,
  availableHeight,
}: TableauProps) {
  return (
    <div className="solitaire__tableau">
      {tableau.map((column, columnIndex) => {
        const minSpacing =
          cardHeight * MIN_CARD_SPACING_RATIO;

        const maxSpacing =
          cardHeight * MAX_CARD_SPACING_RATIO;        
          
        const spacing = calculatedCardSpacing(
          column.length,
          availableHeight,
          cardHeight,
          minSpacing,
          maxSpacing
        );

        const columnHeight =
          Math.max(0, column.length - 1) * spacing +
          cardHeight;

        return (
          <div
            key={columnIndex}
            className="solitaire__column"
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