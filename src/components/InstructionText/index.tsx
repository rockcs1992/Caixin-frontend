import { Index, type Component, createSignal, createEffect, Show } from 'solid-js';
import styles from "./InstructionText.module.css";
import { useGameContext } from '../../store/GameDataContext';

const instructionText = () => {
    const {
        questionMaker,
        currSessionId,
        currRoundQuestion,
        currUserHasSubmittedCards,
        currentTurn,
        currentTurnCard,
        showPlaceBetView,
    } = useGameContext();
    const isCurrUserQuestionMaker = () => questionMaker() === currSessionId();
    const isCurrUserTurn = () => currentTurn() === currSessionId();

    return (
        <div class={styles.instructionText}>
            {/** When no question has submitted for this round */}
            <Show when={!currRoundQuestion()}>
                <div>
                    {isCurrUserQuestionMaker() ?
                        <>"你是本轮出题人，请输入题目"</> :
                        <div>等待{questionMaker()}出题中。。。</div>}
                </div>
            </Show>
            {/** When question has been submitted for this round */}
            <Show when={!!currRoundQuestion() && !currentTurn()}>
                <div>本轮题目：{currRoundQuestion()}, 请输入与题目相关的六个词语</div>
                <Show when={currUserHasSubmittedCards()}>
                    <div>等待其他玩家提交词语。。。</div>
                </Show>
            </Show>
            {/** When turn has started */}
            <Show when={!!currentTurn() && !currentTurnCard()}>
                <div>
                    {isCurrUserTurn() ? "轮到你的回合，请选择下注或出牌" : "等待其他玩家回合。。。" }
                </div>
            </Show>
            {/** When a card for this turn has been submitted */}
            <Show when={!!currentTurnCard()}>
                {
                    <div>
                        {isCurrUserTurn() ?
                            "等待其他玩家响应。。。": 
                            `当前打出的牌为: ${currentTurnCard()}, 请打出相同的牌`
                        } 
                    </div>
                }
            </Show>
            <Show when={showPlaceBetView()}>
                <div>选择本轮结束时的标记数字</div>
            </Show>
        </div>
    )
}

export default instructionText;