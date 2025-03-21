import './App.css'
import { Queues, Stacks, Tapes , States, InputTape} from './globals';
import {Queue} from './Queue'
import {Stack} from './Stack'
import {Tape} from './Tape'
import {WriteState, MoveState, StateTypes, PrintState, ScanState, ReadState, State} from './State';

function App() {

  function parseMachine(): void{
    const textArea = document.getElementById("machine-textarea") as HTMLTextAreaElement;
    const text: string = textArea.value.trim()
    const splitText: string[] = text.split(/^(.DATA|.LOGIC)$/gm).filter(i=>i) //split input text via .DATA and .LOGIC and removes empty elements
    const input = document.getElementById("machine-input") as HTMLInputElement;
    const inputText: string = input.value.trim()

    const memoryBlock = splitText[1]
    const logicBlock = splitText[3]
    console.log(`memory block ${memoryBlock}\n logic block ${logicBlock}`)
    
    parseMemoryBlock(memoryBlock)
    parseLogicBlock(logicBlock)
    console.log(Stacks)
    console.log(States)

    runMachine(inputText)
  }

  function parseMemoryBlock(memoryBlock: string): void{
    const codeLines = memoryBlock.trim().split("\n")
    codeLines.forEach((line)=>{
      const tokens = line.split(" ")

      if(tokens){
        switch(tokens[0]){
          case "STACK": {
            Stacks[tokens[1]] = new Stack(tokens[1])
            break;
          }
          case "QUEUE":{
            Queues[tokens[1]] = new Queue(tokens[1])
            break;
          }
          case "TAPE":{
            Tapes[tokens[1]] = new Tape(tokens[1])
            break;
          }
          case "2D_TAPE":{
            break;
          }
        }
      }
    })
  }

  function parseLogicBlock(logicBlock: string): void{
    const codeLines = logicBlock.trim().split("\n")
    codeLines.forEach((line)=>{
      let stateType: StateTypes;
      let stateName: string;
      let tokens: string[];

      if(line.includes(StateTypes.w)){stateType = StateTypes.w}
      else if(line.includes(StateTypes.p)){stateType = StateTypes.p}
      else if(line.includes(StateTypes.sl)){stateType = StateTypes.sl}
      else if(line.includes(StateTypes.sr)){stateType = StateTypes.sr}
      else if(line.includes(StateTypes.s)){stateType = StateTypes.s}
      else if(line.includes(StateTypes.rd)){stateType = StateTypes.rd}
      else if(line.includes(StateTypes.r)){stateType = StateTypes.r}
      else if(line.includes(StateTypes.l)){stateType = StateTypes.l}
      else if(line.includes(StateTypes.u)){stateType = StateTypes.u}
      else if(line.includes(StateTypes.d)){stateType = StateTypes.d}
      else if(line.includes(StateTypes.accept)){stateType = StateTypes.accept} //dunno if required
      else {stateType = StateTypes.reject}

      if(stateType === StateTypes.p ||
        stateType === StateTypes.sr ||
        stateType === StateTypes.sl ||
        stateType === StateTypes.s){
        
        tokens = line.replace(/\),|[()]/gm, " ").split(" ").filter(i=>i);
        // tokens.forEach((token)=>{console.log(`token: ${token}`)})
        stateName = tokens[0].split("]")[0]
        tokens.splice(0,2);
        if(stateType === StateTypes.p){
          States[stateName] = new PrintState(stateName, stateType)
        } 
        else{
          States[stateName] = new ScanState(stateName, stateType)
          if(stateType !== StateTypes.s)
            tokens.splice(0,1);
        }
        tokens.forEach((token)=>{
          const splitTokens: string[]= token.split(",")
          // console.log(`split tokens ${splitTokens[0]} --- ${splitTokens[1]}`)
          States[stateName].addTransition(splitTokens[0],splitTokens[1])
        })
        States[stateName].printTransitions();
      }
      else{
        tokens = line.replace(/\),|[()]/gm, " ").split(" ").filter(i=>i);
        stateName = tokens[0].split("]")[0] 
        console.log(tokens);
        tokens.splice(0,2);

        if(stateType === StateTypes.w){
          States[stateName] = new WriteState(stateName, stateType);
          (States[stateName] as WriteState).setMemoryObject(tokens[0]);
          tokens.splice(0,1);
          tokens.forEach((token)=>{
            const splitTokens: string[]= token.split(",")
            States[stateName].addTransition(splitTokens[0],splitTokens[1])
          })
        }
        else if(stateType == StateTypes.rd){
          States[stateName] = new ReadState(stateName, stateType);
          (States[stateName] as ReadState).setMemoryObject(tokens[0]);
          tokens.splice(0,1);
          tokens.forEach((token)=>{
            const splitTokens: string[]= token.split(",")
            States[stateName].addTransition(splitTokens[0],splitTokens[1])
          })
        }
        else{
          States[stateName] = new MoveState(stateName, stateType);
          (States[stateName] as MoveState).setMemoryObject(tokens[0]);
          tokens.splice(0,1);
          tokens.forEach((token)=>{
            const splitTokens: string[]= token.split(",");
            const symbolTokens: string[]= splitTokens[0].split("/");
            States[stateName].addTransition(symbolTokens[0], splitTokens[1], symbolTokens[1])
          })
        }
        States[stateName].printTransitions();
      }
    })
  }

  function runMachine(input: string){
    
  }

  return (
    <>
      <div className="card">
        <p>Machine Definition</p>
        <textarea id="machine-textarea" cols={64} rows={36}></textarea>
      </div>
      <div className="card">
        <p>Input String</p>
        <input id="machine-input"></input>
      </div>
      <div className="card">
        <button onClick={parseMachine}>
          Run
        </button>
      </div>
    </>
  )
}

export default App
