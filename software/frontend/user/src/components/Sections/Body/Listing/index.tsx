import { useState } from "react";
import { BiRecycle } from "react-icons/bi";
import Cookies from "js-cookie";

import { api } from "../../../../services/api";

import "./styles.css";

export const Listing = () => {
  const [recycling, setRecycling] = useState(false);
  const [recycling_id, setRecylingId] = useState("");

  async function handleRecycling() {
    const token = Cookies.get("reactauth.token");

    if (!recycling) {
      const { data } = await api.post("/recycling", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecylingId(data.id);
      console.log(data.id);
    } else {
      const { data } = await api.put(
        `/recycling/update-end-date/${recycling_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DADOS DA ATUALIZAÇÃO");
      console.log(data);

      // await api.get('')
    }

    setRecycling(!recycling);
  }

  return (
    <div className="listing">
      Listing
      <h1>{recycling && "Reciclando"}</h1>
      <main>
        <button onClick={handleRecycling}>
          <span>
            <BiRecycle />
          </span>
          <strong>
            {!recycling ? "Iniciar Reciclagem" : "Parar Reciclagem"}
          </strong>
        </button>
      </main>
    </div>
  );
};
