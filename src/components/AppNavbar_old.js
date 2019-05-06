import React, { Component } from "react";
import "../style/navbar.scss";
import logo from "../img/logo.svg";
import { Link } from "react-router-dom";

class AppNavbar extends Component {
  state = {
    showMenuArquivo: false,
    showMenuRealce: false,
    showMenuHistograma: false
  };

  showMenuArquivo = () => {
    const { showMenuArquivo } = this.state;
    this.closeMenus();
    this.setState(
      {
        showMenuArquivo: !showMenuArquivo
      },
      () => {
        document
          .getElementById("outNavbar")
          .addEventListener("click", this.closeMenus);
      }
    );
  };

  showMenuRealce = () => {
    const { showMenuRealce } = this.state;
    this.closeMenus();
    this.setState(
      {
        showMenuRealce: !showMenuRealce
      },
      () => {
        document
          .getElementById("outNavbar")
          .addEventListener("click", this.closeMenus);
      }
    );
  };

  showMenuHistograma = () => {
    const { showMenuHistograma } = this.state;
    this.closeMenus();
    this.setState(
      {
        showMenuHistograma: !showMenuHistograma
      },
      () => {
        document
          .getElementById("outNavbar")
          .addEventListener("click", this.closeMenus);
      }
    );
  };

  closeMenus = () => {
    this.setState(
      {
        showMenuArquivo: false,
        showMenuRealce: false,
        showMenuHistograma: false
      },
      () => {
        document
          .getElementById("outNavbar")
          .removeEventListener("click", this.closeMenus);
      }
    );
  };

  render() {
    return (
      <div className="shadow container">
        <div className="navbar max-w">
          <Link to="/" className="logo not-select">
            <img src={logo} alt="logo" />
            <h1>
              THE<strong>IMG</strong>
            </h1>
          </Link>
          <ul className="not-select">
            <li>
              <span onClick={this.showMenuArquivo}>Arquivo</span>
              {this.state.showMenuArquivo ? (
                <ul className="arquivo dropdown">
                  <li>Abrir imagem</li>
                  <li>Salvar</li>
                </ul>
              ) : null}
            </li>
            <li>
              <span onClick={this.showMenuRealce}>Realce</span>
              {this.state.showMenuRealce ? (
                <ul className="realce dropdown">
                  <li>Logarítmico</li>
                  <li>Gama</li>
                  <li>Inversa</li>
                </ul>
              ) : null}
            </li>
            <li>
              <span onClick={this.showMenuHistograma}>Histograma</span>
              {this.state.showMenuHistograma ? (
                <ul className="histograma dropdown">
                  <li>Exibir</li>
                  <li>Equalizar</li>
                  <li>Especificar</li>
                  <li>Comparar</li>
                </ul>
              ) : null}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default AppNavbar;
