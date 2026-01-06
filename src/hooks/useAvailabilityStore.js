import { useState, useCallback, useEffect } from "react";
import { singletonHook } from "react-singleton-hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Set default timezone to IST
dayjs.tz.setDefault("Asia/Kolkata");

const initState = {
  itemsAvailable: [],
  isLoading: true,
  error: null,
  lastFetched: null,
  fetchAvailability: () => {},
  getAvailabilityByTags: () => ({}),
};

const useAvailabilityStoreImpl = () => {
  const [itemsAvailable, setItemsAvailable] = useState(
    initState.itemsAvailable
  );
  const [isLoading, setIsLoading] = useState(initState.isLoading);
  const [error, setError] = useState(initState.error);
  const [lastFetched, setLastFetched] = useState(initState.lastFetched);

  const fetchAvailability = useCallback(async () => {
    // If data was fetched in last 5 minutes, don't fetch again
    if (lastFetched && dayjs().diff(lastFetched, "minute") < 5) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec?action=getCurrentAvailability`
      );
      const data = await response.json();
      setItemsAvailable(data);
      setIsLoading(false);
      setError(null);
      setLastFetched(dayjs());
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, [lastFetched]);

  useEffect(() => {
    console.log("🎯 Auto-fetching on mount");
    fetchAvailability();
  }, []);

  const getAvailabilityByTags = useCallback(
    (tags) => {
      if (!tags) return {};
      return tags.reduce((acc, tag) => {
        acc[tag] = itemsAvailable.filter((item) => item.type === tag);
        return acc;
      }, {});
    },
    [itemsAvailable]
  );

  return {
    itemsAvailable,
    isLoading,
    error,
    lastFetched,
    fetchAvailability,
    getAvailabilityByTags,
  };
};

export const useAvailabilityStore = singletonHook(
  initState,
  useAvailabilityStoreImpl
);
