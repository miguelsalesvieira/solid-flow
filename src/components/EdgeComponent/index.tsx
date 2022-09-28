import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./styles.module.css";

interface Props {
    selected: boolean;
    isNew: boolean;
    position: { x0: number; y0: number; x1: number; y1: number };
    onClickEdge: () => void;
    onClickDelete: () => void;
    onClickOutside: () => void;
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

    function clickOutside(el: any, accessor: any) {
        const onClick = (e: any) => {
            if (!el.contains(e.target)) {
                accessor()?.();
            }
        };
        document.body.addEventListener("click", onClick);
        onCleanup(() => document.body.removeEventListener("click", onClick));
    }

    function calculateOffset(value: number): number {
        return (value * 100) / 200;
    }

    return (
        <>
            <path
                class={props.isNew ? styles.edgeNew : props.selected ? styles.edgeSelected : styles.edge}
                d={`M ${props.position.x0} ${props.position.y0} C ${
                    props.position.x0 + calculateOffset(Math.abs(props.position.x1 - props.position.x0))
                } ${props.position.y0}, ${props.position.x1 - calculateOffset(Math.abs(props.position.x1 - props.position.x0))} ${
                    props.position.y1
                }, ${props.position.x1} ${props.position.y1}`}
                onClick={() => props.onClickEdge()}
                use:clickOutside={() => props.onClickOutside()}
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
                        viewBox="0 0 20 20"
                        color="white"
                        x="-10"
                        y="-10"
                    >
                        <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                    </svg>
                </g>
            )}
        </>
    );
};

export default EdgeComponent;
