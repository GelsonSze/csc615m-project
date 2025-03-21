import { Queue } from "./Queue";
import { Stack } from "./Stack";
import { Tape } from "./Tape";

export const enum StateTypes{
    w = "WRITE",
    p = "PRINT",
    s = "SCAN",
    sl = "SCAN LEFT",
    sr = "SCAN RIGHT",
    rd = "READ",
    r = "RIGHT",
    l = "LEFT",
    u = "UP",
    d = "DOWN",
    accept = "ACCEPT",
    reject = "REJECT",
}
export interface Transition{
    symbol: string,
    dest: string,
    replacementSymbol?: string
}
export class State {
    private name: string;
    private type: StateTypes;
    private transitions: Transition[];

    public constructor(name: string, type: StateTypes) { 
        this.name = name; 
        this.type = type; 
        this.transitions = [];
    }

    public getName(): string{
        return this.name;
    }

    public getType(): StateTypes{
        return this.type;
    }

    public addTransition(symbol: string, dest: string, replacementSymbol?: string): void{
        this.transitions.push({symbol, dest, replacementSymbol});
    }

    public printTransitions(){
        this.transitions.forEach((transition)=>{
            console.log(`State transition for state ${this.name}: \n symbol: ${transition.symbol}, destination: ${transition.dest}, replacement: ${transition.replacementSymbol}`)
        })
    }

}

export class PrintState extends State{
    public print(transition: Transition): string{
        return transition.symbol;
    }
}

export class ScanState extends State{
    public scan(): void{
        
    }
}

export class WriteState extends State{
    private memoryObject: string = "";
    public setMemoryObject(memoryObject: string){this.memoryObject = memoryObject;}
    public getMemoryObject(): string{return this.memoryObject;}

    public write(datastruct: Stack<unknown> | Queue<unknown>, transition: Transition): string{
        if(datastruct instanceof Stack)
            datastruct.push(transition.symbol);
        else
            datastruct.enqueue(transition.symbol);
        return transition.dest;
    }
}

export class MoveState extends State{
    private memoryObject: string = "";
    public setMemoryObject(memoryObject: string){this.memoryObject = memoryObject;}
    public getMemoryObject(): string{return this.memoryObject;}

    public move(tape: Tape): void{
        tape.push(""); //random push
        if(this.getType() == StateTypes.r){return}
        else if(this.getType() == StateTypes.l){return}
        else if(this.getType() == StateTypes.u){return}
        else if(this.getType() == StateTypes.d){return}
    }
}

export class ReadState extends State{
    private memoryObject: string = "";
    public setMemoryObject(memoryObject: string){this.memoryObject = memoryObject;}
    public getMemoryObject(): string{return this.memoryObject;}

    public read(): void{
        
    }
}

export class AcceptState extends State{
    public acceptInput(): void{

    }
}

export class RejectState extends State{
    public rejectInput(): void{
        
    }
}