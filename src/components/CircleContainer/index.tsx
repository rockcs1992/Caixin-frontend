import { type Component, Show } from 'solid-js';
import styles from "./CircleContainer.module.css";

interface CircleContainerProps {
    size: string;
    text?: string;
    variant?: string;
}

const CircleContainer = (props: CircleContainerProps) => {
    return (
        <div>
            <div style={{ height: `${props.size}vmin`, width: `${props.size}vmin`}} class={styles.circleContainerShadow} />
            <div style={{ height: `${props.size}vmin`, width: `${props.size}vmin`}} class={styles.circleContainer} >
                <span class={styles.circleContainerContent}>{props.text}</span>
            </div>
        </div>
        
        
    )
}

export default CircleContainer;