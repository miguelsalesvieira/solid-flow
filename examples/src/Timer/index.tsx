import { Component, createEffect, createSignal } from "solid-js";
import { Node, Edge, SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const Timer: Component = () => {
    const [active, setActive] = createSignal<boolean>(false);
    const [timer, setTimer] = createSignal<number>(0);

    setInterval(() => {
        if (active()) setTimer(timer() + 1);
    }, 1000);

    const initialNodes: Node[] = [
        {
            id: "node-1",
            position: { x: 50, y: 100 },
            data: {
                label: "Controller",
                content: (
                    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
                        <button
                            class={styles.button}
                            onClick={() => {
                                if (!active()) setActive(true);
                            }}
                        >
                            Start
                        </button>
                        <button
                            class={styles.button}
                            onClick={() => {
                                if (active()) setActive(false);
                            }}
                        >
                            Stop
                        </button>
                        <button
                            class={styles.button}
                            onClick={() => {
                                setTimer(0);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                ),
            },
            inputs: 0,
            outputs: 1,
        },
        {
            id: "node-2",
            position: { x: 350, y: 100 },
            data: {
                label: "Timer",
                content: <h3 style={{ margin: "0px" }}>{timer()}s</h3>,
            },
            inputs: 1,
            outputs: 1,
        },
        {
            id: "node-3",
            position: { x: 350, y: 300 },
            data: {
                label: "Status",
                content: (
                    <h3
                        style={{
                            margin: "0px",
                            "background-color": active() ? "green" : "red",
                            padding: "12px",
                            "border-radius": "6px",
                            color: "white",
                        }}
                    >
                        {active() ? "Active" : "Inactive"}
                    </h3>
                ),
            },
            inputs: 1,
            outputs: 0,
        },
        {
            id: "node-4",
            position: { x: 550, y: 100 },
            data: {
                label: "Output",
                content: (
                    <div style={{ display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center" }}>
                        <div
                            style={{
                                height: "40px",
                                width: "40px",
                                "background-color": "#e38b29",
                                "border-radius": timer() % 2 === 0 ? "2px" : "100%",
                                transition: "all ease 0.2s",
                            }}
                        ></div>
                        <p>This changes to square if timer is even and circle if odd</p>
                    </div>
                ),
            },
            inputs: 1,
            outputs: 0,
        },
    ];

    const initialEdges: Edge[] = [
        {
            id: "edge_node-1:0_node-2:0",
            sourceNode: "node-1",
            sourceOutput: 0,
            targetNode: "node-2",
            targetInput: 0,
        },
        {
            id: "edge_node-1:0_node-2:0",
            sourceNode: "node-1",
            sourceOutput: 0,
            targetNode: "node-3",
            targetInput: 0,
        },
        {
            id: "edge_node-1:0_node-2:0",
            sourceNode: "node-2",
            sourceOutput: 0,
            targetNode: "node-4",
            targetInput: 0,
        },
    ];

    const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
    const [edges, setEdges] = createSignal<Edge[]>(initialEdges);

    return (
        <div class={styles.main}>
            <SolidFlow
                nodes={nodes()}
                edges={edges()}
                onNodesChange={(newNodes: Node[]) => {
                    setNodes(newNodes);
                }}
                onEdgesChange={(newEdges: Edge[]) => {
                    setEdges(newEdges);
                }}
            />
        </div>
    );
};

export default Timer;
