import { Accessor, Component, For, onCleanup, onMount } from "solid-js";
import styles from "./styles.module.css";

declare module "solid-js" {
    namespace JSX {
        interface Directives {
            // use:model
            clickOutside: () => void;
        }
    }
}

interface Props {
    ref?: any;
    x: number;
    y: number;
    selected: boolean;
    actions?: { delete?: boolean };
    label?: string;
    content: any;
    inputs: number;
    outputs: number;
    onNodeMount: (inputs: { offset: { x: number; y: number } }[], outputs: { offset: { x: number; y: number } }[]) => void;
    onMouseDown?: (event: any) => void;
    onMouseDownOutput?: (outputIndex: number) => void;
    onMouseUpInput?: (inputIndex: number) => void;
    onClickOutside: () => void;
    onClickDelete?: () => void;
}

const NodeComponent: Component<Props> = (props: Props) => {
    let inputRefs = [...Array(props.inputs)];
    let outputRefs = [...Array(props.outputs)];

    onMount(() => {
        let inputs: { offset: { x: number; y: number } }[] = [];
        let outputs: { offset: { x: number; y: number } }[] = [];
        for (let i = 0; i < inputRefs.length; i++) {
            inputs.push({ offset: { x: inputRefs[i].getBoundingClientRect().x, y: inputRefs[i].getBoundingClientRect().y } });
        }

        for (let i = 0; i < outputRefs.length; i++) {
            outputs.push({ offset: { x: outputRefs[i].getBoundingClientRect().x, y: outputRefs[i].getBoundingClientRect().y } });
        }
        props.onNodeMount(inputs, outputs);
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

    return (
        <div
            ref={props.ref}
            class={props.selected ? styles.nodeSelected : styles.node}
            style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
            onMouseDown={props.onMouseDown}
            use:clickOutside={() => props.onClickOutside()}
        >
            <div class={props.selected ? styles.actions : styles.actionsHidden}>
                {props.actions && props.actions.delete && (
                    <svg
                        class={styles.delete}
                        onClick={() => {
                            if (props.onClickDelete) props.onClickDelete();
                        }}
                        fill="currentColor"
                        stroke-width="0"
                        baseProfile="tiny"
                        version="1.2"
                        viewBox="4 4 16 16"
                        style="overflow: visible;"
                    >
                        <path d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8 8-3.582 8-8-3.581-8-8-8zm3.707 10.293a.999.999 0 11-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 01-1.414 0 .999.999 0 010-1.414L10.586 12 8.293 9.707a.999.999 0 111.414-1.414L12 10.586l2.293-2.293a.999.999 0 111.414 1.414L13.414 12l2.293 2.293z"></path>
                    </svg>
                )}
            </div>
            {props.label && <span class={styles.nodeLabel}>{props.label}</span>}
            <div class={styles.nodeContent}>{props.content}</div>
            {props.inputs > 0 && (
                <div class={styles.nodeInputs}>
                    <For each={[...Array(props.inputs).keys()]}>
                        {(item: number, index: Accessor<number>) => (
                            <div
                                ref={(ref: any) => {
                                    inputRefs[index()] = ref;
                                }}
                                class={styles.nodeInput}
                                onMouseDown={(event: any) => {
                                    event.stopPropagation();
                                }}
                                onMouseUp={(event: any) => {
                                    event.stopPropagation();
                                    if (props.onMouseUpInput) props.onMouseUpInput(index());
                                }}
                            ></div>
                        )}
                    </For>
                </div>
            )}
            {props.outputs > 0 && (
                <div id="outputs" class={styles.nodeOutputs}>
                    <For each={[...Array(props.outputs).keys()]}>
                        {(item: number, index: Accessor<number>) => (
                            <div
                                ref={(ref: any) => {
                                    outputRefs[index()] = ref;
                                }}
                                class={styles.nodeOutput}
                                onMouseDown={(event: any) => {
                                    event.stopPropagation();
                                    if (props.onMouseDownOutput) props.onMouseDownOutput(index());
                                }}
                            ></div>
                        )}
                    </For>
                </div>
            )}
        </div>
    );
};

export default NodeComponent;
