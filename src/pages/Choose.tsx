import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// import { Container } from './styles';

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div>
      <h1>Jogar Offline</h1>
      <Link to={`/offline`}>clique aqui</Link>
      <br />
      <h1>Jogar Online</h1>
      <Link to={`/online/${uuidv4()}`}>Criar Sala</Link>
      <br />
      <input
        type="text"
        placeholder="id da sala para entrar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Link to={`/online/${inputValue}`}>
        <button>Entrar na Sala</button>
      </Link>
    </div>
  );
};

export default Home;
