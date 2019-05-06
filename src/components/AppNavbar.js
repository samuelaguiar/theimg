import React, { Component } from "react";
import "../style/navbar.scss";
import logo from "../img/logo.svg";

class AppNavbar extends Component {
  state = {
    showMenuArquivo: false,
    showMenuRealce: false,
    showMenuHistograma: false
  };

  render() {
    return (
      <div className="shadow container">
        <div className="navbar max-w">
          <div className="logo not-select">
            <img src={logo} alt="logo" />
            <h1>
              THE<strong>IMG</strong>
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default AppNavbar;
