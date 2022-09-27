import { Component, createSignal } from "solid-js";
import { SolidFlow } from "solid-flow";
import styles from "./styles.module.css";

const initialNodes = [
    {
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
        sourceNode: 0,
        sourceOutput: 1,
        targetNode: 1,
        targetInput: 0,
    },
    {
        sourceNode: 0,
        sourceOutput: 1,
        targetNode: 2,
        targetInput: 0,
    },
    {
        sourceNode: 0,
        sourceOutput: 0,
        targetNode: 1,
        targetInput: 1,
    },
    {
        sourceNode: 1,
        sourceOutput: 0,
        targetNode: 3,
        targetInput: 0,
    },
    {
        sourceNode: 2,
        sourceOutput: 0,
        targetNode: 3,
        targetInput: 1,
    },
];

const Simple: Component = () => {
    return (
        <div class={styles.main}>
            <SolidFlow nodes={initialNodes} edges={initialEdges} />
        </div>
    );
};

export default Simple;
