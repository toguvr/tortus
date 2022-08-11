import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// import { Container } from './styles';

const Home: React.FC = () => {
  return (
    <div>
      <h1>bem vindo</h1>
      <Link to={`/offline`}>Jogar Offline</Link>
      <br />
      <Link to={`/online/${uuidv4()}`}>Jogar Online</Link>
    </div>
  );
};

export default Home;
