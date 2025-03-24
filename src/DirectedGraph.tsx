import React, { useEffect, useRef } from 'react';
import * as joint from '@joint/core';
import * as dagre from 'dagre';
import { Node, Edge} from './globals';

interface DirectedGraphProps {
    nodes: Node[];
    edges: Edge[];
}

function calculateLayout (nodes: Node[], edges: Edge[]) {
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({
        rankdir: 'LR', // Layout direction: Left to Right (LR), Top to Bottom (TB)
        align: 'UL',   // Alignment: Upper Left (UL), Lower Right (LR), etc.
        nodesep: 50,   // Separation between nodes
        ranksep: 100, // Separation between ranks
    });
    graph.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
        graph.setNode(node.id, { width: 100, height: 40 }); // Node dimensions
    });

    edges.forEach((edge) => {
        graph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(graph);

    // Update node positions based on layout
    const positionedNodes = nodes.map((node) => {
        const dagreNode = graph.node(node.id);
        return {
            ...node,
            position: { x: dagreNode.x, y: dagreNode.y },
        };
    });

    return positionedNodes;
};

const DirectedGraph: React.FC<DirectedGraphProps> = ({nodes, edges})=>{
    const graphRef = useRef<joint.dia.Graph>(null);
    const paperRef = useRef<joint.dia.Paper>(null);

    useEffect(()=>{
        const graph = new joint.dia.Graph();
        graphRef.current = graph;

        const paper = new joint.dia.Paper({
            el: document.getElementById("canvas"),
            model: graph,
            width: 1280,
            height: 600,
            gridSize: 10,
            drawGrid: false,
            background: {
                color: '#f8f9fa',
            },
            defaultConnectionPoint: {
                name: 'boundary'
            },
        });
        paperRef.current = paper;

        const positionedNodes = calculateLayout(nodes, edges);
        const nodeMap: { [key: string]: joint.shapes.standard.Rectangle } = {};

        positionedNodes.forEach((node) => {
            const circle = new joint.shapes.standard.Circle({
                id: node.id,
                position: node.position,
                size: { width: 80, height: 80 },
                attrs: {
                    body: {
                        fill: '#6a6c8a',
                    },
                    label: {
                        text:node.label,
                        textAnchor: 'middle'
                    },
                },
            });
            circle.addTo(graph);
            nodeMap[node.id] = circle;
            console.log(`node position: ${node.position.x}, ${node.position.y}`)
        });
        edges.forEach((edge) => {
            const link = new joint.shapes.standard.Link({
                source: edge.source == edge.target? { id: edge.source , anchor: {name: "top"}} : { id: edge.source, anchor: {name: "center"}},
                target: edge.source == edge.target? { id: edge.target , anchor: {name: "right"}} : { id: edge.target, anchor: {name: "center"}},
                attrs: {
                    line: {
                        stroke: 'black',
                        strokeWidth: 2,
                        targetMarker: {
                            'type': 'path',
                            'd': 'M 10 -5 0 0 10 5 z', // Arrowhead
                        },
                        sourceMarker: {
                            'type': 'path',
                        }
                    },
                },
                labels: edge.label ? [
                        {
                            position: 0.5, // Position of label
                            attrs: {
                                text: {
                                    text: edge.label,
                                    fill: 'black',
                                    fontSize: 12,
                                    textAnchor: 'middle',
                                    yAlignment: 'middle',
                                }
                            },
                        },
                    ] : [],
                router: edge.source == edge.target? {name: "manhattan", args:{
                    startDirections: ["top"],
                    endDirections: ["right"],
                    padding: 10, // Adjust this to make the loop smaller
                    maxAllowedDirectionChange: 180
                }} : {name: "normal"},
                connector: edge.source == edge.target? {name: "rounded", radius: 8} : {name: "smooth", args:{

                }
                },
            });
            if(edge.source !== edge.target){
                const x = nodeMap[edge.source].attributes.position!.x
                const y = nodeMap[edge.source].attributes.position!.y
                const x2 = nodeMap[edge.target].attributes.position!.x
                const y2 = nodeMap[edge.target].attributes.position!.y
                let verty = (y+y2)/2;
                const vertx = (x+x2)/2 + 40;
                const scale = ((x<x2? x2-x : x -x2))/600 + 1 //scale curve position by distance
                verty = x<x2? verty+(10*scale) : verty+(60*scale);
                link.vertices([{x: vertx,y:verty}]);
            }
            link.addTo(graph);
        });
    })
    return (
        <div id="canvas" />
    )

}

export default DirectedGraph;