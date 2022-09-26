import { Accessor, Component, createEffect, createSignal, For } from "solid-js";
import EdgeComponent from "../EdgeComponent";
import styles from "./styles.module.css";

interface Vector {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

interface EdgesPositions {
    [id: string]: Vector;
}

interface EdgesActive {
    [id: string]: boolean;
}

interface Props {
    newEdge: { position: Vector; sourceNode: number; sourceOutput: number } | null;
    edgesActives: EdgesActive;
    edgesPositions: EdgesPositions;
    onDeleteEdge: (edgeId: string) => void;
}

const EdgesBoard: Component<Props> = (props: Props) => {
    const [ids, setIds] = createSignal<string[]>([]);
    const [selected, setSelected] = createSignal<string>("null");

    createEffect(() => {
        const newIds = Object.keys(props.edgesActives).filter((elem: string) => props.edgesActives[elem]);
        setIds(newIds);
    });

    createEffect(() => {
        if (selected() !== "null" && props.newEdge !== null) setSelected("null");
    });

    return (
        <svg class={styles.main}>
            {props.newEdge !== null && (
                <EdgeComponent
                    selected={false}
                    isNew={true}
                    position={{
                        x0: props.newEdge.position.x0,
                        y0: props.newEdge.position.y0,
                        x1: props.newEdge.position.x1,
                        y1: props.newEdge.position.y1,
                    }}
                    onClickDelete={() => {}}
                    onClickEdge={() => {}}
                />
            )}
            <For each={ids()}>
                {(edgeId: string) => {
                    if (props.edgesActives[edgeId])
                        return (
                            <EdgeComponent
                                selected={edgeId === selected()}
                                isNew={false}
                                position={{
                                    x0: props.edgesPositions[edgeId].x0,
                                    y0: props.edgesPositions[edgeId].y0,
                                    x1: props.edgesPositions[edgeId].x1,
                                    y1: props.edgesPositions[edgeId].y1,
                                }}
                                onClickDelete={() => {
                                    props.onDeleteEdge(edgeId);
                                }}
                                onClickEdge={() => {
                                    setSelected(edgeId);
                                }}
                            />
                        );
                }}
            </For>
        </svg>
    );
};

export default EdgesBoard;
