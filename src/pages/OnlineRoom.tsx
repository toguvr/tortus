import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import socketio from "socket.io-client";
import { routes } from "../routes";

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

function OnlineRoom() {
  let { room_id } = useParams();
  const user_id = localStorage.getItem("tortus:user_id");

  const navigate = useNavigate();

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
  const [playerTurn, setPlayerTurn] = useState(0);
  const [timerPlayerOneOver, setTimerPlayerOneOver] = useState(false);
  const [timerPlayerTwoOver, setTimerPlayerTwoOver] = useState(false);

  const timeNew = new Date();
  timeNew.setSeconds(timeNew.getSeconds() + 300);

  const { seconds, minutes, resume, start, pause, restart } = useTimer({
    expiryTimestamp: timeNew,
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
    expiryTimestamp: timeNew,
    onExpire: () => setTimerPlayerTwoOver(true),
    autoStart: false,
  });

  const socket = useMemo(() => {
    if (user_id) {
      return socketio(
        "https://suavitrine.herokuapp.com",
        // "http://localhost:3333",
        {
          transports: ["websocket"],
          query: {
            user_id,
          },
        }
      );
    }
  }, [user_id]);

  const leaveRoom = () => {
    socket?.emit("leaveRoom", room_id);

    navigate(routes.home);
  };

  useEffect(() => {
    if (room_id) {
      socket?.emit(`newRoom`, room_id);

      socket?.on(`joinRoom`, (msg: any) => {
        // console.log("novo membro na sala", msg);
      });

      socket?.on(`update`, (msg: any) => {
        console.log(msg);

        if (!!msg.restart) {
          console.log(11);
          const time = new Date();
          time.setSeconds(time.getSeconds() + 300);
          restart(time, false);
          restartTwo(time, false);
        }
        if (
          msg?.possibles &&
          Array.isArray(msg?.possibles) &&
          msg?.possibles.length > 0
        ) {
          console.log(0);
          setPossibles(msg?.possibles);
        }

        if (msg?.handPlayerOne && msg?.handPlayerOne !== handPlayerOne) {
          console.log(1);
          setHandPlayerOne(msg?.handPlayerOne);
        }
        if (msg?.handPlayerTwo && msg?.handPlayerTwo !== handPlayerTwo) {
          console.log(2);
          setHandPlayerTwo(msg?.handPlayerTwo);
        }
        if (msg?.floorSelected && msg?.floorSelected !== floorSelected) {
          console.log(3);
          setFloorSelected(msg?.floorSelected);
        }
        if (
          msg?.floorToMoveSelected &&
          msg?.floorToMoveSelected !== floorToMoveSelected
        ) {
          console.log(4);
          setFloorToMoveSelected(msg?.floorToMoveSelected);
        }
        if (
          msg?.handPlayerOneSelected &&
          msg?.handPlayerOneSelected !== handPlayerOneSelected
        ) {
          console.log(5);
          setHandPlayerOneSelected(msg?.handPlayerOneSelected);
        }
        if (
          msg?.handPlayerTwoSelected &&
          msg?.handPlayerTwoSelected !== handPlayerTwoSelected
        ) {
          console.log(6);
          setHandPlayerTwoSelected(msg?.handPlayerTwoSelected);
        }
        if (msg?.moving && msg?.moving !== moving) {
          console.log(7);
          setMoving(msg?.moving);
        }
        if (msg?.playerTurn && Number(msg?.playerTurn) !== playerTurn) {
          console.log(8, msg?.playerTurn);
          setPlayerTurn(Number(msg?.playerTurn));
          if (Number(msg?.playerTurn) === 2) {
            console.log("restartei");
            startTwo();
            pause();
          } else {
            console.log("restartei 2");
            start();
            pauseTwo();
          }
        }
        if (
          msg?.timerPlayerOneOver !== undefined &&
          msg?.timerPlayerOneOver !== timerPlayerOneOver
        ) {
          console.log(9);
          setTimerPlayerOneOver(msg?.timerPlayerOneOver);
        }
        if (
          msg?.timerPlayerTwoOver !== undefined &&
          msg?.timerPlayerTwoOver !== timerPlayerTwoOver
        ) {
          console.log(10);
          setTimerPlayerTwoOver(msg?.timerPlayerTwoOver);
        }
      });
    }
  }, [socket?.id]);

  const sendMsg = (type: string, data?: any) => {
    switch (type) {
      case "update":
        return socket?.emit("update", data);

      case "joinRoom":
        break;
      case "generateFloors":
        return socket?.emit("update", {
          room_id,
          possibles: data.possibles,
          handPlayerOne: data.handPlayerOne,
          handPlayerTwo: data.handPlayerTwo,
          playerTurn: data.playerTurn,
          timerPlayerOneOver: data.timerPlayerOneOver,
          timerPlayerTwoOver: data.timerPlayerTwoOver,
          restart: true,
        });

      case "trade":
        return socket?.emit("update", {
          room_id,
          possibles: data.possibles,
          moving: data.moving,
          handPlayerOneSelected: data.handPlayerOneSelected ?? {},
          handPlayerTwoSelected: data.handPlayerTwoSelected ?? {},
          handPlayerOne: data.handPlayerOne ?? handPlayerOne,
          handPlayerTwo: data.handPlayerTwo ?? handPlayerTwo,
          floorSelected: {},
        });

      case "onFloorClickHandChange":
        return socket?.emit("update", {
          room_id,
          handPlayerOneSelected:
            data.handPlayerOneSelected ?? handPlayerOneSelected,
          handPlayerTwoSelected:
            data.handPlayerTwoSelected ?? handPlayerTwoSelected,
        });
      case "onFloorClickWithPin":
        console.log(data);
        return socket?.emit("update", data);
      case "onFloorClickWithoutPin":
        console.log(data);
        return socket?.emit("update", data);
      case "onFloorClickToMove":
        console.log("onFloorClickToMove", data);
        return socket?.emit("update", data);
      case "turnFloor":
        console.log("turnFloor", data);
        return socket?.emit("update", data);
      case "rotateFloor":
        console.log("rotateFloor", data);
        return socket?.emit("update", data);
      case "changePlayerTurn":
        console.log("changePlayerTurn", data);
        return socket?.emit("update", data);
      case "move":
        return socket?.emit("update", data);
      default:
        return socket?.emit("update", data);
    }
  };

  const optionsHoles = [
    { type: "buraco", quantity: 7 },
    { type: "buraco fim", quantity: 1 },
  ];

  const options = [
    { type: "Y", quantity: 2 },
    { type: "l", quantity: 3 },
    { type: "<", quantity: 9 },
    { type: "<<", quantity: 6 },
    { type: "<<<", quantity: 3 },
    { type: "cavalo", quantity: 3 },
    { type: "diagonal duplo sentido", quantity: 1 },
    { type: "y", quantity: 1 },
    { type: "seta diagonal", quantity: 2 },
    { type: "seta duplo sentido", quantity: 2 },
    { type: "T", quantity: 2 },
    { type: "V", quantity: 1 },
    { type: "estrela", quantity: 4 },
    { type: "x", quantity: 1 },
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

    optionsHoles.forEach((option) => {
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

    embaralhado = embaralhar(finalOptions);

    for (let compra of compras) {
      compra.tapped = false;
    }

    const playerOneHand = [compras[0], compras[1], compras[2]];
    const playerTwoHand = [compras[3], compras[4], compras[5]];

    setHandPlayerOne(playerOneHand);
    setHandPlayerTwo(playerTwoHand);

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

    sendMsg("generateFloors", {
      possibles: embaralhado,
      playerTurn: 0,
      timerPlayerOneOver: false,
      timerPlayerTwoOver: false,
      handPlayerOne: playerOneHand,
      handPlayerTwo: playerTwoHand,
    });
  }

  function onFloorClick(
    item: IOption,
    state: IOption,
    setState: React.Dispatch<React.SetStateAction<IOption>>,
    hand: boolean,
    player: number
  ) {
    if (hand) {
      setState(item);

      return sendMsg("onFloorClickHandChange", {
        room_id,
        handPlayerOneSelected: player === 1 ? item : handPlayerOneSelected,
        handPlayerTwoSelected: player === 2 ? item : handPlayerTwoSelected,
      });
    }
    if (!moving) {
      if (item.pins.length > 0) {
        setState(item);
        tunMoving();

        // console.log("onFloorClick 2");
        return sendMsg("onFloorClickWithPin", {
          room_id,
          floorSelected: item,
        });
      } else {
        setState(item);
        sendMsg("onFloorClickWithoutPin", {
          room_id,
          floorSelected: item,
        });
        return;
      }
    }
    setFloorToMoveSelected(item);

    sendMsg("onFloorClickToMove", {
      room_id,
      floorToMoveSelected: item,
    });
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
      return toast.error("Não pode revelar piso com o pino em cima");
    }

    newPossibles[itemIndex].tapped = !newPossibles[itemIndex].tapped;
    setPossibles(newPossibles);
    console.log("turnFloor 1");
    sendMsg("turnFloor", {
      room_id,
      possibles: newPossibles,
    });
    return;
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

    if (newPossibles[itemIndex].pins.length > 0) {
      return toast.error("Não pode rodar um piso com o pino em cima");
    }

    newPossibles[itemIndex]!.rotate += qty;

    setPossibles(newPossibles);
    return;
    // console.log("rotateFloor 1");
    // sendMsg("rotateFloor", {
    //   possibles: newPossibles,
    // });
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
    //   return toast.error("Não pode colocar o buraco em jogo");
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
    // console.log("trade 1");
    sendMsg("trade", {
      // floorSelected: {} as IOption,
      [playerTurn === 1 ? "handPlayerOne" : "handPlayerTwo"]: handArr,
      // [playerTurn === 1 ? "handPlayerOneSelected" : "handPlayerTwoSelected"]:
      // {} as IOption,
      // moving: false,
      possibles: newPossibles,
    });
  }

  function move() {
    if (!floorSelected?.id) {
      return;
    }

    if (!floorToMoveSelected?.id) {
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

    sendMsg("move", {
      room_id,
      floorToMoveSelected: {},
      floorSelected: {},
      possibles: newPossibles,
      moving: false,
    });
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
      return toast.error("Você perdeu, tempo esgotado!");
    }
    if (turnToChange === 1 && playerTurn === 2 && timerPlayerTwoOver) {
      return toast.error("Você perdeu, tempo esgotado!");
    }
    if (playerTurn !== turnToChange) {
      console.log("changePlayerTurn 2");
      setPlayerTurn(turnToChange);
      if (turnToChange === 2) {
        resumeTwo();
        pause();
      } else {
        resume();
        pauseTwo();
      }
      sendMsg("changePlayerTurn", {
        room_id,
        playerTurn: turnToChange,
      });
    }
  }

  // useEffect(() => {
  //   if (playerTurn !== 0) {
  //     console.log("useEffect player turn 2");

  //     if (playerTurn === 2) {
  //       resumeTwo();
  //       pause();
  //     } else {
  //       resume();
  //       pauseTwo();
  //     }
  //   }
  // }, [playerTurn]);

  useEffect(() => {
    if (!user_id) {
      leaveRoom();
    }
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <button className="button" onClick={leaveRoom}>
          Sair
        </button>
        <h2 style={{ color: "white" }}>Sala {room_id}</h2>
        <button className="button" onClick={generateFloors}>
          Reiniciar
        </button>
      </div>

      <div className="hand">
        <header className="App-header">
          <p>Jogador 1</p>
          <div className="mao">
            {handPlayerOne.map((possible) => (
              <Floor
                selected={handPlayerOneSelected?.id === possible?.id}
                onClick={() =>
                  onFloorClick(
                    possible,
                    handPlayerOneSelected,
                    setHandPlayerOneSelected,
                    true,
                    1
                  )
                }
                rotate={possible?.rotate}
                key={possible?.id}
              >
                <img
                  className="floor"
                  src={getImage(possible?.tapped ? "tapped" : possible?.type)}
                  alt={possible?.type}
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
              selected={floorSelected?.id === possible?.id}
              selectedMove={floorToMoveSelected?.id === possible?.id}
              onClick={() =>
                onFloorClick(
                  possible,
                  floorSelected,
                  setFloorSelected,
                  false,
                  0
                )
              }
              rotate={possible?.rotate}
              key={possible?.id}
            >
              <img
                className="floor"
                src={getImage(possible?.tapped ? "tapped" : possible?.type)}
                alt={possible?.type}
              />
              {possible?.pins.map((pin) => (
                <img
                  key={pin?.id}
                  className="pin"
                  src={getImage(pin?.color)}
                  alt={possible?.type}
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
                selected={handPlayerTwoSelected?.id === possible?.id}
                onClick={() =>
                  onFloorClick(
                    possible,
                    handPlayerTwoSelected,
                    setHandPlayerTwoSelected,
                    true,
                    2
                  )
                }
                rotate={possible?.rotate}
                key={possible?.id}
              >
                <img
                  className="floor"
                  src={getImage(possible?.tapped ? "tapped" : possible?.type)}
                  alt={possible?.type}
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

export default OnlineRoom;
