import { IoMdSpeedometer } from "react-icons/io";
import { GiTrophy, GiMountainClimbing } from "react-icons/gi";
import { BiRecycle, BiGift, BiTrendingUp } from "react-icons/bi";
// import { FaRegStar } from "react-icons/fa6";
import { TbUserCog } from "react-icons/tb";
import { MdOutlineDisplaySettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./styles.css";
import "./styles.scss";

import logo from "../../../assets/logo.svg";
import logoName from "../../../assets/logo-name.svg";

import { api } from "../../../services/api";

export const Sidebar = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    const token = Cookies.get("reactauth.token");

    if (token) {
      api
        .post("/disconnect", null, {
          // params: token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          Cookies.remove("reactauth.token");

          navigate("/", { replace: true });
        })
        .catch((err) => {
          window.alert("Ops!!! Tivemos um problema.");
          console.log(err);
        });
    }
  }

  return (
    <div className="side-bar grid">
      <div className="logo flex">
        <img className="primary-logo" src={logoName} alt="Recoll 3D" />
        <img className="secondary-logo" src={logo} alt="Recoll 3D" />
      </div>

      <div className="menu">
        {/* <h3 className="title">Menu Principal</h3> */}
        <h3 className="title">Lista Principal</h3>

        <ul className="lists grid">
          <li className="list-item">
            <a href="#" className="link flex">
              <IoMdSpeedometer className="icon" />
              <span className="small-text">Dashboard</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <BiRecycle className="icon" />
              <span className="small-text">Reciclagens</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <GiTrophy className="icon" />
              <span className="small-text">Minhas Conquistas</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <BiGift className="icon" />
              <span className="small-text">Brindes Adquiridos</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <GiMountainClimbing className="icon" />
              <span className="small-text">Missões</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <BiTrendingUp className="icon" />
              <span className="small-text">Desempenho de Jogador</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="settings">
        <h3 className="title">Configurações</h3>

        <ul className="lists grid">
          <li className="list-item">
            <a href="#" className="link flex">
              <TbUserCog className="icon" />
              <span className="small-text">Perfil</span>
            </a>
          </li>
          <li className="list-item">
            <a href="#" className="link flex">
              <MdOutlineDisplaySettings className="icon" />
              <span className="small-text">Sistema</span>
            </a>
          </li>

          <li className="list-item logout">
            <Link to="#" onClick={handleLogout} className="link flex">
              <FiLogOut className="icon" />
              <span className="small-text">Sair</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* <div className="logout">
        <ul className="lists grid"></ul>
      </div> */}
    </div>
  );
};
