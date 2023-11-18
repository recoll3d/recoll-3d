import { BiSearchAlt } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import { MdOutlineNotificationsNone } from "react-icons/md";

import "./styles.css";
import "./styles.scss";

type User = {
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

export const Upside = (props: any) => {
  const user = props.user as User;

  return (
    <div className="upside">
      <div className="header-section flex">
        <div className="title">
          <h1>Bem vindo à Recoll3D</h1>
          <p>Olá {user.name}, bem vindo de volta!</p>
        </div>

        <div className="search-bar flex">
          <input type="text" placeholder="Pesquisar" />
          <BiSearchAlt className="icon" />
        </div>

        <div className="user flex">
          <TbMessageCircle className="user-icon" />
          <MdOutlineNotificationsNone className="user-icon" />

          <div className="user-image">
            <img src={user.profile.image_url} alt="User Image" />
          </div>
        </div>
      </div>
    </div>
  );
};
