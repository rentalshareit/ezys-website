import { useState, useCallback, useEffect, useRef } from "react";
import useIsFirstVisit from "./useIsFirstVisit";

const useTour = (
  steps = [],
  visiblePredicate = () => true,
  deps = [],
  timeout = 5000
) => {
  const isFirstVisit = useIsFirstVisit();
  const ref = useRef({}).current;
  const [tourVisible, setTourVisible] = useState(false);

  useEffect(() => {
    if (visiblePredicate() && isFirstVisit) {
      ref.timer = setTimeout(() => {
        setTourVisible(true);
      }, timeout);
    }
    return () => {
      if (ref.timer) {
        clearTimeout(ref.timer);
        setTourVisible(false);
      }
    };
  }, [...deps, isFirstVisit]);

  return {
    open: tourVisible,
    onClose: () => setTourVisible(false),
    steps: steps.map((step) => ({
      ...step,
      nextButtonProps: { type: "default" },
    })),
  };
};

export default useTour;
