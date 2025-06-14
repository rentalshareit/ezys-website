import { useState, useEffect } from "react";
import { singletonHook } from "react-singleton-hook";

const useIsFirstVisit = (init) => {
  const [isFirstVisit, setIsFirstVisit] = useState(init); // Default to false, will be updated in useEffect

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      // If 'hasVisited' key doesn't exist, it's the first visit
      setIsFirstVisit(true);
      // Set the flag in localStorage for future visits
      localStorage.setItem("hasVisited", "true");
    } else {
      // If 'hasVisited' key exists, it's not the first visit
      setIsFirstVisit(false);
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return isFirstVisit;
};

const useSingletonFirstVisit = singletonHook(false, useIsFirstVisit);

export default useSingletonFirstVisit;
