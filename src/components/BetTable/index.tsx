import { Index, createEffect, type Component } from 'solid-js';
import styles from "./BetTable.module.css";
import CircleContainer from '../CircleContainer';
import TopRowCard from './BetTableContentCard';
import BetTracker from './BetTracker';
import { useGameContext } from '../../store/GameDataContext';

const imgUrl = new URL('../../assets/coin.svg', import.meta.url).href

const BetTable: Component = () => {
    const { currRoundQuestion, bankPoints, currentRoundBets } = useGameContext();
    createEffect(() => {
        console.log("bets?", currentRoundBets())
    })
    return (
        <div class={styles.betTableContainer}>
            <div class={styles.betTableRow} style={{ display: 'flex', "flex-direction": "row", height: "20%" }}>
                <TopRowCard text={currRoundQuestion()} widthRatio='45'/>
                <div class={styles.betBonusContainer}>
                    <div>本轮奖金</div>
                    <img src={imgUrl} />
                    <div>150</div>
                </div>
            </div>
            <div class={styles.betTableRow} style={{ height: "40%"}}>
                <div class={styles.betTrackerGroup} style={{ "padding-right": "1vmin"}}>
                    <Index each={[14,13,12,11,10,9,8]}>
                        {(value) => <BetTracker betValue={value()} />}
                    </Index>
                </div>
            </div>
            <div class={styles.betTableRow} style={{ height: "40%"}}>
                <div class={styles.betTrackerGroup} style={{ "padding-left": "5vmin"}}>
                    <Index each={[1,2,3,4,5,6,7]} >
                        {(value) => <BetTracker betValue={value()} />}
                    </Index>
                </div>
            </div>
            <div style={{ position: "absolute", bottom: "-3vmin", left: "-3vmin" }}><CircleContainer size='13' text={`${bankPoints()}`} /></div>
        </div>
    )
}

export default BetTable;
