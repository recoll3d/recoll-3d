import { useState } from "react";
// import { BiRecycle } from "react-icons/bi";
import { BsArrowRightShort } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";

import "./styles.css";
import "./styles.scss";

import babyGrootImg from "../../../../assets/baby-groot.jpg";
import shenlongAndGokuImg from "../../../../assets/shenlong-and-goku.jpg";
import blackAdamImg from "../../../../assets/black-adam.jpg";
import bb8Img from "../../../../assets/bb-8.jpg";

export const Listing = () => {
  return (
    <div className="listing">
      <div className="heading">
        <h1>Meus Brindes</h1>
        <button className="button flex">
          Ver todos <BsArrowRightShort className="icon" />
        </button>
      </div>

      <div className="listing-content">
        <div className="single-item">
          <AiFillHeart className="icon" />
          <img src={babyGrootImg} alt="Gift" />
          <h3>Baby Groot</h3>
        </div>

        <div className="single-item">
          <AiOutlineHeart className="icon" />
          <img src={shenlongAndGokuImg} alt="Gift" />
          <h3>Shenlong e Goku</h3>
        </div>

        <div className="single-item">
          <AiOutlineHeart className="icon" />
          <img src={blackAdamImg} alt="Gift" />
          <h3>Adão Negro</h3>
        </div>

        <div className="single-item">
          <AiFillHeart className="icon" />
          <img src={bb8Img} alt="Gift" />
          <h3>BB-8</h3>
        </div>
      </div>

      {/* <div className="gifts flex">
        <div className="top-gifts">
          <div className="heading flex">
            <h3>Melhores Brindes</h3>
            <button className="button flex">
              Ver todos <BsArrowRightShort className="icon" />
            </button>
          </div>

          <div className="card flex">
            <div className="users"></div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
