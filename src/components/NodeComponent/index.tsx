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
    label: string;
    content: any;
    inputs: number;
    outputs: number;
    onNodeMount: (inputs: { offset: { x: number; y: number } }[], outputs: { offset: { x: number; y: number } }[]) => void;
    onMouseDown?: (event: any) => void;
    onMouseDownOutput?: (outputIndex: number) => void;
    onMouseUpInput?: (inputIndex: number) => void;
    onClickOutside: () => void;
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
            <span class={styles.nodeLabel}>{props.label}</span>
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
