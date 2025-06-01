import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

const originPinCode = "500081"; // Default origin pin code

function useShippingDistance(destinationPinCode) {
  const [distance, setDistance] = useState(null);

  const getDebouncedDistance = useDebouncedCallback(async (dest) => {
    try {
      const response = await fetch(
        `https://www.ezyshare.in/api/getDistanceBetweenPins?origin=${originPinCode}&dest=${dest}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "API_KEY",
          },
        }
      );
      const data = await response.json();
      const distance = JSON.parse(data).rows[0].elements[0].distance.value;
      if (dest.toString().length === 6) setDistance(Math.ceil(distance / 1000));
      else setDistance(null);
    } catch (error) {
      console.error("Error fetching distance:", error);
    }
  }, 1000);

  useEffect(() => {
    if (destinationPinCode && destinationPinCode.toString().length === 6)
      getDebouncedDistance(destinationPinCode);
  }, [destinationPinCode]);

  return distance;
}

export default useShippingDistance;
