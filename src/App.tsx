import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

function App() {
  useEffect(() => {
    if (!localStorage.getItem("tortus:user_id")) {
      const user_id = uuidv4();
      localStorage.setItem("tortus:user_id", user_id);
    }
  }, []);
  return (
    <Router>
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

      <Routes />
    </Router>
  );
}

export default App;
