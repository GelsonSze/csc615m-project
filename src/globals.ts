import { Queue } from "./Queue"
import { Stack } from "./Stack"
import { Tape } from "./Tape"

export const Queues: {[name: string]: Queue<unknown>} = {};
export const Stacks: {[name: string]: Stack<unknown>} = {};
export const Tapes: {[name : string]: Tape<unknown>} = {};
export const enum StateTypes{
    w = "WRITE",
    p = "PRINT",
    s = "SCAN",
    sl = "SCAN_LEFT",
    sr = "SCAN_RIGHT",
    rd = "READ",
    r = "RIGHT",
    l = "LEFT",
    u = "UP",
    d = "DOWN"
}