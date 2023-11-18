import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

import { Sidebar } from "../../components/Sections/Sidebar";
import { Body } from "../../components/Sections/Body";

import "./styles.css";

const Dashboard = () => {
  const [recyclingScore, setRecyclingScore] = useState(0);
  const [user, setUser] = useState(null);

  const location = useLocation();
  // const { user: userAuth } = useContext(AuthContext);

  useEffect(() => {
    const token = Cookies.get("reactauth.token");
    if (token) {
      api
        .get(`/users/${token}`, {
          // params: token,
          headers: {
            Authorization: `Barear ${token}`,
          },
        })
        .then(({ data }) => {
          setUser(data ? data : location.state.user);
          console.log("Dados Do Usuário:");
          console.log(data);
        });
    }
    // setUser(location.state.user);
    // console.log(location.state.user);
  }, []);

  if (!user) {
    return (
      <div>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div id="page-dashboard">
      <div className="content">
        <Sidebar />
        <Body user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
