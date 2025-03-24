import { InputTape, MachineOutput, Queues, Stacks, Tapes, Tapes_2D } from './globals';

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

export const StateLabels = {
    "WRITE" : "W",
    "PRINT" : "P",
    "SCAN" : "S",
    "SCAN LEFT" : "SL",
    "SCAN RIGHT" : "SR",
    "READ" : "READ",
    "RIGHT" : "R",
    "LEFT" : "L",
    "UP" : "U",
    "DOWN" : "D",
    "ACCEPT" : "ACCEPT",
    "REJECT" : "REJECT",
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
    private label: string; //label to be placed on graph

    public constructor(name: string, type: StateTypes) { 
        this.name = name; 
        this.type = type; 
        this.transitions = [];
        this.label = name + "-" + StateLabels[type.toString() as keyof typeof StateLabels];
    }

    public getName(): string{
        return this.name;
    }

    public getType(): StateTypes{
        return this.type;
    }

    public getTransitions(): Transition[]{
        return this.transitions;
    }

    public addTransition(symbol: string, dest: string, replacementSymbol?: string): void{
        this.transitions.push({symbol, dest, replacementSymbol});
    }

    public printTransitions(){
        this.transitions.forEach((transition)=>{
            console.log(`Transitions for state ${this.name}: \nsymbol: ${transition.symbol}, destination: ${transition.dest}, replacement: ${transition.replacementSymbol}`)
        })
    }

    public getLabel():string{return this.label}
    public setLabel(label: string){this.label = label}

    public step():string[]{return []};
}

export class PrintState extends State{
    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];
        transitionArr.forEach((transition)=>{
            MachineOutput.concat(transition.symbol)
            destStates.push(transition.dest)
        })
        return destStates
    }
}

export class ScanState extends State{
    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];
        if(this.getType() === StateTypes.sl){InputTape.movePointerLeft()}
        else{InputTape.movePointerRight()}

        const curSymbol: string= InputTape.getPointerSymbol();
        transitionArr.forEach((transition)=>{
            if(transition.symbol == curSymbol){
                destStates.push(transition.dest)
            }
        })
        
        return destStates
    }
}

export class WriteState extends State{
    private memoryObject: string = ""; //name of memoryobject
    public setMemoryObject(memoryObject: string){
        this.memoryObject = memoryObject; 
        this.setLabel(this.getLabel().concat(`-${memoryObject}`))
    }
    public getMemoryObject(): string{return this.memoryObject;}

    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];

        transitionArr.forEach((transition)=>{
            if(this.memoryObject in Queues){Queues[this.memoryObject].enqueue(transition.symbol)}
            else if(this.memoryObject in Stacks){Stacks[this.memoryObject].push(transition.symbol)}
            else {throw Error("Writing to invalid memory object")}
            
            destStates.push(transition.dest)
        })
        return destStates
    }
}

export class ReadState extends State{
    private memoryObject: string = ""; //name of memoryobject
    public setMemoryObject(memoryObject: string){
        this.memoryObject = memoryObject; 
        this.setLabel(this.getLabel().concat(`-${memoryObject}`))
    }
    public getMemoryObject(): string{return this.memoryObject;}

    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];
        let readSymbol;

        if(this.memoryObject in Queues){readSymbol = Queues[this.memoryObject].dequeue()}
        else if(this.memoryObject in Stacks){readSymbol = Stacks[this.memoryObject].pop()}
        else {throw TypeError("Writing to invalid memory object")}

        transitionArr.forEach((transition)=>{
            if(readSymbol == transition.symbol){
                destStates.push(transition.dest)
            }
        })
        if(destStates.length == 0){throw Error("Read symbol has no valid state transtitions")}

        return destStates
    }
}

export class MoveState extends State{
    private memoryObject: string = ""; //name of memoryobject
    public setMemoryObject(memoryObject: string){
        this.memoryObject = memoryObject; 
        this.setLabel(this.getLabel().concat(`-${memoryObject}`))
    }
    public getMemoryObject(): string{return this.memoryObject;}

    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];

        if(this.getType() == StateTypes.r){Tapes[this.memoryObject].movePointerRight()}
        else if(this.getType() == StateTypes.l){Tapes[this.memoryObject].movePointerLeft()}
        else if(this.getType() == StateTypes.u){Tapes_2D[this.memoryObject].getName()}
        else if(this.getType() == StateTypes.d){Tapes_2D[this.memoryObject].getName()}

        const curSymbol: string= Tapes[this.memoryObject].getPointerSymbol();
        transitionArr.forEach((transition)=>{
            if(transition.symbol == curSymbol){
                destStates.push(transition.dest)
            }
        })
        return destStates
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