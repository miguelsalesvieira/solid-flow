import { Accessor, Component, createSignal, For } from "solid-js";
import NodeComponent from "../NodeComponent";
import styles from "./styles.module.css";

interface NodeProps {
    data: { label?: string; content: any };
    inputs: number;
    outputs: number;
}

interface Props {
    nodesPositions: { x: number; y: number }[];
    nodes: NodeProps[];
    onNodeMount: (values: {
        nodeIndex: number;
        inputs: { offset: { x: number; y: number } }[];
        outputs: { offset: { x: number; y: number } }[];
    }) => void;
    onNodePress: (x: number, y: number) => void;
    onNodeMove: (nodeIndex: number, x: number, y: number) => void;
    onOutputMouseDown: (nodeIndex: number, outputIndex: number) => void;
    onInputMouseUp: (nodeIndex: number, inputIndex: number) => void;
    onMouseUp: () => void;
    onMouseMove: (x: number, y: number) => void;
}

const NodesBoard: Component<Props> = (props: Props) => {
    const [grabbing, setGrabbing] = createSignal<number | null>(null);
    const [selected, setSelected] = createSignal<number | null>(null);

    let scene: any;

    function handleOnMouseMoveScene(event: any) {
        const x = event.x - scene.getBoundingClientRect().x;
        const y = event.y - scene.getBoundingClientRect().y;
        if (grabbing() !== null) {
            props.onNodeMove(grabbing() || 0, x, y);
        }
        props.onMouseMove(x, y);
    }

    function handleOnMouseUpScene(event: any) {
        setGrabbing(null);
        props.onMouseUp();
    }

    function handleOnMouseDownNode(index: number, x: number, y: number) {
        setGrabbing(index);
        setSelected(index);
        props.onNodePress(
            x - scene.getBoundingClientRect().x - props.nodesPositions[index].x,
            y - scene.getBoundingClientRect().y - props.nodesPositions[index].y
        );
    }

    return (
        <div ref={scene} class={styles.main} onMouseMove={handleOnMouseMoveScene} onMouseUp={handleOnMouseUpScene}>
            <For each={props.nodes}>
                {(node: NodeProps, index: Accessor<number>) => (
                    <NodeComponent
                        x={props.nodesPositions[index()].x}
                        y={props.nodesPositions[index()].y}
                        selected={selected() === index()}
                        label={node.data.label}
                        content={node.data.content}
                        inputs={node.inputs}
                        outputs={node.outputs}
                        onMouseDown={(event: any) => handleOnMouseDownNode(index(), event.x, event.y)}
                        onNodeMount={(inputs: { offset: { x: number; y: number } }[], outputs: { offset: { x: number; y: number } }[]) =>
                            props.onNodeMount({
                                nodeIndex: index(),
                                inputs: inputs.map((values: { offset: { x: number; y: number } }) => {
                                    return {
                                        offset: {
                                            x: values.offset.x - scene.getBoundingClientRect().x - props.nodesPositions[index()].x + 6,
                                            y: values.offset.y - scene.getBoundingClientRect().y - props.nodesPositions[index()].y + 6,
                                        },
                                    };
                                }),
                                outputs: outputs.map((values: { offset: { x: number; y: number } }) => {
                                    return {
                                        offset: {
                                            x: values.offset.x - scene.getBoundingClientRect().x - props.nodesPositions[index()].x + 6,
                                            y: values.offset.y - scene.getBoundingClientRect().y - props.nodesPositions[index()].y + 6,
                                        },
                                    };
                                }),
                            })
                        }
                        onMouseDownOutput={(outputIndex: number) => props.onOutputMouseDown(index(), outputIndex)}
                        onMouseUpInput={(inputIndex: number) => props.onInputMouseUp(index(), inputIndex)}
                        onClickOutside={() => {
                            if (index() === selected()) setSelected(null);
                        }}
                    />
                )}
            </For>
        </div>
    );
};

export default NodesBoard;
