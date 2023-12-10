import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

import { Sidebar } from "../../components/Sections/Sidebar";
import { Body } from "../../components/Sections/Body";
import { Loading } from "../../components/Loading";

import "./styles.css";
import "./styles.scss";

const Dashboard = () => {
  const [recyclingScore, setRecyclingScore] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  // const { user: userAuth } = useContext(AuthContext);

  useEffect(() => {
    const token = Cookies.get("reactauth.token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("reactauth.token");
    // const user_id = Cookies.get("reactauth.user_id");

    if (token) {
      api
        .get(`/users/${token}`, {
          // params: token,
          headers: {
            Authorization: `Barear ${token}`,
          },
        })
        .then(({ data }) => {
          setTimeout(() => {
            setUser(data ? data : location.state.user);
            console.log("Dados Do Usuário:");
            console.log(data);
          }, 3000);
        });
    }
    // setUser(location.state.user);
    // console.log(location.state.user);
  }, []);

  if (!user) {
    return <Loading />;
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
