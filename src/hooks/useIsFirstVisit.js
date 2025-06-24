import { useState, useEffect } from "react";
import { singletonHook } from "react-singleton-hook";

const useIsFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(null); // Default to false, will be updated in useEffect

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      // If 'hasVisited' key doesn't exist, it's the first visit

      // TODO: Uncomment below line. First visit tour was creating noise because of loading time across devices.
      // Disabling that for time being.

      // setIsFirstVisit({});

      // Set the flag in localStorage for future visits
      localStorage.setItem("hasVisited", "true");
    } else {
      // If 'hasVisited' key exists, it's not the first visit
      setIsFirstVisit(null);
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return [isFirstVisit, setIsFirstVisit];
};

const useSingletonFirstVisit = singletonHook(
  [false, () => {}],
  useIsFirstVisit
);

export default useSingletonFirstVisit;
