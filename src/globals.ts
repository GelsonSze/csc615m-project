import { Queue } from "./Queue"
import { Stack } from "./Stack"
import { Tape, Tape_2D } from "./Tape"
import { State } from "./State";

export let Queues: {[name: string]: Queue} = {};
export let Stacks: {[name: string]: Stack} = {};
export let Tapes: {[name : string]: Tape} = {};
export let States: {[name: string]: State} = {};
export let Tapes_2D: {[name: string]: Tape_2D} = {};
export const InputTape: Tape = new Tape("InputTape");
export const MachineOutput: string = "";

export function clearGlobals(): void{
    Queues = {};
    Stacks = {};
    Tapes = {};
    Tapes_2D = {};
    States = {};
    InputTape.clearItems();
    Nodes = [];
    Edges = [];
}

//globals for GUI
export interface Node {
    id: string;
    label: string;
    position: { x: number; y: number };
}
export interface Edge {
    source: string;
    target: string;
    label: string;
}

export let Nodes: Node[] = [];
export let Edges: Edge[] = [];