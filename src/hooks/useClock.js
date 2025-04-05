import { useState, useEffect } from "react";

export const useClock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      const now = new Date();
      const secondsUntilNextMinute = 60 - now.getSeconds();

      setTimeout(() => {
        updateTime();
        setInterval(updateTime, 60000); // Update every 60 seconds
      }, secondsUntilNextMinute * 1000);
    };

    updateTime();

    return () => clearInterval(updateTime); // Cleanup
  }, []);

  return time;
};
