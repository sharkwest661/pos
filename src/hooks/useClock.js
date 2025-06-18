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
    let intervalId;

    const update = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    // Set up a timeout to align with the start of the next minute
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    const timeoutId = setTimeout(() => {
      update(); // Update once immediately at the minute change
      // Then, set an interval to update every 60 seconds
      intervalId = setInterval(update, 60000);
    }, secondsUntilNextMinute * 1000);

    // The cleanup function
    return () => {
      clearTimeout(timeoutId); // Clear the initial timeout
      if (intervalId) {
        clearInterval(intervalId); // Clear the interval
      }
    };
  }, []);

  return time;
};
