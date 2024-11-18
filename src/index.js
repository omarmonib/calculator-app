import React from "react";
import ReactDOM from "react-dom";
import "./styles/Calculator.css"; // يمكن استبدالها بالملفات العامة
import "./index.css";
import "./App.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
