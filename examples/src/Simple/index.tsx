import { Component, createEffect, createSignal } from "solid-js";
import { Node, Edge, SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const initialNodes = [
    {
        id: "node-1",
        position: { x: 50, y: 100 },
        data: {
            label: "Single Select",
            content: (
                <div>
                    <h3>Content</h3>
                </div>
            ),
        },
        inputs: 0,
        outputs: 2,
    },
    {
        id: "node-2",
        position: { x: 300, y: 100 },
        data: {
            label: "Node 2",
            content: (
                <div>
                    <h3>Content</h3>
                    <button onClick={() => console.log("im button")}>button</button>
                </div>
            ),
        },
        inputs: 2,
        outputs: 1,
    },
    {
        id: "node-3",
        position: { x: 300, y: 300 },
        data: {
            label: "Node 3",
            content: (
                <div>
                    <h3>Content</h3>
                </div>
            ),
        },
        inputs: 2,
        outputs: 1,
    },

    {
        id: "node-4",
        position: { x: 600, y: 100 },
        data: {
            label: "Node 4",
            content: (
                <div>
                    <h3>Content</h3>
                </div>
            ),
        },
        inputs: 2,
        outputs: 0,
    },
];

const initialEdges = [
    {
        id: "edge-0:1-1:0",
        sourceNode: 0,
        sourceOutput: 1,
        targetNode: 1,
        targetInput: 0,
    },
    {
        id: "edge-0:1-2:0",
        sourceNode: 0,
        sourceOutput: 1,
        targetNode: 2,
        targetInput: 0,
    },
    {
        id: "edge-0:0-1:1",
        sourceNode: 0,
        sourceOutput: 0,
        targetNode: 1,
        targetInput: 1,
    },
    {
        id: "edge-1:0-3:0",
        sourceNode: 1,
        sourceOutput: 0,
        targetNode: 3,
        targetInput: 0,
    },
    {
        id: "edge-2:0-3:1",
        sourceNode: 2,
        sourceOutput: 0,
        targetNode: 3,
        targetInput: 1,
    },
];

const Simple: Component = () => {
    const [nodes, setNodes] = createSignal(initialNodes);
    const [edges, setEdges] = createSignal(initialEdges);

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

export default Simple;
