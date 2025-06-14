import { Index, Show } from 'solid-js';
import styles from "./FirstPersonView.module.css";
import { useGameContext } from '../../store/GameDataContext';

interface CardContainerProps {
    cards: string[];
    hasSubmittedCards: boolean;
    handleCardsInput: (index: number, event: Event) => void;
    selectedCard: string;
    setSelectedCard: (card: string) => void;
    disabled: boolean;
}

const CardContainer = (props: CardContainerProps) => {
    const {
        currRoundQuestion,
        currentTurn,
        currPlayerGameStatus,
        showPlaceBetView,
        setShowPlaceBetView
    } = useGameContext();

    return (
        <div class={styles.firstPersonCardContainer}>
            <Show when={!!currRoundQuestion() && !currentTurn() && !showPlaceBetView()}>
                <Index each={props.cards}>
                    {(card, index) =>
                        <div contentEditable={!props.hasSubmittedCards}
                            class={styles.firstPersonCard}
                            onInput={(event) => props.handleCardsInput(index, event)}
                        >
                            {card()}
                        </div>
                    }
                </Index>
            </Show>
            <Show when={!!currRoundQuestion() && !!currentTurn() && !showPlaceBetView()}>
                <Index each={currPlayerGameStatus().cards}>
                    {(card) =>
                        <div
                            onClick={(event) => {
                                if (props.disabled) return;
                                const value = (event.target as HTMLElement).textContent!;
                                props.setSelectedCard(value === props.selectedCard ? "" : value);
                            }}
                            classList={{[styles.firstPersonCard]: true, [styles.firstPersonCardDiv]: !props.disabled, [styles.selected]: !props.disabled && props.selectedCard == card()}}
                        >{card()}</div>}
                </Index>
            </Show>
            <Show when={showPlaceBetView()}>
                <select>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
                <button>确定</button>
            </Show>
        </div>
    )
}

export default CardContainer