import './App.css'

function App() {

  return (
    <>
      <div className="card">
        <p>Machine Definition</p>
        <textarea id="machine-textarea" cols={48} rows={12} wrap='hard'></textarea>
      </div>
      <div className="card">
        <p>Input String</p>
        <input></input>
      </div>
      <div className="card">
        <button>
          Run
        </button>
      </div>
    </>
  )
}

export default App
