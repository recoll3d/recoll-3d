import { useState, useEffect } from "react";
import { socket } from "../../../../services/socket";

import "./styles.css";

export const Activity = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [bottles, setBottles] = useState<object[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRegisterBottle(data: any) {
      setBottles((prevState) => [...prevState, data]);

      const newBottles = [...bottles, data];

      const totalPoints = newBottles.reduce(
        (accumulator, currentValue: any) => {
          return (accumulator = accumulator + currentValue.points);
        },
        0
      );

      setScore(totalPoints);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("register_bottle", onRegisterBottle);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("register_bottle", onRegisterBottle);
    };
  }, []);

  return (
    <div>
      {/* Activity */}
      <h1>Quantidade de pontos: {score}</h1>
    </div>
  );
};
