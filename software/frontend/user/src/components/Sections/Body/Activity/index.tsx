import { BsArrowRightShort } from "react-icons/bs";

import "./styles.css";
import "./styles.scss";

import udfImg from "../../../../assets/udf.jpg";
import carrefourImg from "../../../../assets/carrefour.jpg";
import bigBoxImg from "../../../../assets/big-box.jpg";
import ambevCddImg from "../../../../assets/ambev-cdd.jpg";

export const Activity = () => {
  return (
    <div className="activity">
      <div className="heading flex">
        <h1>Atividades Recentes</h1>
        <button className="button flex">
          Ver todas
          <BsArrowRightShort className="icon" />
        </button>
      </div>

      {/* <div className="activity-content grid"> */}
      <div className="activity-content">
        <div className="single-location flex">
          <img src={udfImg} alt="Imagem do Local" />
          <div className="location-details">
            <span className="name">UDF</span>
            {/* <br /> */}
            <small>Brinde retirado.</small>
          </div>
          <div className="duration">2 minutos atrás</div>
        </div>

        <div className="single-location flex">
          <img src={carrefourImg} alt="Imagem do Local" />
          <div className="location-details">
            <span className="name">Carrefour</span>
            {/* <br /> */}
            <small>Brinde retirado.</small>
          </div>
          <div className="duration">18 minutos atrás</div>
        </div>

        <div className="single-location flex">
          <img src={bigBoxImg} alt="Imagem do Local" />
          <div className="location-details">
            <span className="name">Big Box</span>
            {/* <br /> */}
            <small>Reciclagem realizada.</small>
          </div>
          <div className="duration">42 minutos atrás</div>
        </div>

        {/* <div className="single-location flex">
          <img src={ambevCddImg} alt="Imagem do Local" />
          <div className="location-details">
            <span className="name">AMBEV CDD</span>
            <small>Brinde retirado.</small>
          </div>
          <div className="duration">1 hora atrás</div>
        </div> */}
      </div>
    </div>
  );
};
