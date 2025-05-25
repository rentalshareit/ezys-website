import { useState, useEffect } from "react";
import moment from "moment";

function useRefreshOnISTDateChange() {
  const getISTDate = () => {
    const nowUTC = moment.utc();
    const istOffset = 5.5 * 60; // Offset in minutes
    return nowUTC.add(istOffset, "minutes").startOf("day");
  };

  const [istDate, setIstDate] = useState(getISTDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newISTDate = getISTDate();
      if (!newISTDate.isSame(istDate, "day")) {
        window.location.reload();
      }
      setIstDate(newISTDate);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [istDate]);

  return istDate;
}

export default useRefreshOnISTDateChange;
