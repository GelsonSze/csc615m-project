import './App.css'
import {Queues, Stacks, Tapes , States, clearGlobals, Nodes, Edges, Node, Edge, MachineVariables, Tapes_2D} from './globals';
import {Queue} from './Queue'
import {Stack} from './Stack'
import {Tape, Tape_2D} from './Tape'
import {WriteState, MoveState, StateTypes, PrintState, ScanState, ReadState} from './State';
import DirectedGraph from './DirectedGraph';
import React, { useState } from 'react';

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [startState, setStartState] = useState<string>("");
  const [currentState, setCurrentState] = useState<string>("");
  const [drawGraph, setDrawGraph] = useState<boolean>(false);
  const [inputStringArr, setInputString] = useState<string[]>([]);
  const [inputStringIndex, setInputIndex] = useState<number>(0);
  const [runButtonDisabled, setRunButtonDisabled] = useState<boolean>(true);
  const [stepButtonDisabled, setStepButtonDisabled] = useState<boolean>(true);
  const [steps, setSteps] = useState<number>(0);
  const [hasStacks, showStacks] = useState<boolean>(false);
  const [stacks, setStacks] = useState<{[name: string]: Stack}>({});
  const [hasQueues, showQueues] = useState<boolean>(false);
  const [queues, setQueues] = useState<{[name: string]: Queue}>({});
  const [hasTapes, showTapes] = useState<boolean>(false);
  const [tapes, setTapes] = useState<{[name: string]: Tape}>({});
  const [has2DTapes, show2DTapes] = useState <boolean>(false);
  const [tapes_2D, setTapes2D] = useState<{[name: string]: Tape_2D}>({});

  

  function parseMachine(): void{
    //Clear dictionaries
    clearGlobals();
    //Reset memory visuals
    showStacks(false);
    showQueues(false);
    showTapes(false);
    show2DTapes(false);

    const textArea = document.getElementById("machine-textarea") as HTMLTextAreaElement;
    const text: string = textArea.value.trim()
    const splitText: string[] = text.split(/^(.DATA|.LOGIC)$/gm).filter(i=>i) //split input text via .DATA and .LOGIC and removes empty elements
    const input = document.getElementById("machine-input") as HTMLInputElement;
    const inputString = input.value.trim()

    const memoryBlock = text.includes(".DATA")? splitText[1] : "";
    const logicBlock = text.includes(".DATA")? splitText[3] : splitText[1];
    console.log(`memory block ${memoryBlock}\nlogic block ${logicBlock}`)
    
    parseMemoryBlock(memoryBlock);
    parseLogicBlock(logicBlock);
    generateMachineDiagram();
    console.log("MEMORY AND STATES BEFORE RUN MACHINE");
    console.log("STACKS");
    console.log(Stacks);
    console.log("QUEUES");
    console.log(Queues);
    console.log("TAPES");
    console.log(Tapes);
    console.log("2D TAPES");
    console.log(Tapes_2D);
    console.log("STATES");
    console.log(States);
    //Setup before running machine
    MachineVariables.currentState = MachineVariables.startState
    MachineVariables.inputTape.pushString(inputString);
    MachineVariables.inputTape.printItems();
    setRunButtonDisabled(false);
    setStepButtonDisabled(false);
    setSteps(0);
    setInputString(MachineVariables.inputTape.getItems());
    setInputIndex(0);
    setStacks(Stacks);
    setQueues(Queues);
    setTapes(Tapes);
    setTapes2D(Tapes_2D);
  }

  function parseMemoryBlock(memoryBlock: string): void{
    if(memoryBlock.length == 0){return;}
    const codeLines = memoryBlock.trim().split("\n")
    codeLines.forEach((line)=>{
      const tokens = line.split(" ")

      if(tokens){
        switch(tokens[0]){
          case "STACK": {
            Stacks[tokens[1]] = new Stack(tokens[1])
            showStacks(true);
            break;
          }
          case "QUEUE":{
            Queues[tokens[1]] = new Queue(tokens[1])
            showQueues(true);
            break;
          }
          case "TAPE":{
            Tapes[tokens[1]] = new Tape(tokens[1])
            console.log("LOGGING TAPE")
            console.log(Object.keys(Tapes).length)
            showTapes(true);
            if(Object.keys(Tapes).length == 1){
              MachineVariables.inputTape = Tapes[tokens[1]]
              console.log(MachineVariables.inputTape)
            }
            break;
          }
          case "2D_TAPE":{
            Tapes_2D[tokens[1]] = new Tape_2D(tokens[1])
            console.log("LOGGING 2D TAPE")
            console.log(Object.keys(Tapes_2D).length)
            show2DTapes(true);
            if(Object.keys(Tapes_2D).length == 1){
              MachineVariables.inputTape = Tapes_2D[tokens[1]].getItemRow();
              console.log(MachineVariables.inputTape)
            }
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
      if(Object.keys(States).length > 0 && MachineVariables.startState == ""){
        MachineVariables.startState = stateName; 
        console.log(`set start state: ${MachineVariables.startState}`)
      }
      
      console.log(`states: ${Object.keys(States)}`)
      console.log(`start state ${MachineVariables.startState}`)
    })
  }

  function generateMachineDiagram(): void{
      for(const key in States){
        Nodes.push({id: States[key].getName(), label: States[key].getLabel(), position:{x:0,y:0} })
        States[key].getTransitions().forEach((transition)=>{
          const index = Edges.findIndex(edge => edge.source == States[key].getName() && edge.target == transition.dest)
          const transitionLabel = transition.symbol.concat((transition.replacementSymbol !== undefined && transition.replacementSymbol != transition.symbol)? `/${transition.replacementSymbol}` : ``);
          if(index == -1){
            Edges.push({source: States[key].getName(), target: transition.dest, label: transitionLabel})
          }
          else{
            Edges[index].label = Edges[index].label+= `, ${transitionLabel}`
          }
        })
      }
      console.log("CHECK NODES AND EDGES OF JOINTJS")
      console.log(Nodes);
      console.log(Edges);
      setDrawGraph(true);
  }

  function runMachine(){
    setStepButtonDisabled(true);
    console.log("RUN MACHINE")
    let nextStates: string[] = [];
    console.log("MACHINE VARIABLES BEFORE RUN")
    console.log(MachineVariables)
    while(!MachineVariables.end){
      console.log("LOOP DELIMITER")
      console.log(`current state: ${MachineVariables.currentState}`)
      nextStates = States[MachineVariables.currentState].step();
      if(nextStates.length == 0){
        MachineVariables.end = true;
        console.log("MACHINE VAR END TRUE")
      }
      MachineVariables.currentState = nextStates[0];
      setInputIndex(MachineVariables.inputTape.getPointer());
      setStacks(Stacks);
      setQueues(Queues);
      setTapes(Tapes);
      setTapes2D(Tapes_2D);
      console.log(`state after step: ${nextStates}`)
      console.log(`pointer: ${MachineVariables.inputTape.getPointer()}`)
      console.log(`pointer symbol: ${MachineVariables.inputTape.getPointerSymbol()}`)
      console.log("--------------------------------")
    }
    if(MachineVariables.end){
      setRunButtonDisabled(true);
      if(MachineVariables.hasAccept || MachineVariables.hasReject){
        if(MachineVariables.accept == false){
          MachineVariables.reject = true;
          console.log("MACHINE VAR REJECT TRUE")
        }
      }
      console.log("MACHINE VARIABLES AFTER RUN")
      console.log(MachineVariables)
      console.log("STACKS AND STATES AFTER RUN MACHINE")
      console.log("STACKS")
      console.log(Stacks)
      console.log("QUEUES")
      console.log(Queues)
      console.log("TAPES")
      console.log(Tapes_2D)
      console.log("STATES")
      console.log(States)
    }
  }

  function handleSteps(){
    setRunButtonDisabled(true);
    let nextStates: string[] = [];
    if(!MachineVariables.end){
      console.log("LOOP DELIMITER")
      console.log(`current state: ${MachineVariables.currentState}`)
      nextStates = States[MachineVariables.currentState].step();
      if(nextStates.length == 0){
        MachineVariables.end = true;
        console.log("MACHINE VAR END TRUE")
      }
      MachineVariables.currentState = nextStates[0];
      setInputIndex(MachineVariables.inputTape.getPointer());
      setSteps(steps + 1);
      setStacks(Stacks);
      setQueues(Queues);
      setTapes(Tapes);
      setTapes2D(Tapes_2D);
      console.log(`state after step: ${nextStates}`)
      console.log(`pointer: ${MachineVariables.inputTape.getPointer()}`)
      console.log(`pointer symbol: ${MachineVariables.inputTape.getPointerSymbol()}`)
      console.log("--------------------------------")
    }
    if(MachineVariables.end){
      setStepButtonDisabled(true);
      if(MachineVariables.hasAccept || MachineVariables.hasReject){
        if(MachineVariables.accept == false){
          MachineVariables.reject = true;
          console.log("MACHINE VAR REJECT TRUE")
        }
      }
      console.log("MACHINE VARIABLES AFTER RUN")
      console.log(MachineVariables)
      console.log("STACKS AND STATES AFTER RUN MACHINE")
      console.log("STACKS")
      console.log(Stacks)
      console.log("QUEUES")
      console.log(Queues)
      console.log("TAPES")
      console.log(Tapes_2D)
      console.log("STATES")
      console.log(States)
    }
  }

  function updateGraph(){
    setNodes(Nodes);
    setEdges(Edges);
    setStartState(MachineVariables.startState);
    setCurrentState(MachineVariables.currentState);
  }

  function reset(){
    setDrawGraph(false);
    clearGlobals();
    (document.getElementById("machine-textarea") as HTMLTextAreaElement).value = "";
    (document.getElementById("machine-input") as HTMLInputElement).value = "";
    setRunButtonDisabled(true);
    setStepButtonDisabled(true);
  }

  return (
    <>
      <div className="card">
        <p>Machine Definition</p>
        <textarea id="machine-textarea" cols={48} rows={24}></textarea>
      </div>
      <div className="card">
        <p>Input String</p>
        <input id="machine-input"></input>
      </div>
      <div className="card">
        <button id="load-button" onClick={function(){parseMachine(); updateGraph()}}>
          Load
        </button>
        <button id="run-button" onClick={function(){runMachine(); updateGraph()}} disabled={runButtonDisabled}>
          Run
        </button>
        <button id="step-button" onClick={function(){handleSteps(); updateGraph()}} disabled={stepButtonDisabled}>
          Step
        </button>
        <button id="reset-button" onClick={function(){reset()}}>
          Reset
        </button>
      </div>
      {drawGraph &&
        <div className="card">
          <div className='subcard-container'>
            {hasStacks &&
              <div className='subcard'>
                <h3 className='subcard-title'>Stacks</h3>
                <p className='subcard-text'>
                  {Object.entries(stacks).map(([key, value])=>
                    <React.Fragment>
                      {`${key} : ${value.getItems()}`}
                      <br/>
                    </React.Fragment>
                  )}
                </p>
              </div>
            }
            {hasQueues &&
              <div className='subcard'>
                <h3 className='subcard-title'>Queues</h3>
                <p className='subcard-text'>
                  {Object.entries(queues).map(([key, value])=>
                    <React.Fragment>
                      {`${key} : ${value.getItems()}`}
                      <br/>
                    </React.Fragment>
                  )}
                </p>
              </div>
            }
            {hasTapes &&
              <div className='subcard'>
                <h3 className='subcard-title'>Tapes</h3>
                <p className='subcard-text'>
                  {Object.entries(tapes).map(([key, value])=>
                    <React.Fragment>
                      {`${key} : ${value.getItems()}`}
                      <br/>
                    </React.Fragment>
                  )}
                </p>
              </div>
            }
            {has2DTapes &&
              <div className='subcard'>
                <h3 className='subcard-title'>2D Tapes</h3>
                <p className='subcard-text'>
                  {Object.entries(tapes_2D).map(([key, value])=>
                    <React.Fragment key={key}>
                        {`${key} : `}<br/>{value.getItems().split("<br/>").filter(i=>i).map((line)=>(
                        <React.Fragment>
                            {line}<br />
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  )}
                </p>
              </div>
            }
          </div>
          <div className='subcard-container'>
            <div className="input-tape-card">
              <h3 className='subcard-title'>Output</h3>
              <p className='subcard-text'>
                {MachineVariables.output? MachineVariables.output : "Empty"}
              </p>
            </div>
            <div className="input-tape-card">
              <h3 className='subcard-title'>Input</h3>
              <p className='subcard-text'>
                {inputStringArr.slice(0,inputStringIndex)}<mark>{inputStringArr[inputStringIndex]}</mark>{inputStringArr.slice(inputStringIndex+1, inputStringArr.length)}
              </p>
            </div>
            <div className="input-tape-card">
              <h3 className='subcard-title'>Status</h3>
              <p className='subcard-text'>
                {MachineVariables.accept? "Accepted": MachineVariables.reject? "Rejected": MachineVariables.end? "Ended": "Ongoing"}
              </p>
            </div>
          </div>
          <DirectedGraph nodes={nodes} edges={edges} startState={startState} currentState={currentState}/>
        </div>
      }
    </>
  )
}

export default App
