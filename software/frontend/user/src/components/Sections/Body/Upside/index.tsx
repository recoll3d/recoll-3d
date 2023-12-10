import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import Cookies from "js-cookie";

import { api } from "../../../../services/api";
import { socket } from "../../../../services/socket";
import { BasicUsage } from "../../../../components/Modal";

import "./styles.css";
import "./styles.scss";

import bottleImg from "../../../../assets/bottle-in-grass.jpg";
// import lampImg from "../../../../assets/ecological-lamp.jpg";
import journeyAmicoImg from "../../../../assets/journey-amico.svg";

type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profile: {
    id: string;
    name: string;
    image_url: string;
  };
  level: {
    id: string;
    name: string;
    position: number;
  };
  created_at: Date;
};

type IRecycling = {
  number_of_bottles: number;
  score: number;
};

type IBottle = {
  recycling_id: string;
  level: number;
  points: number;
};

export const Upside: React.FC<{ user: IUser }> = ({ user }) => {
  // const user = props.user as IUser;
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isRecycling, setIsRecycling] = useState(false);
  // const [recycling_id, setRecyclingId] = useState("");
  const [timerInSeconds, setTimerInSeconds] = useState(40);
  const [recyclingData, setRecyclingData] = useState<IRecycling>({
    number_of_bottles: 0,
    score: 0,
  });
  const [bottles, setBottles] = useState<IBottle[]>([]);

  useEffect(() => {
    console.log(socket.connected);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // socket.emit("get_led", "Olá");

    function turnOnLed(data: any) {
      console.log("TURN_ON_LED:");
      console.log(data);
    }

    function onRecycledBottle(data: any) {
      console.log("Dados DAS Garrafas:");
      console.log(data);
      setBottles((prevState) => [...prevState, data]);
      resetTimerInSeconds();
      // const newBottles = [...bottles, data];

      // const totalPoints = newBottles.reduce(
      //   (accumulator, currentValue: any) => {
      //     return (accumulator = accumulator + currentValue.points);
      //   },
      //   0
      // );

      // setScore(totalPoints);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("turn_on_led", turnOnLed);
    socket.on("recycled_bottle", onRecycledBottle);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("turn_on_led", turnOnLed);
      socket.off("recycled_bottle", onRecycledBottle);
    };
  }, [socket]);

  useEffect(() => {
    const recyclingScore = bottles.reduce((accumulator, currentValue) => {
      return (accumulator = accumulator + currentValue.points);
    }, 0);

    setRecyclingData({
      number_of_bottles: bottles.length,
      score: recyclingScore,
    });

    console.log("Valor de Recycling Info:");
    console.log(recyclingData);
  }, [bottles]);

  useEffect(() => {
    let intervalId: any;

    if (isRunning && timerInSeconds <= 0) {
      handleRecyclingEnd();
      console.log("Evento ocorrendo nessa parte.");
      clearInterval(intervalId);
      return;
    }

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimerInSeconds((prevState) => (prevState = prevState - 1));
        console.log(timerInSeconds);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timerInSeconds]);

  function resetRecyclingData() {
    setBottles([]);
    setRecyclingData({
      number_of_bottles: 0,
      score: 0,
    });
    resetTimerInSeconds();
  }

  function handleModalClose(onClose: () => void) {
    if (!isRecycling) {
      resetRecyclingData();
      setIsOpenModal(false);
      onClose();
    }
  }

  function resetTimerInSeconds() {
    setTimerInSeconds(40);
  }

  async function handleRecyclingEnd() {
    try {
      const token = Cookies.get("reactauth.token");
      const recycling_id = Cookies.get("reactapp.recycling_id");

      if (token && recycling_id) {
        console.log("ID DA RECICLAGEM:");
        console.log(recycling_id);
        console.log("INFORMAÇÕES DA RECICLAGEM:");
        console.log(recyclingData);

        await api.put(`/recycling/update-end-date/${recycling_id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // const { data } = await api.get(`/recycling/${recycling_id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // const { number_of_bottles, total_bottles_score } = data;
        // // const newData = {
        // //   number_of_bottles: data.number_of_bottles,
        // //   score: data.total_bottles_score,
        // // }

        // console.log("DADOS DA ATUALIZAÇÃO");
        // console.log(data);
        // // await api.get('')
        // // setRecyclingId("");
      }
    } catch (err) {
      window.alert("Ocorreu um erro!");
    } finally {
      setIsRunning(false);
      setIsRecycling(!isRecycling);
      Cookies.remove("reactapp.recycling_id");
    }
  }

  async function handleRecyclingStart() {
    try {
      const token = Cookies.get("reactauth.token");

      // let recycling_id = "";

      console.log("RECYCLING:");
      console.log(isRecycling);

      // setIsRecycling(!isRecycling);
      // setIsRunning(!isRunning);

      if (!isRecycling) {
        resetRecyclingData();
        console.log("CAIU DENTRO DA PRIMEIRA CONDIÇÃO");

        socket.emit("register_recycling", {
          token,
        });

        socket.on("recycling_log_response", (data: any) => {
          Cookies.set("reactapp.recycling_id", data.id, {
            expires: 1,
          });

          console.log(data);

          setIsRunning(!isRunning);
          setIsRecycling(!isRecycling);
        });

        // resetTimerInSeconds();

        // setTimeout(() => {
        //   // handleRecyclingEnd(recycling_id);
        //   window.alert("Reciclagem finalizada.");
        // }, 40000);
      } else {
        handleRecyclingEnd();
      }
    } catch (err) {
      console.log(err);
      window.alert(String(err));
    }
  }

  function handleOpenModal() {
    setIsOpenModal(true);
  }

  return (
    <div className="upside">
      <div className="header-section flex">
        <div className="title">
          {/* <h1>Bem vindo à Recoll3D</h1> */}
          <h1>Bem vindo!</h1>
          <p>Olá {user.name}, bem vindo de volta!</p>
        </div>

        {/* <div className="search-bar flex"> */}
        <div className="search-bar">
          <input type="text" placeholder="Pesquisar" />
          <BiSearchAlt className="icon" />
        </div>

        {/* <div className="user flex"> */}
        <div className="user">
          <TbMessageCircle className="user-icon" />
          <MdOutlineNotificationsNone className="user-icon" />

          <div className="user-image">
            <img src={user.profile.image_url} alt="User Image" />
          </div>
        </div>
      </div>

      <div className="cards-section flex">
        <div className="left-card">
          <h1>Recicle e receba brindes extraordinários</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

          <div className="button-container flex">
            <button className="button" onClick={handleOpenModal}>
              Reciclar mais
            </button>
            <button className="button transparent">
              Brindes mais recebidos
            </button>
          </div>

          <div className="image-container">
            <img src={bottleImg} alt="Garrafa no campo de grama" />
          </div>
        </div>

        <div className="right-card flex">
          {/* <div className="main flex"> */}
          <div className="main">
            <div className="text-container">
              <h1>Meu Status</h1>

              <div className="flex">
                <span>
                  Hoje <br /> <small>4 Reciclagens</small>
                </span>

                <span>
                  Este Mês <br /> <small>127 Reciclagens</small>
                </span>
              </div>

              <span className="flex link">
                Ir para minhas reciclagens{" "}
                <BsArrowRightShort className="right-icon" />
              </span>
            </div>

            <div className="image-container">
              {/* <img src={lampImg} alt="Lâmpada Ecológica" /> */}
              <img src={journeyAmicoImg} alt="Journey Amico" />
            </div>
          </div>
        </div>
      </div>

      <BasicUsage
        isOpenModal={isOpenModal}
        handleModalClose={handleModalClose}
        handleRecyclingStart={handleRecyclingStart}
        isRecycling={isRecycling}
        recyclingData={recyclingData}
        bottles={bottles}
        timerInSeconds={timerInSeconds}
      />
    </div>
  );
};
