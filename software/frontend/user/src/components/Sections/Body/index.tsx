import { Upside } from "./Upside";
import { Listing } from "./Listing";
import { Activity } from "./Activity";

import "./styles.css";
import "./styles.scss";

export const Body = ({ user }: any) => {
  return (
    <div className="main-content">
      <Upside user={user} />

      <div className="bottom flex">
        <Activity />
        <Listing />
      </div>
    </div>
  );
};
