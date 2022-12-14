import React, { useEffect, useState } from "react";
import "../App.css";
import { v4 as uuid } from "uuid";
import { Floor, Timer } from "../styles";
import Tapped from "../assets/virado.png";
import Plus from "../assets/+.png";
import Yellow from "../assets/amarelo.png";
import FinishRole from "../assets/buraco-fim-azul.png";
import Role from "../assets/buraco.png";
import Horse from "../assets/cavalo.png";
import StarDiagonal from "../assets/estrela-diagonal.png";
import Star from "../assets/estrela.png";
import L from "../assets/L.png";
import ArrowDiaognalLimit from "../assets/seta-diagonal-limite.png";
import ArrowDiaognal from "../assets/seta-diagonal.png";
import ArrowDoubleDiaognal from "../assets/seta-dupla-diagonal.png";
import ArrowDouble from "../assets/seta-dupla.png";
import ArrowDoubleDirectionDiagonal from "../assets/seta-duplo-sentido-diagonal.png";
import ArrowDoubleDirection from "../assets/seta-duplo-sentido.png";
import ArrowLimit from "../assets/seta-limite.png";
import Arrow from "../assets/seta-simples.png";
import ArrowTriple from "../assets/seta-tripla.png";
import ArrowTripleDiaognal from "../assets/seta-tripla-diagonal.png";
import T from "../assets/T.png";
import V from "../assets/v.png";
import Red from "../assets/vermelho.png";
import X from "../assets/x.png";
import YSecond from "../assets/yminusculo.png";
import YFirst from "../assets/Y.png";
import { toast } from "react-toastify";
import { useTimer } from "react-timer-hook";
import { routes } from "../routes";
import { useNavigate } from "react-router-dom";

interface IOption {
  id: string;
  type: string;
  rotate: number;
  tapped: boolean;
  pins: IPin[];
}

type IPin = {
  id: string;
  color: "red" | "yellow";
};

function OfflineRoom() {
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
  const navigate = useNavigate();
  const [moving, setMoving] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [timerPlayerOneOver, setTimerPlayerOneOver] = useState(false);
  const [timerPlayerTwoOver, setTimerPlayerTwoOver] = useState(false);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  const { seconds, minutes, resume, pause, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => setTimerPlayerOneOver(true),
    autoStart: false,
  });
  const {
    seconds: secondsTwo,
    minutes: minutesTwo,
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
          pins: [],
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
    embaralhado[0].pins = [{ id: 1, color: "yellow" }];
    embaralhado[1].pins = [{ id: 2, color: "yellow" }];
    embaralhado[47].pins = [{ id: 3, color: "red" }];
    embaralhado[48].pins = [{ id: 4, color: "red" }];
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
    if (hand) {
      return setState(item);
    }
    if (!moving) {
      if (item.pins.length > 0) {
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
    if (newPossibles[itemIndex].pins.length > 0) {
      return toast.error("N??o pode revelar piso com o pino em cima");
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
      return toast.error("N??o pode rodar um piso virado");
    }
    if (newPossibles[itemIndex].pins.length > 0) {
      return toast.error("N??o pode rodar um piso com o pino em cima");
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
      return toast.error("Nenhum piso na m??o selecionado");
    }

    const newPossibles = [...possibles];
    const itemFloorIndex = newPossibles.findIndex(
      (possible) => possible.id === floorSelected.id
    );

    if (!newPossibles[itemFloorIndex]) {
      return toast.error("Nenhum piso encontrado");
    }
    if (newPossibles[itemFloorIndex].tapped) {
      return toast.error("N??o pode trocar por um piso virado");
    }

    const handArr = playerTurn === 1 ? handPlayerOne : handPlayerTwo;
    const handPossibles = [...handArr];
    const itemHandIndex = handPossibles.findIndex(
      (possible) => possible.id === handToSee.id
    );

    if (!handArr[itemHandIndex]) {
      return toast.error("Nenhum piso na m??o encontrado");
    }

    const currentOnHand = handArr[itemHandIndex];
    const currentOnFloor = newPossibles[itemFloorIndex];

    if (currentOnFloor.tapped === true) {
      return toast.error("Pisos virados n??o podem ser trocados");
    }

    const hasRedPin = currentOnFloor.pins.find((pin) => pin.color === "red");
    const hasYellowPin = currentOnFloor.pins.find(
      (pin) => pin.color === "yellow"
    );
    if (hasRedPin?.id) {
      currentOnHand.pins.push(hasRedPin);
    }

    if (hasYellowPin?.id) {
      currentOnHand.pins.push(hasYellowPin);
    }

    if (
      currentOnFloor.type === "buraco" ||
      currentOnFloor.type === "buraco fim"
    ) {
      currentOnHand.tapped = true;
    }

    // if (
    //   currentOnHand.type === "buraco" ||
    //   currentOnHand.type === "buraco fim"
    // ) {
    //   return toast.error("N??o pode colocar o buraco em jogo");
    // }

    newPossibles[itemFloorIndex] = currentOnHand;
    handArr[itemHandIndex] = currentOnFloor;

    const setHand = playerTurn === 1 ? setHandPlayerOne : setHandPlayerTwo;
    setPossibles(newPossibles);
    setHand(handArr);
    const setHandSelected =
      playerTurn === 1 ? setHandPlayerOneSelected : setHandPlayerTwoSelected;

    setFloorSelected({} as IOption);
    setHandSelected({} as IOption);
    setMoving(false);
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
      setFloorSelected({} as IOption);
      setFloorToMoveSelected({} as IOption);
      setMoving(false);
      return toast.error("Nenhum piso selecionado");
    }

    const itemToMoveIndex = newPossibles.findIndex(
      (possible) => possible.id === floorToMoveSelected.id
    );

    if (!newPossibles[itemToMoveIndex]) {
      return toast.error("Nenhum piso para mover encontrado");
    }

    const currentFloor = newPossibles[itemFloorIndex];
    const floorToMove = newPossibles[itemToMoveIndex];

    if (currentFloor.pins.length > 0) {
      floorToMove.pins.push(currentFloor.pins[0]);
      currentFloor.pins.shift();
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
      case "yellow":
        return Yellow;
      case "red":
        return Red;

      default:
        return Yellow;
    }
  }

  function tunMoving() {
    setMoving(!moving);
  }

  function changePlayerTurn(turnToChange: number) {
    if (turnToChange === 2 && playerTurn === 1 && timerPlayerOneOver) {
      return toast.error("Voc?? perdeu, tempo esgotado!");
    }
    if (turnToChange === 1 && playerTurn === 2 && timerPlayerTwoOver) {
      return toast.error("Voc?? perdeu, tempo esgotado!");
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <button className="button" onClick={() => navigate(routes.home)}>
          Sair
        </button>
        <button className="button" onClick={generateFloors}>
          Reiniciar
        </button>
      </div>
      <div className="hand">
        <header className="App-header">
          <p>Jogador 1 </p>
          <div className="mao">
            {handPlayerOne.map((possible) => (
              <Floor
                turn={1}
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
        </header>
        <div>
          {playerTurn === 1 && (
            <div className="grid-button">
              <button className="button-mov" onClick={trade}>
                {"Trocar"}
              </button>
              <button className="button-mov" onClick={turnFloor}>
                Virar
              </button>
              <button className="button-mov" onClick={() => rotateFloor(-90)}>
                {"Rodar <"}
              </button>
              <button className="button-mov" onClick={() => rotateFloor(90)}>
                {"Rodar >"}
              </button>
            </div>
          )}
        </div>
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
              turn={playerTurn}
              rotate={possible.rotate}
              key={possible.id}
            >
              <img
                className="floor"
                src={getImage(possible.tapped ? "tapped" : possible.type)}
                alt={possible.type}
              />
              {possible.pins.map((pin) => (
                <img
                  key={pin.id}
                  className="pin"
                  src={getImage(pin.color)}
                  alt={possible.type}
                />
              ))}
            </Floor>
          ))}
        </div>
      </div>
      <div className="hand">
        <header className="App-header">
          <p>Jogador 2</p>
          <div className="mao">
            {handPlayerTwo.map((possible) => (
              <Floor
                selected={handPlayerTwoSelected.id === possible.id}
                turn={2}
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
        </header>
        <div>
          {playerTurn === 2 && (
            <div className="grid-button">
              <button className="button-mov" onClick={trade}>
                {"Trocar"}
              </button>
              <button className="button-mov" onClick={turnFloor}>
                Virar
              </button>
              <button className="button-mov" onClick={() => rotateFloor(-90)}>
                {"Rodar <"}
              </button>
              <button className="button-mov" onClick={() => rotateFloor(90)}>
                {"Rodar >"}
              </button>
            </div>
          )}
        </div>
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

export default OfflineRoom;
