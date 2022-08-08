import styled from "styled-components";

interface FloorProps {
  rotate: number;
  selected: boolean;
  selectedMove?: boolean;
}

export const Floor = styled.div<FloorProps>`
  border-radius: 4px;
  padding: 10px;
  background: #9ec8ad;

  cursor: pointer;
  user-select: none;
  border: ${(props) =>
    props.selectedMove
      ? "2px solid blue"
      : props.selected && "2px solid yellow"};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .pin {
    position: absolute;
    width: 70%;
    height: 70%;
  }

  .floor {
    border-radius: 4px;
    transform: ${(props) => `rotate(${props.rotate}deg)`};
  }
`;

interface TimerProps {
  myTurn: boolean;
  timeOver: boolean;
}

export const Timer = styled.h2<TimerProps>`
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.timeOver ? "red" : props.myTurn ? "#ff9000" : "lightgray"};

  user-select: none;
`;
