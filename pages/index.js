import React, { useState, useEffect } from "react";

function Home() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetTime = new Date().getTime() + 15 * 15 * 60 * 1000; // 20 horas a partir de agora

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      } else {
        setTimeLeft("00:00:00");
        clearInterval(timerInterval);
      }
    };

    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <div>
      <h2>Tempo restante: {timeLeft}</h2>
    </div>
  );
}

export default Home;
