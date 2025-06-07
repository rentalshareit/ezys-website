import { useMemo } from "react";
import useShippingDistance from "./useShippingDistance";

const BASE_CHARGE = 99; // Base shipping charge in INR
const BASE_DISTANCE = 5; // km
const EXTRA_PER_KM = 10; // Extra charge per km after base distance in INR
const cap = 299; // Maximum shipping charge cap in INR

function calculateShippingCharges(distance) {
  if (distance <= BASE_DISTANCE) {
    return BASE_CHARGE;
  }
  return BASE_CHARGE + (distance - BASE_DISTANCE) * EXTRA_PER_KM;
}

const useShippingCharges = (destination) => {
  const [distance, isDistanceLoading] = useShippingDistance(destination);

  const charges = useMemo(() => {
    if (distance == null || isNaN(distance)) return null;
    return Math.min(calculateShippingCharges(distance), cap); // Cap at 299 INR
  }, [distance]);

  return [charges, isDistanceLoading];
};

export default useShippingCharges;
