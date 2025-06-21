import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTourStatus } from "@/redux/actions/miscActions";
import useIsFirstVisit from "./useIsFirstVisit";

const useTour = (
  pageName = "",
  steps = [],
  visiblePredicate = () => true,
  deps = [],
  timeout = 5000
) => {
  const dispatch = useDispatch();
  const tourCompleted = useSelector((state) => state.app.tour[pageName]);
  const [isFirstVisit] = useIsFirstVisit();
  const ref = useRef({}).current;
  const [tourVisible, setTourVisible] = useState(false);

  const onClose = useCallback(() => {
    setTourVisible(false);
    dispatch(updateTourStatus({ page: pageName, status: true }));
  }, [dispatch, pageName]);

  useEffect(() => {
    if (visiblePredicate() && isFirstVisit && !tourCompleted) {
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
    onClose,
    steps: steps.map((step) => ({
      ...step,
      nextButtonProps: { type: "primary" },
    })),
  };
};

export default useTour;
