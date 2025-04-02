import { Queues, Stacks, Tapes, Tapes_2D, MachineVariables, States} from './globals';

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
    "ACCEPT" : "accept",
    "REJECT" : "reject",
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
        if(!MachineVariables.hasAccept && dest == "accept"){
            States["accept"] = new AcceptState();
            MachineVariables.hasAccept = true
        }
        else if(!MachineVariables.hasReject && dest == "reject"){
            States["reject"] = new RejectState();
            MachineVariables.hasReject = true;
        }
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
            MachineVariables.output += transition.symbol
            console.log("PRINTING")
            console.log(MachineVariables.output)
            destStates.push(transition.dest)
        })
        return destStates
    }
}

export class ScanState extends State{
    public step(): string[]{
        const transitionArr = this.getTransitions();
        const destStates: string[]= [];
        if(this.getType() === StateTypes.sl){MachineVariables.inputTape.movePointerLeft()}
        else{MachineVariables.inputTape.movePointerRight()}

        const curSymbol: string= MachineVariables.inputTape.getPointerSymbol();
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
        else {throw Error("Writing to invalid memory object")}

        transitionArr.forEach((transition)=>{
            if(readSymbol == transition.symbol){
                destStates.push(transition.dest)
            }
        })
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
        let curSymbol: string;

        if(this.getType() == StateTypes.r){
            console.log("MOVE RIGHT TAPE")
            console.log(Tapes[this.memoryObject])
            if(this.memoryObject in Tapes){
                Tapes[this.memoryObject].movePointerRight();
                curSymbol = Tapes[this.memoryObject].getPointerSymbol();
            }
            else if(this.memoryObject in Tapes_2D){
                Tapes_2D[this.memoryObject].movePointerRight();
                curSymbol = Tapes_2D[this.memoryObject].getPointerSymbol();
            }
        }
        else if(this.getType() == StateTypes.l){
            console.log("MOVE LEFT TAPE")
            console.log(Tapes[this.memoryObject])
            if(this.memoryObject in Tapes){
                Tapes[this.memoryObject].movePointerLeft();
                curSymbol = Tapes[this.memoryObject].getPointerSymbol();
            }
            else if(this.memoryObject in Tapes_2D){
                Tapes_2D[this.memoryObject].movePointerLeft();
                curSymbol = Tapes_2D[this.memoryObject].getPointerSymbol();
            }
        }
        else if(this.getType() == StateTypes.u){
            Tapes_2D[this.memoryObject].movePointerUp();
            curSymbol = Tapes_2D[this.memoryObject].getPointerSymbol();
        }
        else if(this.getType() == StateTypes.d){
            Tapes_2D[this.memoryObject].movePointerDown();
            curSymbol = Tapes_2D[this.memoryObject].getPointerSymbol();
        }

        transitionArr.forEach((transition)=>{
            if(transition.symbol == curSymbol){
                if(transition.replacementSymbol !== undefined){
                    if(this.memoryObject in Tapes){
                        Tapes[this.memoryObject].replace(transition.replacementSymbol);
                    }
                    else if(this.memoryObject in Tapes_2D){
                        Tapes_2D[this.memoryObject].replace(transition.replacementSymbol);
                    }
                }
                destStates.push(transition.dest)
            }
        })
        return destStates
    }
}

export class AcceptState extends State{
    public constructor(){
        super("accept", StateTypes.accept);
        this.setLabel("accept")
    }
    public step(): string[]{
        if(MachineVariables.hasAccept && !MachineVariables.end && !MachineVariables.accept){
            MachineVariables.accept = true;
            MachineVariables.end = true;
        }
        return [];
    }
}

export class RejectState extends State{
    public constructor(){
        super("reject", StateTypes.reject);
        this.setLabel("reject")
    }
    public step(): string[]{
        if(MachineVariables.hasReject && !MachineVariables.end && !MachineVariables.reject){
            MachineVariables.reject = true;
            MachineVariables.end = true;
        }
        return [];
    }
}