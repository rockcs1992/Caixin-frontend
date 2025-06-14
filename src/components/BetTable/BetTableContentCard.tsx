import { type Component } from 'solid-js';
import styles from "./BetTable.module.css";

interface BetTableContentCardProps {
    text: string | Element;
    widthRatio: string;
}

const BetTableContentCard = (props: BetTableContentCardProps) => {
    return (
        <span classList={{ [styles.betTableContentCard]: true }} style={{ width: `${props.widthRatio}%`}}>
            <div class={styles.betTableContent}>
                <div style={{ "font-size": "2.5vmin"}}>{props.text}</div>
            </div>
            
        </span>
    )
}

export default BetTableContentCard;
