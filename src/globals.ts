import { Queue } from "./Queue"
import { Stack } from "./Stack"
import { Tape } from "./Tape"
import { State } from "./State";

export const Queues: {[name: string]: Queue<unknown>} = {};
export const Stacks: {[name: string]: Stack<unknown>} = {};
export const Tapes: {[name : string]: Tape} = {};
export const States: {[name: string]: State} = {};
export const InputTape: Tape = new Tape("InputTape");

export const enum Direction{Up, Down, Left, Right}