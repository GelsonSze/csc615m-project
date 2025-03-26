import React, { useEffect, useRef } from 'react';
import * as joint from '@joint/core';
import * as dagre from 'dagre';
import { Node, Edge} from './globals';

interface DirectedGraphProps {
    nodes: Node[];
    edges: Edge[];
    startState: string;
}

const MAX_CONTAINER_WIDTH = 1280;

function calculateLayout (nodes: Node[], edges: Edge[]) {
    const graph = new dagre.graphlib.Graph();

    graph.setDefaultEdgeLabel(() => ({}));
    nodes.forEach((node) => {
        graph.setNode(node.id, { width: 80, height: 80 }); // Node dimensions
    });

    edges.forEach((edge) => {
        graph.setEdge(edge.source, edge.target);
    });

    //update node position for L-R, U-D layout
    const offset = 50
    let currentRowX = offset;
    let currentRowY = offset;
    let currentRowMaxHeight = 0;
    const positionedNodes: Node[] = [];

    nodes
        .map(node => ({
            ...node,
            position: { x: graph.node(node.id).x, y: graph.node(node.id).y },
            width: 80,
            height: 80
        }))
        .sort((a, b) => a.position.x - b.position.x) // Sort nodes left to right
        .forEach(node => {
            if (currentRowX + node.width > MAX_CONTAINER_WIDTH) {
                // Move to the next row
                currentRowX = offset;
                currentRowY += currentRowMaxHeight + 80; // Move down 
                currentRowMaxHeight = 0;
            }

            // Assign new position
            node.position.x = currentRowX;
            node.position.y = currentRowY;

            currentRowX += node.width + 50; // Move right (width + nodesep)
            currentRowMaxHeight = Math.max(currentRowMaxHeight, node.height);

            positionedNodes.push(node);
        });
    return positionedNodes;
};

const DirectedGraph: React.FC<DirectedGraphProps> = ({nodes, edges, startState})=>{
    const graphRef = useRef<joint.dia.Graph>(null);
    const paperRef = useRef<joint.dia.Paper>(null);
    const verticesTool = new joint.linkTools.Vertices({
        redundancyRemoval: false,
        snapRadius: 10,
        vertexAdding: false,
    });
    const toolsView = new joint.dia.ToolsView({
        tools: [verticesTool,]
    });

    useEffect(()=>{
        const graph = new joint.dia.Graph();
        graphRef.current = graph;

        const positionedNodes = calculateLayout(nodes, edges);
        const paper = new joint.dia.Paper({
            el: document.getElementById("canvas"),
            model: graph,
            width: 1280,
            height: 800,
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

        const nodeMap: { [key: string]: joint.shapes.standard.Rectangle } = {};

        positionedNodes.forEach((node) => {
            //normal state
            let circle = new joint.shapes.standard.Circle({
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
            if(node.label == "accept"){
                circle = new joint.shapes.standard.Path({
                    id: node.id,
                    position: node.position,
                    size: { width: 80, height: 80 },
                    attrs: {
                        body: {
                            d: 'M 40 0 A 40 40 0 1 1 40 80 A 40 40 0 1 1 40 0 Z M 40 5 A 35 35 0 1 1 40 75 A 35 35 0 1 1 40 5 Z',
                            stroke: 'black',
                            fill: '#6a6c8a',
                        },
                        label: {
                            text:node.label,
                            textAnchor: 'middle',
                        },
                    },
                });
            }else if(node.id == startState){
                //starting state
                circle = new joint.shapes.standard.Path({
                    id: node.id,
                    position: node.position,
                    size: { width: 80, height: 80 },
                    attrs: {
                        body: {
                            d: 'M -30,20 L 0,40 L -30,60 Z M 40 0 A 40 40 0 1 1 40 80 A 40 40 0 1 1 40 0 Z',//M -triangle, 2nd M - circle
                            stroke: 'black',
                            fill: '#6a6c8a',
                        },
                        label: {
                            text:node.label,
                            textAnchor: 'middle',
                        },
                    },
                });
            }
            circle.addTo(graph);
            nodeMap[node.id] = circle;
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
                                    fill: 'red',
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
            const linkView = link.findView(paper);
            linkView.addTools(toolsView)
            paper.on('link:mouseenter', function(linkView) {
                linkView.addTools(toolsView);
            });
            paper.on('link:mouseleave', function(linkView) {
                linkView.removeTools();
            });
        });
    })
    return (
        <div id="canvas" />
    )

}

export default DirectedGraph;