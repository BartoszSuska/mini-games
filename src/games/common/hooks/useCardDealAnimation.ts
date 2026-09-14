import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from "react";

type UseCardDealAnimationProps = {
    enabled: boolean;
    originRef: RefObject<HTMLDivElement | null>;
    index: number;
    dealId: number;
};

function useCardDealAnimation({
    enabled,
    originRef,
    index,
    dealId,
}: UseCardDealAnimationProps) {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const [animationStyle, setAnimationStyle] =
        useState<CSSProperties>();

    useEffect(() => {
        const card = cardRef.current;

        if (!card) {
            return;
        }

        if (!enabled) {
            card.style.transform = "";
            card.style.transition = "";
            return;
        }

        const frame1 = requestAnimationFrame(() => {
            const frame2 = requestAnimationFrame(() => {
                const origin = originRef.current;

                if (!origin) {
                    return;
                }

                const originRect =
                    origin.getBoundingClientRect();

                const cardRect =
                    card.getBoundingClientRect();

                const originX =
                    originRect.left +
                    originRect.width / 2;

                const originY =
                    originRect.top +
                    originRect.height / 2;

                const cardX =
                    cardRect.left +
                    cardRect.width / 2;

                const cardY =
                    cardRect.top +
                    cardRect.height / 2;

                const translateX = originX - cardX;
                const translateY = originY - cardY;

                const delay = index * 55;
                const flightDuration = 450;

                card.style.transition = "none";

                card.style.transform =
                    `translate(${translateX}px, ${translateY}px)`;

                card.getBoundingClientRect();

                const timeout = window.setTimeout(() => {
                    card.style.transition =
                        `transform ${flightDuration}ms ease-out ${delay}ms`;

                    card.style.transform =
                        "translate(0, 0)";
                }, 20);

                return timeout;
            });

            return () => {
                cancelAnimationFrame(frame2);
            };
        });

        return () => {
            cancelAnimationFrame(frame1);
        };
    }, [
        enabled,
        originRef,
        index,
        dealId,
    ]);

    return {
        cardRef,
        animationStyle,
    };
}

export default useCardDealAnimation;