import { Index, createSignal, createEffect, Show } from 'solid-js';
import styles from "./FirstPersonView.module.css";
import { useGameContext } from '../../store/GameDataContext';
import CardContainer from "./CardContainer";
import ActionBar from './ActionBar';

interface FirstPersonViewProps {
    points: number;
    cards: string[];
}

const FirstPersonView = (props: FirstPersonViewProps) => {
    const [cards, setCards] = createSignal(new Array(6).fill(""));
    const [selectedCard, setSelectedCard] = createSignal("");
    const [questionInputValue, setQuestionInputValue] = createSignal("");
    const {
        questionMaker,
        currSessionId,
        submitCards,
        currRoundQuestion,
        submitCurrRoundQuestion,
        currentTurn,
        currentTurnCard,
        currUserHasSubmittedCards,
        setCurrUserhasSubmittedCards,
    } = useGameContext();

    const isCurrUserQuestionMaker = () => questionMaker() === currSessionId();
    const isCurrUserTurn = () => currentTurn() === currSessionId();

    createEffect((prev) => {
        // console.log("currPlayerGameStatus?", currPlayerGameStatus().cards)
    });

    const handleCardsInput = (index: number, event: Event) => {
        const newCards = [...cards()];
        newCards[index] = (event.target as HTMLInputElement).innerText;
        setCards(newCards);
    }

    const onSubmitCards = () => {
        submitCards(cards());
        setCurrUserhasSubmittedCards(true);
    };

    const onSubmitQuestion = () => {
        submitCurrRoundQuestion(questionInputValue());
    };

    const onQuestionInputChange = (e: Event) => {
        setQuestionInputValue((e.currentTarget as HTMLInputElement).value);
    }
    

    const isSubmitButtonDisabled = () => cards().some(card => card.trim() === "");  
    const shouldShowSubmitQuestionView = () => !currRoundQuestion() && isCurrUserQuestionMaker();
    const isInteractionDisabled = () => !!currentTurn() && !currentTurnCard() && !isCurrUserTurn();
    
    return (
        <div class={styles.firstPersonContainer}>
            {shouldShowSubmitQuestionView() ? (
                <>
                    <input placeholder='请输入题目' value={questionInputValue()} onChange={onQuestionInputChange}></input>
                    <button>随机题目</button>
                    <button onClick={onSubmitQuestion}>确定</button>
                </>    
            ) : (
                <>
                    <ActionBar
                        isSubmitButtonDisabled={isSubmitButtonDisabled()}
                        onSubmitCards={onSubmitCards}
                        selectedCard={selectedCard()}
                        disabled={isInteractionDisabled()}
                    />
                    <CardContainer
                        cards={cards()}
                        selectedCard={selectedCard()}
                        setSelectedCard={setSelectedCard}
                        hasSubmittedCards={currUserHasSubmittedCards()}
                        handleCardsInput={handleCardsInput}
                        disabled={isInteractionDisabled()}
                    />
                </>
            )}
        </div>
    )
}

export default FirstPersonView;