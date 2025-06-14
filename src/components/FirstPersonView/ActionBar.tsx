import { Index, Show } from 'solid-js';
import styles from "./FirstPersonView.module.css";
import { useGameContext } from '../../store/GameDataContext';

interface ActionBarProps {
    isSubmitButtonDisabled: boolean;
    selectedCard: string;
    onSubmitCards: () => void;
    disabled: boolean;
}

const ActionBar = (props: ActionBarProps) => {
    const {
        currRoundQuestion,
        currentTurn,
        currPlayerGameStatus,
        submitTurnCompleteAction,
        submitTurnStarterAction,
        currSessionId,
        setShowPlaceBetView,
    } = useGameContext();
    const isCurrUserTurn = () => currentTurn() === currSessionId();

    const onDiscardCard = () => {
        if (isCurrUserTurn()) {
            submitTurnStarterAction({ card: props.selectedCard, action: "discardCard" });
        } else {
            submitTurnCompleteAction({ card: props.selectedCard, action: "reacted",  });
        }
    }

    const onSkipRound = () => {
        submitTurnCompleteAction({ action: "skip" });
    }

    const onPlaceBetClick = () => {
        setShowPlaceBetView(true);
        // submitTurnStarterAction({ matchCountBet: 6, action: "placeBet" });
    }

    return (
        <div class={styles.firstPersonTopRow}>     
            {/** When question has been submitted for this round */}
            <Show when={!!currRoundQuestion() && !currentTurn()}>
                <div>
                    <button disabled={props.isSubmitButtonDisabled} onClick={props.onSubmitCards} class={styles.actionButton}>提交</button>
                </div>
            </Show>
            <Show when={!!currentTurn()}>
                <div>
                    <div class={styles.infoBox}>💰 {currPlayerGameStatus().points}</div>
                    <div class={styles.infoBox}>♟️ 4</div>
                </div>
                <div>
                    <Show when={isCurrUserTurn()}> 
                        <button class={styles.actionButton} onClick={onPlaceBetClick} disabled={props.disabled}>下注</button>
                    </Show>
                    <Show when={!isCurrUserTurn()}> 
                        <button class={styles.actionButton} onClick={onSkipRound} disabled={props.disabled}>跳过回合</button>
                    </Show>
                    <button class={styles.actionButton} disabled={props.disabled || props.selectedCard === ""} onClick={onDiscardCard}>提交</button>
                </div>
            </Show>
        </div>
    )
}

export default ActionBar;