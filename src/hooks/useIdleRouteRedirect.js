import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

function useIdleRouteRedirect(idleTimeMs = 15 * 60 * 1000, redirectUrl = "/") {
  const history = useHistory();
  // useRef to store the timer ID, allowing it to persist across re-renders
  const idleTimerRef = useRef(null);

  // Function to reset the idle timer.
  const resetIdleTimer = () => {
    // Clear any existing timer.
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Set a new timer.
    idleTimerRef.current = setTimeout(() => {
      // Use history.push from React Router v5 for redirection.
      console.log(
        `User idle for ${
          idleTimeMs / 1000
        } seconds. Redirecting to: ${redirectUrl}`
      );
      history.push(redirectUrl);
    }, idleTimeMs);
  };

  // useEffect to set up and tear down event listeners.
  useEffect(() => {
    // Initialize the timer when the component mounts.
    resetIdleTimer();

    // Define the event handler for user activity.
    const handleActivity = () => {
      resetIdleTimer(); // Reset the timer on any user activity.
    };

    // Add event listeners for common user interactions.
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity); // For mobile touch events

    // Cleanup function: This runs when the component unmounts.
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current); // Clear the timer.
      }
      // Remove all event listeners.
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [redirectUrl, idleTimeMs, history]); // Add history to dependencies.
}

export default useIdleRouteRedirect;
