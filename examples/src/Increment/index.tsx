import { Component, createEffect, createSignal } from "solid-js";
import { Node, Edge, SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const Increment: Component = () => {
    const [countA, setCountA] = createSignal<number>(0);
    const [countB, setCountB] = createSignal<number>(0);

    const initialNodes = [
        {
            id: "node-1",
            position: { x: 50, y: 100 },
            data: {
                label: "Controller",
                content: (
                    <div style={{ display: "flex", "flex-direction": "column", gap: "12px" }}>
                        <button class={styles.button} onClick={() => setCountA(countA() + 1)}>
                            Increment A
                        </button>
                        <button class={styles.button} onClick={() => setCountB(countB() + 1)}>
                            Increment B
                        </button>
                        <button
                            class={styles.button}
                            onClick={() => {
                                setCountA(0);
                                setCountB(0);
                            }}
                        >
                            Reset both
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
                label: "Node A",
                content: <h3 style={{ margin: "0px" }}>{countA()}</h3>,
            },
            inputs: 1,
            outputs: 1,
        },
        {
            id: "node-3",
            position: { x: 350, y: 300 },
            data: {
                label: "Node B",
                content: <h3 style={{ margin: "0px" }}>{countB()}</h3>,
            },
            inputs: 1,
            outputs: 1,
        },
        {
            id: "node-4",
            position: { x: 550, y: 200 },
            data: {
                label: "Sum",
                content: <h3 style={{ margin: "0px" }}>{countA() + countB()}</h3>,
            },
            inputs: 2,
            outputs: 0,
        },
    ];

    const initialEdges = [
        {
            id: "edge_0:0_1:0",
            sourceNode: 0,
            sourceOutput: 0,
            targetNode: 1,
            targetInput: 0,
        },
        {
            id: "edge_0:0_2:0",
            sourceNode: 0,
            sourceOutput: 0,
            targetNode: 2,
            targetInput: 0,
        },
        {
            id: "edge_1:0_3:0",
            sourceNode: 1,
            sourceOutput: 0,
            targetNode: 3,
            targetInput: 0,
        },
        {
            id: "edge_2:0_3:1",
            sourceNode: 2,
            sourceOutput: 0,
            targetNode: 3,
            targetInput: 1,
        },
    ];

    const [nodes, setNodes] = createSignal<Node[]>(initialNodes);
    const [edges, setEdges] = createSignal<Edge[]>(initialEdges);

    createEffect(() => {
        console.log("nodes", nodes());
        console.log("edges", edges());
    });

    return (
        <div class={styles.main}>
            <SolidFlow
                nodes={nodes()}
                edges={edges()}
                onNodesChange={(newNodes: Node[]) => {
                    console.log("new nodes", newNodes);
                    setNodes(newNodes);
                }}
                onEdgesChange={(newEdges: Edge[]) => {
                    console.log("new edges", newEdges);
                    setEdges(newEdges);
                }}
            />
        </div>
    );
};

export default Increment;
