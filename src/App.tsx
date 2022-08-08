import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { v4 as uuid } from "uuid";
import { isShorthandPropertyAssignment } from "typescript";
interface IOption {
  id: string;
  type: string;
  rotate: number;
  tapped: boolean;
}
function App() {
  const [possibles, setPossibles] = useState([] as IOption[]);
  const [handPlayerOne, setHandPlayerOne] = useState([] as IOption[]);
  const [handPlayerTwo, setHandPlayerTwo] = useState([] as IOption[]);
  // Array.from({ length: 49 }, (_, index) => index + 1)

  const options = [
    { type: "Y", quantity: 2 },
    { type: "l", quantity: 3 },
    { type: "<", quantity: 9 },
    { type: "<<", quantity: 6 },
    { type: "<<<", quantity: 3 },
    { type: "cavalo", quantity: 3 },
    { type: "diagonal duplo sentido", quantity: 1 },
    { type: "y", quantity: 1 },
    { type: "buraco", quantity: 7 },
    { type: "seta diagonal", quantity: 2 },
    { type: "seta duplo sentido", quantity: 2 },
    { type: "T", quantity: 2 },
    { type: "V", quantity: 1 },
    { type: "estrela", quantity: 4 },
    { type: "x", quantity: 1 },
    { type: "buraco fim", quantity: 1 },
    { type: "diagonal limite", quantity: 1 },
    { type: "+", quantity: 2 },
    { type: "diagonal dupla", quantity: 1 },
    { type: "diagonal tripla", quantity: 1 },
    { type: "estrela diagonal", quantity: 1 },
    { type: "seta duplo sentido limite", quantity: 1 },
  ];

  const rotateOptions = [0, 90, 180, 270];

  function sortear(arr: any[]) {
    const numero = Math.floor(Math.random() * arr.length);
    return arr[numero];
  }

  function embaralhar(cartasParaEmbaralhar: any[]) {
    for (
      var j, x, i = cartasParaEmbaralhar.length;
      i;
      j = Math.floor(Math.random() * i),
        x = cartasParaEmbaralhar[--i],
        cartasParaEmbaralhar[i] = cartasParaEmbaralhar[j],
        cartasParaEmbaralhar[j] = x
    );
    return cartasParaEmbaralhar;
  }

  function comprar(baralhoAtual: IOption[], qtd: number) {
    return baralhoAtual.splice(0, qtd);
  }

  function generateFloors() {
    const finalOptions = [] as IOption[];
    options.forEach((option) => {
      for (let i = 0; i < option.quantity; i++) {
        finalOptions.push({
          id: uuid(),
          type: option.type,
          rotate: sortear(rotateOptions),
          tapped: true,
        });
      }
    });
    let embaralhado = embaralhar(finalOptions);

    const compras = comprar(embaralhado, 6);

    setHandPlayerOne([compras[0], compras[1], compras[2]]);
    setHandPlayerTwo([compras[3], compras[4], compras[5]]);

    const startDesvirado = [3, 10, 17, 21, 22, 23, 24, 25, 26, 27, 31, 38, 45];

    embaralhado.map((item, index) => {
      if (startDesvirado.includes(index)) {
        item.tapped = false;
      }
    });

    setPossibles(embaralhado);
  }

  useEffect(() => {
    generateFloors();
  }, []);

  useEffect(() => {
    if (
      handPlayerOne.some(
        (item) => item.type === "buraco" || item.type === "buraco fim"
      ) ||
      handPlayerTwo.some(
        (item) => item.type === "buraco" || item.type === "buraco fim"
      )
    ) {
      generateFloors();
    }
  }, [handPlayerOne, handPlayerTwo]);

  return (
    <div className="App">
      <button onClick={generateFloors}>Reset</button>
      <header className="App-header">
        <p>Jogador 1</p>
        {handPlayerOne.map((possible) => (
          <div key={possible.id}>
            <div>{possible.type}</div>
            <div>{possible.rotate}</div>
          </div>
        ))}
      </header>

      <div className="tabuleiro">
        {possibles.map((possible) => (
          <div key={possible.id} className="casa">
            <div>{possible.type}</div>
            <div>{possible.rotate}</div>
            <div>{possible.tapped ? "virado" : "desvirado"}</div>
          </div>
        ))}
      </div>
      <header className="App-header">
        <p>Jogador 2</p>
        {handPlayerTwo.map((possible) => (
          <div key={possible.id}>
            <div>{possible.type}</div>
            <div>{possible.rotate}</div>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
