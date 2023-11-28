import { useState, useEffect } from "react";
// import { socket } from "../../../../services/socket";

import "./styles.css";

export const Activity = () => {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [score, setScore] = useState(0);

  return (
    <div>
      Activity
      {/* <h1>Quantidade de pontos: {score}</h1> */}
    </div>
  );
};
