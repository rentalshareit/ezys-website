import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

const originPinCode = "500019"; // Default origin pin code
const secondOriginPinCode = "500081"; // Second origin pin code, if needed

function useShippingDistance(destinationPinCode) {
  const [distance, setDistance] = useState(null);
  const [isDistanceLoading, setIsDistanceLoading] = useState(false);

  const getDebouncedDistance = useDebouncedCallback(async (dest) => {
    try {
      setIsDistanceLoading(true);
      let [res1, res2] = await Promise.all(
        [originPinCode, secondOriginPinCode].map((pinCode) =>
          fetch(`/api/getDistanceBetweenPins?origin=${pinCode}&dest=${dest}`, {
            method: "GET",
            headers: {
              "X-Api-Key": "API_KEY",
            },
          }).then((response) => response.json())
        )
      );
      const distance = JSON.parse(res1).rows[0].elements[0].distance.value;
      const alternateDistance =
        JSON.parse(res2).rows[0].elements[0].distance.value;
      if (dest.toString().length === 6)
        setDistance(Math.ceil(Math.min(distance, alternateDistance) / 1000));
      else setDistance(null);
    } catch (error) {
      console.error("Error fetching distance:", error);
    } finally {
      setIsDistanceLoading(false);
    }
  }, 1000);

  useEffect(() => {
    if (destinationPinCode && destinationPinCode.toString().length === 6)
      getDebouncedDistance(destinationPinCode);
    else setDistance(null);
  }, [destinationPinCode]);

  return [distance, isDistanceLoading];
}

export default useShippingDistance;
