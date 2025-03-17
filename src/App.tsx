import './App.css'
import { Queues, Stacks } from './globals';
import {Queue} from './Queue'
import {Stack} from './Stack'
import {Tape} from './Tape'

function App() {

  function parseMachine(): void{
    const textArea = document.getElementById("machine-textarea") as HTMLTextAreaElement;
    const text: string = textArea.value.trim()
    const splitText: string[] = text.split(/^(.DATA|.LOGIC)$/gm).filter(i=>i) //split input text via .DATA and .LOGIC and removes empty elements

    splitText.forEach((text)=>{console.log(text)})
    const memoryBlock = splitText[1]
    const logicBlock = splitText[3]
    console.log(`memory block ${memoryBlock}\n logic block ${logicBlock}`)

    parseMemoryBlock(memoryBlock)
    parseLogicBlock(logicBlock)
    console.log(Stacks)
  }

  function parseMemoryBlock(memoryBlock: string): void{
    const codeLines = memoryBlock.trim().split("\n")
    codeLines.forEach((line)=>{
      const tokens = line.split(" ")
      console.log(tokens)
    })
  }

  function parseLogicBlock(logicBlock: string): void{
    const codeLines = logicBlock.trim().split("\n")
    codeLines.forEach((line)=>{
      const tokens = line.split(" ")
      console.log(tokens)
      if(tokens){
        switch(tokens[0]){
          case "STACK": {
            Stacks[tokens[1]] = new Stack(tokens[1]);
            break;
          }
          case "QUEUE":{
            Queues[tokens[1]] = new Queue(tokens[1])
            break;
          }
          case "TAPE":{
            break;
          }
        }
      }
    })
  }

  return (
    <>
      <div className="card">
        <p>Machine Definition</p>
        <textarea id="machine-textarea" cols={64} rows={36}></textarea>
      </div>
      <div className="card">
        <p>Input String</p>
        <input></input>
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
