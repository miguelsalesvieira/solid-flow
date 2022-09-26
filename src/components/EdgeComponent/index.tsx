import { Component, createEffect, createSignal } from "solid-js";
import styles from "./styles.module.css";

interface Props {
    selected: boolean;
    isNew: boolean;
    position: { x0: number; y0: number; x1: number; y1: number };
    onClickEdge: () => void;
    onClickDelete: () => void;
}

const EdgeComponent: Component<Props> = (props: Props) => {
    const [middlePoint, setMiddlePoint] = createSignal<{ x: number; y: number }>({
        x: props.position.x0 + (props.position.x1 - props.position.x0) / 2,
        y: props.position.y0 + (props.position.y1 - props.position.y0) / 2,
    });

    createEffect(() => {
        const middleX = props.position.x0 + (props.position.x1 - props.position.x0) / 2;
        const middleY = props.position.y0 + (props.position.y1 - props.position.y0) / 2;
        setMiddlePoint({
            x: middleX,
            y: middleY,
        });
    });

    return (
        <>
            <path
                class={props.isNew ? styles.edgeNew : props.selected ? styles.edgeSelected : styles.edge}
                d={`M ${props.position.x0} ${props.position.y0} C ${props.position.x0 + 100} ${props.position.y0}, ${
                    props.position.x1 - 100
                } ${props.position.y1}, ${props.position.x1} ${props.position.y1}`}
                onClick={() => props.onClickEdge()}
            />
            {props.selected && (
                <g
                    class={styles.delete}
                    cursor="pointer"
                    transform={`translate(${middlePoint().x}, ${middlePoint().y})`}
                    onClick={props.onClickDelete}
                >
                    <circle class={styles.circle} />
                    <svg
                        fill="currentColor"
                        stroke-width="0"
                        xmlns="http://www.w3.org/2000/svg"
                        class={styles.icon}
                        width="20"
                        height="20"
                        viewBox="500 500 1000 1000"
                        color="white"
                    >
                        <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path>
                    </svg>
                </g>
            )}
        </>
    );
};

export default EdgeComponent;
