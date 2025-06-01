import { useMemo } from "react";
import useShippingDistance from "./useShippingDistance";

const BASE_CHARGE = 99; // Base shipping charge in INR
const BASE_DISTANCE = 5; // km
const EXTRA_PER_KM = 10; // Extra charge per km after base distance in INR

function calculateShippingCharges(distance) {
  if (distance <= BASE_DISTANCE) {
    return BASE_CHARGE;
  }
  return BASE_CHARGE + (distance - BASE_DISTANCE) * EXTRA_PER_KM;
}

const useShippingCharges = (destination) => {
  const distance = useShippingDistance(destination);

  const charges = useMemo(() => {
    if (distance == null || isNaN(distance)) return null;
    return calculateShippingCharges(distance);
  }, [distance]);

  return charges;
};

export default useShippingCharges;
