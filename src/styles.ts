import styled from "styled-components";

export const Floor = styled.div<{ rotate: number }>`
  border-radius: 4px;
  padding: 10px;
  background: #61dafb;
  transform: ${(props) => `rotate(${props.rotate}deg)`};
`;
