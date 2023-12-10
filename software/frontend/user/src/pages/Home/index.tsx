import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./styles.css";

import logo from "../../assets/logo-name.svg";

const Home = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = Cookies.get("reactauth.token");

  //   if (token) {
  //     navigate("/dashboard", { replace: true });
  //   }
  // }, []);

  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Recoll3D" />
        </header>

        <main>
          <h1>Seu ponto de partida para a reciclagem!</h1>
          <p>
            Facilitando a busca por pontos de coleta para transformar resíduos
            em brindes sustentáveis.
          </p>

          <Link to="/signin" className="primary-button">
            <span>
              <FiLogIn />
            </span>
            <strong>Entrar</strong>
          </Link>

          <Link to="/signup" className="secondary-button">
            <span>
              <FiLogIn color="var(--primary-color)" />
            </span>
            <strong>Cadastre-se agora</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
