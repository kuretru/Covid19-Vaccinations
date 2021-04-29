import React from "react";
import logo from "./logo.svg";
import "./App.css";
import WorldMap from "./components/WorldMap/WorldMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>COVID-19疫苗数据可视化</h1>

        <div className="main">
          <div className="header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="control"></div>
          <div className="picker"></div>
          <div className="chart">
            <WorldMap />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
