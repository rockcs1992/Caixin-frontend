import { createSignal, createContext, useContext, onMount, Component, JSXElement } from "solid-js";
import type { Accessor} from "solid-js";
import * as Colyseus from "colyseus.js";
import { getStateCallbacks } from "colyseus.js";
import { Schema } from "@colyseus/schema";

interface GameDataProviderProps {
    children: JSXElement
}

interface PlayerInfo {
    cards: string[];
    points: number;
}

type Players = Map<string, PlayerInfo>

interface GameRoomState extends Schema {
    bankPoints: number;
    players: any;
    currentRoundQuestion: string;
    currentRoundBets: any;
    currentTurnCard: string;
    currentTurn: string;
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
        room = await client.joinOrCreate<GameRoomState>("caixin_room");
        setCurrSessionId(room.sessionId);

        room.onMessage("gameStart", (message) => {
            setQuestionMaker(message.questionMaker);
        });

        const $ = getStateCallbacks(room);

        $(room.state).players.onAdd((player: any, sessionId: string) => {
            $(player).onChange(() => {
                if (sessionId === room.sessionId) {
                    setCurrPlayerGameStatus({
                        points: player.points,
                        cards: Array.from(player.cards),
                    });
                }
            });
        });

        $(room.state).currentRoundBets.onAdd((bet: any, key: string) => {
            if (bet.players) {
                $(bet).players.onAdd((value: any) => {
                    setCurrentRoundBets(prev => {
                        const newMap = new Map(prev);
                        if (!prev.has(key)) {
                            newMap.set(key, new Set())
                        }
                        newMap.get(key)?.add(value)
                        return newMap;
                    });
                });
            }
        });

        $(room.state).listen("currentRoundQuestion", (currValue: string) => {
            setCurrRoundQuestion(currValue);
        });
        $(room.state).listen("currentTurn", (currValue: string) => {
            setCurrentTurn(currValue);
        });
        $(room.state).listen("bankPoints", (currValue: number) => {
            setBankPoints(currValue);
        });
        $(room.state).listen("currentTurnCard", (currValue: string) => {
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
