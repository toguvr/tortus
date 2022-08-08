import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [possibles, setPossibles] = useState(
    Array.from({ length: 49 }, (_, index) => index + 1)
  );
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div className="tabuleiro">
          {possibles.map((possible) => (
            <div className="casa">{possible}</div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
