import { type Component, Show } from 'solid-js';
import CircleContainer from '../CircleContainer';
import styles from "./BetTable.module.css";

interface BetTrackerProps {
    betValue: number;
}

const BetTracker = (props: BetTrackerProps) => {
    return (
        <div class={styles.betTrackerContainer}>
            <CircleContainer size="5" text={`${props.betValue}`} />
        </div>
    )
}

export default BetTracker
