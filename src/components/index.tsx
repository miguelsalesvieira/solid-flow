import { Component, createEffect, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import EdgesBoard from "./EdgesBoard";
import NodesBoard from "./NodesBoard";
import styles from "./styles.module.css";

interface Position {
    x: number;
    y: number;
}

interface Vector {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

interface NodeData {
    data: { label?: string; content: any };
    inputs: number;
    outputs: number;
    edgesIn: string[];
    edgesOut: string[];
}

interface EdgesNodes {
    [id: string]: { outNodeId: string; outputIndex: number; inNodeId: string; inputIndex: number };
}

interface EdgesPositions {
    [id: string]: Vector;
}

interface EdgesActive {
    [id: string]: boolean;
}

export interface NodeProps {
    id: string;
    position: { x: number; y: number };
    data: { label?: string; content: any };
    inputs: number;
    outputs: number;
}

export interface EdgeProps {
    id: string;
    sourceNode: number;
    targetNode: number;
    sourceOutput: number;
    targetInput: number;
}

interface Props {
    nodes: NodeProps[];
    edges: EdgeProps[];
    onNodesChange: (newNodes: NodeProps[]) => void;
    onEdgesChange: (newEdges: EdgeProps[]) => void;
}

function getEdgeId(nodeOutId: string, outputIndex: number, nodeInId: string, inputIndex: number) {
    return `edge_${nodeOutId}:${outputIndex}_${nodeInId}:${inputIndex}`;
}

function getInitialEdges(nodes: NodeProps[]): {
    initEdgesNodes: EdgesNodes;
    initEdgesPositions: EdgesPositions;
    initEdgesActives: EdgesActive;
} {
    const initEdgesNodes: EdgesNodes = {};
    const initEdgesPositions: EdgesPositions = {};
    const initEdgesActives: EdgesActive = {};

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if (i !== j) {
                const nodeI = nodes[i];
                const nodeJ = nodes[j];

                for (let x = 0; x < nodeI.outputs; x++) {
                    for (let y = 0; y < nodeJ.inputs; y++) {
                        const edgeId = getEdgeId(i.toString(), x, j.toString(), y);
                        initEdgesPositions[edgeId] = { x0: 0, y0: 0, x1: 0, y1: 0 };
                        initEdgesActives[edgeId] = false;
                        initEdgesNodes[edgeId] = { outNodeId: i.toString(), outputIndex: x, inNodeId: j.toString(), inputIndex: y };
                    }
                }
            }
        }
    }
    return { initEdgesNodes, initEdgesPositions, initEdgesActives };
}

function getInitialNodes(
    nodes: NodeProps[],
    edges: EdgeProps[]
): {
    initNodesPositions: Position[];
    initNodesData: NodeData[];
    initNodesOffsets: { inputs: { offset: Position }[]; outputs: { offset: Position }[] }[];
} {
    const initNodesPositions = nodes.map((node: NodeProps) => node.position);
    const initNodesData = nodes.map((node: NodeProps, nodeIndex: number) => {
        return {
            data: node.data,
            inputs: node.inputs,
            outputs: node.outputs,
            edgesIn: edges
                .map((edge: EdgeProps, edgeIndex: number) => {
                    if (edge.targetNode === nodeIndex)
                        return getEdgeId(edge.sourceNode.toString(), edge.sourceOutput, edge.targetNode.toString(), edge.targetInput);
                    return "null";
                })
                .filter((elem: string) => elem !== "null"),
            edgesOut: edges
                .map((edge: EdgeProps, edgeIndex: number) => {
                    if (edge.sourceNode === nodeIndex)
                        return getEdgeId(edge.sourceNode.toString(), edge.sourceOutput, edge.targetNode.toString(), edge.targetInput);
                    return "null";
                })
                .filter((elem: string) => elem !== "null"),
        };
    });
    const initNodesOffsets = nodes.map((node: NodeProps, nodeIndex: number) => {
        return {
            inputs: [...Array(node.inputs)].map((elem: number) => {
                return { offset: { x: 0, y: 0 } };
            }),
            outputs: [...Array(node.outputs)].map((elem: number) => {
                return { offset: { x: 0, y: 0 } };
            }),
        };
    });

    return { initNodesPositions, initNodesData, initNodesOffsets };
}

const FlowChart: Component<Props> = (props: Props) => {
    // EDGES
    const { initEdgesNodes, initEdgesPositions, initEdgesActives } = getInitialEdges(props.nodes);
    const [edgesPositions, setEdgesPositions] = createSignal<EdgesPositions>(initEdgesPositions);
    const [edgesNodes, setEdgesNodes] = createSignal<EdgesNodes>(initEdgesNodes);
    const [edgesActives, setEdgesActives] = createSignal<EdgesActive>(initEdgesActives);

    // NODES
    const { initNodesPositions, initNodesData, initNodesOffsets } = getInitialNodes(props.nodes, props.edges);
    const [nodesPositions, setNodesPositions] = createSignal<Position[]>(initNodesPositions);
    const [nodesData, setNodesData] = createStore<NodeData[]>(initNodesData);
    const [nodesOffsets, setNodesOffsets] =
        createStore<{ inputs: { offset: Position }[]; outputs: { offset: Position }[] }[]>(initNodesOffsets);

    const [clickedDelta, setClickedDelta] = createSignal<Position>({ x: 0, y: 0 });
    const [newEdge, setNewEdge] = createSignal<{ position: Vector; sourceNode: number; sourceOutput: number } | null>(null);

    createEffect(() => {
        const nextNodesLength = props.nodes.length;
        const prevNodesLength = nodesData.length;

        if (nextNodesLength !== prevNodesLength) {
            setNodesPositions(props.nodes.map((node: NodeProps) => node.position));
            setNodesData(
                props.nodes.map((node: NodeProps, nodeIndex: number) => {
                    return {
                        data: node.data,
                        inputs: node.inputs,
                        outputs: node.outputs,
                        edgesIn: props.edges
                            .map((edge: EdgeProps, edgeIndex: number) => {
                                if (edge.targetNode === nodeIndex)
                                    return getEdgeId(
                                        edge.sourceNode.toString(),
                                        edge.sourceOutput,
                                        edge.targetNode.toString(),
                                        edge.targetInput
                                    );
                                return "null";
                            })
                            .filter((elem: string) => elem !== "null"),
                        edgesOut: props.edges
                            .map((edge: EdgeProps, edgeIndex: number) => {
                                if (edge.sourceNode === nodeIndex)
                                    return getEdgeId(
                                        edge.sourceNode.toString(),
                                        edge.sourceOutput,
                                        edge.targetNode.toString(),
                                        edge.targetInput
                                    );
                                return "null";
                            })
                            .filter((elem: string) => elem !== "null"),
                    };
                })
            );
            setNodesOffsets(
                props.nodes.map((node: NodeProps, nodeIndex: number) => {
                    return {
                        inputs: [...Array(node.inputs)].map((elem: number) => {
                            return { offset: { x: 0, y: 0 } };
                        }),
                        outputs: [...Array(node.outputs)].map((elem: number) => {
                            return { offset: { x: 0, y: 0 } };
                        }),
                    };
                })
            );
        }
    });

    // NODE HANDLERS
    function handleOnNodeMount(values: {
        nodeIndex: number;
        inputs: { offset: { x: number; y: number } }[];
        outputs: { offset: { x: number; y: number } }[];
    }) {
        setNodesOffsets(
            produce(
                (
                    nodesOffsets: {
                        inputs: { offset: { x: number; y: number } }[];
                        outputs: { offset: { x: number; y: number } }[];
                    }[]
                ) => {
                    nodesOffsets[values.nodeIndex].inputs = values.inputs;
                    nodesOffsets[values.nodeIndex].outputs = values.outputs;
                }
            )
        );

        setEdgesActives((prev: EdgesActive) => {
            const next = { ...prev };
            nodesData[values.nodeIndex].edgesIn.map((edgeId: string) => {
                next[edgeId] = true;
            });
            nodesData[values.nodeIndex].edgesOut.map((edgeId: string) => {
                next[edgeId] = true;
            });
            return next;
        });

        setEdgesPositions((prev: EdgesPositions) => {
            const next = { ...prev };
            nodesData[values.nodeIndex].edgesIn.map((edgeId: string) => {
                next[edgeId] = {
                    x0: prev[edgeId]?.x0 || 0,
                    y0: prev[edgeId]?.y0 || 0,
                    x1: nodesPositions()[values.nodeIndex].x + values.inputs[edgesNodes()[edgeId].inputIndex].offset.x,
                    y1: nodesPositions()[values.nodeIndex].y + values.inputs[edgesNodes()[edgeId].inputIndex].offset.y,
                };
            });
            nodesData[values.nodeIndex].edgesOut.map((edgeId: string) => {
                next[edgeId] = {
                    x0: nodesPositions()[values.nodeIndex].x + values.outputs[edgesNodes()[edgeId].outputIndex].offset.x,
                    y0: nodesPositions()[values.nodeIndex].y + values.outputs[edgesNodes()[edgeId].outputIndex].offset.y,
                    x1: prev[edgeId]?.x1 || 0,
                    y1: prev[edgeId]?.y1 || 0,
                };
            });
            return next;
        });
    }

    function handleOnNodePress(deltaX: number, deltaY: number) {
        setClickedDelta({ x: deltaX, y: deltaY });
    }

    function handleOnNodeMove(nodeIndex: number, x: number, y: number) {
        setNodesPositions((prev: Position[]) => {
            const next = [...prev];
            next[nodeIndex].x = x - clickedDelta().x;
            next[nodeIndex].y = y - clickedDelta().y;
            return next;
        });

        setEdgesPositions((prev: EdgesPositions) => {
            const next = { ...prev };
            nodesData[nodeIndex].edgesIn.map((edgeId: string) => {
                if (edgesActives()[edgeId])
                    next[edgeId] = {
                        x0: prev[edgeId]?.x0 || 0,
                        y0: prev[edgeId]?.y0 || 0,
                        x1: x + nodesOffsets[nodeIndex].inputs[edgesNodes()[edgeId].inputIndex].offset.x - clickedDelta().x,
                        y1: y + nodesOffsets[nodeIndex].inputs[edgesNodes()[edgeId].inputIndex].offset.y - clickedDelta().y,
                    };
            });
            nodesData[nodeIndex].edgesOut.map((edgeId: string) => {
                if (edgesActives()[edgeId])
                    next[edgeId] = {
                        x0: x + nodesOffsets[nodeIndex].outputs[edgesNodes()[edgeId].outputIndex].offset.x - clickedDelta().x,
                        y0: y + nodesOffsets[nodeIndex].outputs[edgesNodes()[edgeId].outputIndex].offset.y - clickedDelta().y,
                        x1: prev[edgeId]?.x1 || 0,
                        y1: prev[edgeId]?.y1 || 0,
                    };
            });
            return next;
        });
    }

    function handleOnOutputMouseDown(nodeIndex: number, outputIndex: number) {
        const nodePosition = nodesPositions()[nodeIndex];
        const outputOffset = nodesOffsets[nodeIndex].outputs[outputIndex].offset;
        setNewEdge({
            position: {
                x0: nodePosition.x + outputOffset.x,
                y0: nodePosition.y + outputOffset.y,
                x1: nodePosition.x + outputOffset.x,
                y1: nodePosition.y + outputOffset.y,
            },
            sourceNode: nodeIndex,
            sourceOutput: outputIndex,
        });
    }

    function handleOnInputMouseUp(nodeIndex: number, inputIndex: number) {
        const outputEdges: string[] = JSON.parse(JSON.stringify(nodesData[newEdge()?.sourceNode || 0].edgesOut));
        const inputEdges: string[] = JSON.parse(JSON.stringify(nodesData[nodeIndex].edgesIn));

        const edgeId = getEdgeId(newEdge()?.sourceNode.toString() || "", newEdge()?.sourceOutput || 0, nodeIndex.toString(), inputIndex);

        let haveEdge = false;
        if (outputEdges.includes(edgeId)) haveEdge = true;
        if (inputEdges.includes(edgeId)) haveEdge = true;

        if (!haveEdge) {
            setEdgesPositions((prev: EdgesPositions) => {
                const next = { ...prev };
                next[edgeId] = {
                    x0:
                        nodesPositions()[newEdge()?.sourceNode || 0].x +
                        nodesOffsets[newEdge()?.sourceNode || 0].outputs[newEdge()?.sourceOutput || 0].offset.x,
                    y0:
                        nodesPositions()[newEdge()?.sourceNode || 0].y +
                        nodesOffsets[newEdge()?.sourceNode || 0].outputs[newEdge()?.sourceOutput || 0].offset.y,
                    x1: nodesPositions()[nodeIndex].x + nodesOffsets[nodeIndex].inputs[inputIndex].offset.x,
                    y1: nodesPositions()[nodeIndex].y + nodesOffsets[nodeIndex].inputs[inputIndex].offset.y,
                };
                return next;
            });
            setEdgesActives((prev: EdgesActive) => {
                const next = { ...prev };
                next[edgeId] = true;
                return next;
            });
            setNodesData(
                produce((nodesData: NodeData[]) => {
                    nodesData[newEdge()?.sourceNode || 0].edgesOut.push(edgeId);
                    nodesData[nodeIndex].edgesIn.push(edgeId);
                })
            );
            const activeEdgesKeys = Object.keys(edgesActives());
            const activeEdges: EdgeProps[] = [];
            for (let i = 0; i < activeEdgesKeys.length; i++) {
                if (edgesActives()[activeEdgesKeys[i]]) {
                    const edgeInfo = edgesNodes()[activeEdgesKeys[i]];
                    activeEdges.push({
                        id: activeEdgesKeys[i],
                        sourceNode: parseInt(edgeInfo.outNodeId),
                        sourceOutput: edgeInfo.outputIndex,
                        targetNode: parseInt(edgeInfo.inNodeId),
                        targetInput: edgeInfo.inputIndex,
                    });
                }
            }
            props.onEdgesChange(activeEdges);
        }
        setNewEdge(null);
    }

    function handleOnMouseUp() {
        setNewEdge(null);
    }

    function handleOnMouseMove(x: number, y: number) {
        if (newEdge() !== null)
            setNewEdge({
                position: { x0: newEdge()?.position.x0 || 0, y0: newEdge()?.position.y0 || 0, x1: x, y1: y },
                sourceNode: newEdge()?.sourceNode || 0,
                sourceOutput: newEdge()?.sourceOutput || 0,
            });
    }

    // EDGE HANDLERS
    function handleOnDeleteEdge(edgeId: string) {
        setNodesData(
            produce((nodesData: NodeData[]) => {
                const nodeSourceIndex = parseInt(edgesNodes()[edgeId].outNodeId);
                const nodeTargetIndex = parseInt(edgesNodes()[edgeId].inNodeId);

                nodesData[nodeTargetIndex].edgesIn = nodesData[nodeTargetIndex].edgesIn.filter((elem: string) => elem !== edgeId);
                nodesData[nodeSourceIndex].edgesOut = nodesData[nodeSourceIndex].edgesOut.filter((elem: string) => elem !== edgeId);
            })
        );
        setEdgesActives((prev: EdgesActive) => {
            const next = { ...prev };
            next[edgeId] = false;
            return next;
        });

        const activeEdgesKeys = Object.keys(edgesActives());
        const activeEdges: EdgeProps[] = [];
        for (let i = 0; i < activeEdgesKeys.length; i++) {
            if (edgesActives()[activeEdgesKeys[i]]) {
                const edgeInfo = edgesNodes()[activeEdgesKeys[i]];
                activeEdges.push({
                    id: activeEdgesKeys[i],
                    sourceNode: parseInt(edgeInfo.outNodeId),
                    sourceOutput: edgeInfo.outputIndex,
                    targetNode: parseInt(edgeInfo.inNodeId),
                    targetInput: edgeInfo.inputIndex,
                });
            }
        }
        props.onEdgesChange(activeEdges);
    }

    return (
        <div class={styles.main}>
            <div class={styles.wrapper}>
                <div class={styles.content} style={{ cursor: newEdge() !== null ? "crosshair" : "inherit" }}>
                    <NodesBoard
                        nodesPositions={nodesPositions()}
                        nodes={nodesData.map((elem: NodeData) => {
                            return { ...elem, inputs: elem.inputs, outputs: elem.outputs };
                        })}
                        onNodeMount={handleOnNodeMount}
                        onNodePress={handleOnNodePress}
                        onNodeMove={handleOnNodeMove}
                        onOutputMouseDown={handleOnOutputMouseDown}
                        onInputMouseUp={handleOnInputMouseUp}
                        onMouseUp={handleOnMouseUp}
                        onMouseMove={handleOnMouseMove}
                    />
                    <EdgesBoard
                        newEdge={newEdge()}
                        edgesActives={edgesActives()}
                        edgesPositions={edgesPositions()}
                        onDeleteEdge={handleOnDeleteEdge}
                    />
                </div>
            </div>
        </div>
    );
};

export default FlowChart;
