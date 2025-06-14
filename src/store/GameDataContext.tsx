import { createSignal, createContext, useContext, onMount, Component, JSXElement } from "solid-js";
import type { Accessor} from "solid-js";
import * as Colyseus from "colyseus.js";

interface GameDataProviderProps {
    children: JSXElement
}

interface PlayerInfo {
    cards: string[];
    points: number;
}

type Players = Map<string, PlayerInfo>

interface GameRoomState {
    bankPoints: number;
    players: PlayerInfo[];
    currentRoundQuestion: string;
    currentRoundBets: number;
    currentTurnCard: string;
    currentRoundMatchCount: number;
    isRoundOver: boolean;
    listen: (eventName: string, callback: (value: any) => void) => void;
}

const useGameDataProviderValue = () => {
    const [questionMaker, setQuestionMaker] = createSignal("");
    const [currSessionId, setCurrSessionId] = createSignal("");
    const [currRoundQuestion, setCurrRoundQuestion] = createSignal("");
    const [currentTurn, setCurrentTurn] = createSignal("");
    const [currentRoundBets, setCurrentRoundBets] = createSignal<Map<string, Set<string>>>(new Map());
    const [bankPoints, setBankPoints] = createSignal(0);
    const [currentTurnCard, setCurrentTurnCard] = createSignal("");
    const [currUserHasSubmittedCards, setCurrUserhasSubmittedCards] = createSignal(false);
    const [currPlayerGameStatus, setCurrPlayerGameStatus] = createSignal<PlayerInfo>({ points: 0, cards: []});
    const [showPlaceBetView, setShowPlaceBetView] = createSignal(false);

    let room: Colyseus.Room<GameRoomState>;
    onMount(async () => {
        var host = window.document.location.host.replace(/:.*/, '');
        var client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + "2567" : ''));
        room = await client.joinOrCreate<GameRoomState>("caixin");
        setCurrSessionId(room.sessionId);

        room.onMessage("gameStart", (message) => {
            setQuestionMaker(message.questionMaker);
        });

        // @ts-ignore 
        room.state.players.onAdd((player: PlayerInfo, sessionId: string) => {
            // @ts-ignore 
            player.listen("cards", (value: string[]) => {
                // The value returned from the server is an [Array schema](https://docs.colyseus.io/state/schema/?h=arrayschema#arrayschema)
                // Need to convert that to an actual array to use
                const playerCards = Array.from(value);
                if (sessionId === room.sessionId) {
                    setCurrPlayerGameStatus(prev => ({
                        points: prev.points,
                        cards: playerCards,
                    }));
                }
            });

            // @ts-ignore 
            player.listen("points", (value: number) => {
                if (sessionId === room.sessionId) {
                    setCurrPlayerGameStatus(prev => ({
                        points: value,
                        cards: prev.cards,
                    }));
                }
            });
        });
        
        // @ts-ignore 
        room.state.currentRoundBets.onAdd((bet: any, key: string) => {
            console.log("bet added", bet, key);

            bet.players.onAdd((value: any) => {
                setCurrentRoundBets(prev => {
                    const newMap = new Map(prev);
                    if (!prev.has(key)) {
                        newMap.set(key, new Set())
                    }
                    newMap.get(key)?.add(value)
                    return newMap;
                });
                console.log("value added to set wth key:", key, value);
            });
        });

        room.state.listen("currentRoundQuestion", (currValue: string) => {
            setCurrRoundQuestion(currValue);
        });
        room.state.listen("currentTurn", (currValue: string) => {
            setCurrentTurn(currValue);
        });
        room.state.listen("bankPoints", (currValue: number) => {
            setBankPoints(currValue);
        });
        room.state.listen("currentTurnCard", (currValue: string) => {
            setCurrentTurnCard(currValue);
        });
    });

    const submitCurrRoundQuestion = (value: string) => {
        room.send("submitQuestion", { value })
    }

    const submitCards = (value: string[]) => {
        room.send("cardsSubmitted", { cards: value })
    };

    const submitTurnStarterAction = (payload: { action: 'discardCard' | 'placeBet'; card?: string; matchCountBet?: number }) => {
        room.send("turnStarterAction", payload)
    };

    const submitTurnCompleteAction = (payload: { action: 'reacted' | 'skip'; card?: string; }) => {
        room.send("turnActionComplete", payload)
    };

    const data = {
        questionMaker,
        currSessionId,
        currRoundQuestion,
        currentTurn,
        currUserHasSubmittedCards,
        currentRoundBets,
        currPlayerGameStatus,
        bankPoints,
        currentTurnCard,
        submitCurrRoundQuestion,
        submitCards,
        submitTurnStarterAction,
        submitTurnCompleteAction,
        setCurrUserhasSubmittedCards,
        showPlaceBetView,
        setShowPlaceBetView
    };

    return data;
}

export type GameDataContextType = ReturnType<typeof useGameDataProviderValue>;

const GameDataContext = createContext<GameDataContextType | undefined>(undefined);

export const GameDataProvider = (props: GameDataProviderProps) => {
    const value = useGameDataProviderValue();

    return (
        <GameDataContext.Provider value={value}>
            {props.children}
        </GameDataContext.Provider>
    )
}

export function useGameContext() {
    const context = useContext(GameDataContext);
    if (context === undefined) {
        throw new Error(`Game context is undefined, something is wrong!`);
      }
    return context;
}
