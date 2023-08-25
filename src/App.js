//import logo from "./logo.svg";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routes/routers";
import React from "react";

// access the pre-bundled global API functions
//const { invoke } = window.__TAURI__.tauri;

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
