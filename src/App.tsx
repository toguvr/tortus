import React, { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";
import { Floor, Timer } from "./styles";
import Tapped from "./assets/virado.png";
import Plus from "./assets/+.png";
import Yellow from "./assets/amarelo.png";
import FinishRole from "./assets/buraco-fim-azul.png";
import Role from "./assets/buraco.png";
import Horse from "./assets/cavalo.png";
import StarDiagonal from "./assets/estrela-diagonal.png";
import Star from "./assets/estrela.png";
import L from "./assets/L.png";
import ArrowDiaognalLimit from "./assets/seta-diagonal-limite.png";
import ArrowDiaognal from "./assets/seta-diagonal.png";
import ArrowDoubleDiaognal from "./assets/seta-dupla-diagonal.png";
import ArrowDouble from "./assets/seta-dupla.png";
import ArrowDoubleDirectionDiagonal from "./assets/seta-duplo-sentido-diagonal.png";
import ArrowDoubleDirection from "./assets/seta-duplo-sentido.png";
import ArrowLimit from "./assets/seta-limite.png";
import Arrow from "./assets/seta-simples.png";
import ArrowTriple from "./assets/seta-tripla.png";
import ArrowTripleDiaognal from "./assets/seta-tripla-diagonal.png";
import T from "./assets/T.png";
import V from "./assets/v.png";
import Red from "./assets/vermelho.png";
import X from "./assets/x.png";
import YSecond from "./assets/y.png";
import YFirst from "./assets/Y.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTimer } from "react-timer-hook";
import { type } from "@testing-library/user-event/dist/type";
interface IOption {
  id: string;
  type: string;
  rotate: number;
  tapped: boolean;
  yellow: boolean;
  red: boolean;
}

function App() {
  const [possibles, setPossibles] = useState([] as IOption[]);
  const [handPlayerOne, setHandPlayerOne] = useState([] as IOption[]);
  const [handPlayerTwo, setHandPlayerTwo] = useState([] as IOption[]);
  const [floorSelected, setFloorSelected] = useState({} as IOption);
  const [floorToMoveSelected, setFloorToMoveSelected] = useState({} as IOption);
  const [handPlayerOneSelected, setHandPlayerOneSelected] = useState(
    {} as IOption
  );
  const [handPlayerTwoSelected, setHandPlayerTwoSelected] = useState(
    {} as IOption
  );

  const [moving, setMoving] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [timerPlayerOneOver, setTimerPlayerOneOver] = useState(false);
  const [timerPlayerTwoOver, setTimerPlayerTwoOver] = useState(false);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  const { seconds, minutes, start, resume, pause, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => setTimerPlayerOneOver(true),
    autoStart: false,
  });
  const {
    seconds: secondsTwo,
    minutes: minutesTwo,
    start: startTwo,
    resume: resumeTwo,
    pause: pauseTwo,
    restart: restartTwo,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => setTimerPlayerTwoOver(true),
    autoStart: false,
  });
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
          yellow: false,
          red: false,
        });
      }
    });
    let embaralhado = embaralhar(finalOptions);

    const compras = comprar(embaralhado, 6);

    for (let compra of compras) {
      compra.tapped = false;
    }

    setHandPlayerOne([compras[0], compras[1], compras[2]]);
    setHandPlayerTwo([compras[3], compras[4], compras[5]]);

    const startDesvirado = [3, 10, 17, 21, 22, 23, 24, 25, 26, 27, 31, 38, 45];

    embaralhado.map((item, index) => {
      if (startDesvirado.includes(index)) {
        item.tapped = false;
      }
    });
    embaralhado[0].yellow = true;
    embaralhado[1].yellow = true;
    embaralhado[47].red = true;
    embaralhado[48].red = true;
    const time = new Date();
    time.setSeconds(time.getSeconds() + 300);
    setPossibles(embaralhado);
    setPlayerTurn(0);
    setTimerPlayerOneOver(false);
    setTimerPlayerTwoOver(false);
    restart(time, false);
    restartTwo(time, false);
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

  function onFloorClick(
    item: IOption,
    state: IOption,
    setState: React.Dispatch<React.SetStateAction<IOption>>,
    hand: boolean
  ) {
    if (!moving) {
      if (item.red || item.yellow) {
        setState(item);
        return tunMoving();
      } else {
        return setState(item);
      }
    }
    return setFloorToMoveSelected(item);
  }

  function turnFloor() {
    const newPossibles = [...possibles];
    const itemIndex = newPossibles.findIndex(
      (possible) => possible.id === floorSelected.id
    );
    if (!newPossibles[itemIndex]) {
      return toast.error("Nenhum piso selecionado");
    }

    newPossibles[itemIndex].tapped = !newPossibles[itemIndex].tapped;
    return setPossibles(newPossibles);
  }

  function rotateFloor(qty: number) {
    const newPossibles = [...possibles];
    const itemIndex = newPossibles.findIndex(
      (possible) => possible.id === floorSelected.id
    );
    if (!newPossibles[itemIndex]) {
      return toast.error("Nenhum piso selecionado");
    }
    if (newPossibles[itemIndex].tapped) {
      return toast.error("Não pode rodar um piso virado");
    }

    newPossibles[itemIndex]!.rotate += qty;

    return setPossibles(newPossibles);
  }

  function trade() {
    const handToSee =
      playerTurn === 1 ? handPlayerOneSelected : handPlayerTwoSelected;
    if (!floorSelected.id) {
      return toast.error("Nenhum piso selecionado");
    }

    if (!handToSee.id) {
      return toast.error("Nenhum piso na mão selecionado");
    }

    const newPossibles = [...possibles];
    const itemFloorIndex = newPossibles.findIndex(
      (possible) => possible.id === floorSelected.id
    );

    if (!newPossibles[itemFloorIndex]) {
      return toast.error("Nenhum piso encontrado");
    }
    if (newPossibles[itemFloorIndex].tapped) {
      return toast.error("Não pode trocar por um piso virado");
    }

    const handArr = playerTurn === 1 ? handPlayerOne : handPlayerTwo;
    const handPossibles = [...handArr];
    const itemHandIndex = handPossibles.findIndex(
      (possible) => possible.id === handToSee.id
    );

    if (!handArr[itemHandIndex]) {
      return toast.error("Nenhum piso na mão encontrado");
    }

    const currentOnHand = handArr[itemHandIndex];
    const currentOnFloor = newPossibles[itemFloorIndex];

    if (currentOnFloor.tapped === true) {
      return toast.error("Pisos virados não podem ser trocados");
    }

    if (currentOnFloor.red) {
      currentOnHand.red = true;
    } else {
      currentOnHand.red = false;
    }
    if (currentOnFloor.yellow) {
      currentOnHand.yellow = true;
    } else {
      currentOnHand.yellow = false;
    }

    newPossibles[itemFloorIndex] = currentOnHand;
    handArr[itemHandIndex] = currentOnFloor;

    const setHand = playerTurn === 1 ? setHandPlayerOne : setHandPlayerTwo;
    setPossibles(newPossibles);
    setHand(handArr);
    const setHandSelected =
      playerTurn === 1 ? setHandPlayerOneSelected : setHandPlayerTwoSelected;

    setFloorSelected({} as IOption);
    setHandSelected({} as IOption);
  }

  function move() {
    if (!floorSelected.id) {
      return;
    }

    if (!floorToMoveSelected.id) {
      return;
    }

    const newPossibles = [...possibles];
    const itemFloorIndex = newPossibles.findIndex(
      (possible) => possible.id === floorSelected.id
    );

    if (!newPossibles[itemFloorIndex]) {
      return toast.error("Nenhum piso encontrado");
    }

    const itemHandIndex = newPossibles.findIndex(
      (possible) => possible.id === floorToMoveSelected.id
    );

    if (!newPossibles[itemHandIndex]) {
      return toast.error("Nenhum piso encontrado");
    }

    if (newPossibles[itemFloorIndex].yellow) {
      newPossibles[itemFloorIndex].yellow = false;
      newPossibles[itemHandIndex].yellow = true;
    } else if (newPossibles[itemFloorIndex].red) {
      newPossibles[itemFloorIndex].red = false;
      newPossibles[itemHandIndex].red = true;
    }

    setPossibles(newPossibles);

    setFloorSelected({} as IOption);
    setFloorToMoveSelected({} as IOption);
    setMoving(false);
  }

  useEffect(() => {
    move();
  }, [floorToMoveSelected]);

  function getImage(type: string) {
    switch (type) {
      case "tapped":
        return Tapped;
      case "+":
        return Plus;
      case "buraco fim":
        return FinishRole;
      case "buraco":
        return Role;
      case "y":
        return YSecond;
      case "Y":
        return YFirst;
      case "seta diagonal":
        return ArrowDiaognal;
      case "estrela diagonal":
        return StarDiagonal;
      case "cavalo":
        return Horse;
      case "estrela":
        return Star;
      case "l":
        return L;
      case "diagonal limite":
        return ArrowDiaognalLimit;
      case "<<":
        return ArrowDouble;
      case "diagonal duplo sentido":
        return ArrowDoubleDirectionDiagonal;
      case "seta duplo sentido":
        return ArrowDoubleDirection;
      case "seta duplo sentido limite":
        return ArrowLimit;
      case "<":
        return Arrow;
      case "<<<":
        return ArrowTriple;
      case "diagonal tripla":
        return ArrowTripleDiaognal;
      case "T":
        return T;
      case "V":
        return V;
      case "x":
        return X;
      case "diagonal dupla":
        return ArrowDoubleDiaognal;

      default:
        return Yellow;
    }
  }

  function tunMoving() {
    setMoving(!moving);
  }

  function changePlayerTurn(turnToChange: number) {
    if (turnToChange === 2 && playerTurn === 1 && timerPlayerOneOver) {
      return toast.error("Você perdeu, tempo esgotado!");
    }
    if (turnToChange === 1 && playerTurn === 2 && timerPlayerTwoOver) {
      return toast.error("Você perdeu, tempo esgotado!");
    }
    if (playerTurn !== turnToChange) {
      setPlayerTurn(turnToChange);
      if (turnToChange === 2) {
        resumeTwo();
        pause();
      } else {
        resume();
        pauseTwo();
      }
    }
  }

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button className="button" onClick={generateFloors}>
        Reiniciar
      </button>

      <div className="hand">
        <header className="App-header">
          <p>Jogador 1 {moving && playerTurn === 1 && "(movendo...)"}</p>
          <div className="mao">
            {handPlayerOne.map((possible) => (
              <Floor
                selected={handPlayerOneSelected.id === possible.id}
                onClick={() =>
                  onFloorClick(
                    possible,
                    handPlayerOneSelected,
                    setHandPlayerOneSelected,
                    true
                  )
                }
                rotate={possible.rotate}
                key={possible.id}
              >
                <img
                  className="floor"
                  src={getImage(possible.tapped ? "tapped" : possible.type)}
                  alt={possible.type}
                />
              </Floor>
            ))}
          </div>
          {playerTurn === 1 && (
            <div>
              <button className="button" onClick={trade}>
                {"Trocar"}
              </button>
              <button className="button" onClick={turnFloor}>
                Virar
              </button>
              <button className="button" onClick={() => rotateFloor(-90)}>
                {"Rodar <"}
              </button>
              <button className="button" onClick={() => rotateFloor(90)}>
                {"Rodar >"}
              </button>
            </div>
          )}
        </header>
        <Timer
          timeOver={timerPlayerOneOver}
          onClick={() => changePlayerTurn(2)}
          myTurn={playerTurn === 1}
        >
          {minutes + ":" + seconds}
        </Timer>
      </div>
      <div className="espaco">
        <div className="tabuleiro">
          {possibles.map((possible) => (
            <Floor
              selected={floorSelected.id === possible.id}
              selectedMove={floorToMoveSelected.id === possible.id}
              onClick={() =>
                onFloorClick(possible, floorSelected, setFloorSelected, false)
              }
              rotate={possible.rotate}
              key={possible.id}
            >
              <img
                className="floor"
                src={getImage(possible.tapped ? "tapped" : possible.type)}
                alt={possible.type}
              />
              {possible.yellow && (
                <img className="pin" src={Yellow} alt={possible.type} />
              )}
              {possible.red && (
                <img className="pin" src={Red} alt={possible.type} />
              )}
            </Floor>
          ))}
        </div>
      </div>
      <div className="hand">
        <header className="App-header">
          <p>Jogador 2 {moving && playerTurn === 2 && "(movendo...)"}</p>
          <div className="mao">
            {handPlayerTwo.map((possible) => (
              <Floor
                selected={handPlayerTwoSelected.id === possible.id}
                onClick={() =>
                  onFloorClick(
                    possible,
                    handPlayerTwoSelected,
                    setHandPlayerTwoSelected,
                    true
                  )
                }
                rotate={possible.rotate}
                key={possible.id}
              >
                <img
                  className="floor"
                  src={getImage(possible.tapped ? "tapped" : possible.type)}
                  alt={possible.type}
                />
              </Floor>
            ))}
          </div>
          {playerTurn === 2 && (
            <div>
              <button className="button" onClick={trade}>
                {"Trocar"}
              </button>
              <button className="button" onClick={turnFloor}>
                Virar
              </button>
              <button className="button" onClick={() => rotateFloor(-90)}>
                {"Rodar <"}
              </button>
              <button className="button" onClick={() => rotateFloor(90)}>
                {"Rodar >"}
              </button>
            </div>
          )}
        </header>
        <Timer
          timeOver={timerPlayerTwoOver}
          onClick={() => changePlayerTurn(1)}
          myTurn={playerTurn === 2}
        >
          {minutesTwo + ":" + secondsTwo}
        </Timer>
      </div>
    </div>
  );
}

export default App;
