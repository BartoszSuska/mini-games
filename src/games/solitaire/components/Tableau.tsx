import type { Card as CardType } from "../types";
import { calculatedCardSpacing } from "../layout";
import Card from "./Card"

type TableauProps = {
  tableau: CardType[][];
  cardHeight: number;
  availableHeight: number;
  onCardClick: (card: CardType, columnIndex: number) => void;
};

const MIN_CARD_SPACING_RATIO = 0.08;
const MAX_CARD_SPACING_RATIO = 0.25;

function Tableau({
  tableau,
  cardHeight,
  availableHeight,
  onCardClick,
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
            {column.length === 0 ? (
              <div className="solitaire__card-placeholder" />
            ) : (
              column.map((card, cardIndex) => {
                const isTopCard = cardIndex === column.length - 1;

                return (
                  <Card
                    key={card.id}
                    card={card}
                    className="solitaire__tableau-card"
                    onClick={
                      isTopCard
                        ? () => onCardClick(card, columnIndex)
                        : undefined
                    }
                    style={
                      {
                        "--card-top": `${cardIndex * spacing}px`,
                      } as React.CSSProperties
                    }
                  />
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Tableau;