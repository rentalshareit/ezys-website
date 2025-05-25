import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function useIdleRouteRedirect(thresholdMinutes = 15, homeRoute = "/") {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    let timerId;
    const startTime = Date.now();

    const checkIdleTime = () => {
      const currentTime = Date.now();
      const elapsedTimeMinutes = (currentTime - startTime) / (1000 * 60);

      if (elapsedTimeMinutes > thresholdMinutes) {
        history.push(homeRoute);
      }
    };

    const resetTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(checkIdleTime, 60 * 1000); // Check every minute
    };

    // Set initial timer
    resetTimer();

    // Reset timer on user activity (mousemove, keydown, scroll)
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Clear timer and remove event listeners on unmount
    return () => {
      clearTimeout(timerId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [history, location, thresholdMinutes, homeRoute]);
}

export default useIdleRouteRedirect;
