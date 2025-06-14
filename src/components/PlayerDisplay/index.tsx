import { Index, type Component } from 'solid-js';
import styles from "./PlayerDisplay.module.css";

interface PlayerDisplayProps {
    username: string;
    cards: string[];
    points: number;
}

const PlayerDisplay = (props: PlayerDisplayProps) => {
    return (
        <div class={styles.playerDisplayContainer}>
            <div class={styles.playerDisplayInfo}>
                <span>{props.username} | </span>
                <span>🎴 {props.cards.length} | </span>
                <span>💰 {props.points}</span>
            </div>
            <div class={styles.playerDisplayCards}>
                <Index each={props.cards}>
                    {(card) => <div class={styles.playerDisplayCard}>{card()}</div>}
                </Index>
            </div>
        </div>
    )
}

export default PlayerDisplay;