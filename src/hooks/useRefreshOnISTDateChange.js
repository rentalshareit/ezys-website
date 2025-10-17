import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to IST
dayjs.tz.setDefault("Asia/Kolkata");

function useRefreshOnISTDateChange() {
  const getISTDate = () => {
    return dayjs().tz("Asia/Kolkata").startOf("day");
  };

  const [istDate, setIstDate] = useState(getISTDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newISTDate = getISTDate();
      if (!newISTDate.isSame(istDate, "day")) {
        window.location.reload();
      }
      setIstDate(newISTDate);
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, [istDate]);

  return istDate;
}

export default useRefreshOnISTDateChange;
