import { Component, createEffect, createSignal } from "solid-js";
import { Node, Edge, SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const initialNodes = [
    {
        id: "node-1",
        position: { x: 50, y: 100 },
        data: {
            content: <p>This is a simple node</p>,
        },
        inputs: 0,
        outputs: 1,
    },
    {
        id: "node-2",
        position: { x: 350, y: 100 },
        data: {
            label: "Node with label",
            content: <p>This is a node with a label</p>,
        },
        inputs: 1,
        outputs: 1,
    },
    {
        id: "node-3",
        position: { x: 350, y: 300 },
        data: {
            content: <p style={{ width: "200px" }}>This is a node with two inputs and two outputs</p>,
        },
        inputs: 2,
        outputs: 2,
    },

    {
        id: "node-4",
        position: { x: 700, y: 100 },
        data: {
            label: "Only inputs",
            content: <p>This is a node with only inputs</p>,
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

const Simple: Component = () => {
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

export default Simple;
