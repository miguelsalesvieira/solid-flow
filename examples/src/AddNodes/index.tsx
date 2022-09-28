import { Component, createEffect, createSignal, onMount } from "solid-js";
import { Node, Edge, SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const AddNodes: Component = () => {
    const [nodes, setNodes] = createSignal<Node[]>([]);
    const [edges, setEdges] = createSignal<Edge[]>([]);

    onMount(() => {
        const initialNodes = [
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
                                    setNodes([
                                        ...nodes(),
                                        {
                                            id: `node-${nodes().length + 1}`,
                                            position: { x: 200, y: 200 },
                                            data: {
                                                label: `Node ${nodes().length}`,
                                                content: <p>Simple Node</p>,
                                            },
                                            inputs: 0,
                                            outputs: 0,
                                        },
                                    ]);
                                }}
                            >
                                Add node
                            </button>
                        </div>
                    ),
                },
                inputs: 0,
                outputs: 0,
            },
        ];
        setNodes([...nodes(), ...initialNodes]);
    });

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

export default AddNodes;
