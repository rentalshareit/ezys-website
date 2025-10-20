import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useProductAvailability from "@/hooks/useProductAvailability";
import { updateRentalPeriod } from "@/redux/actions/miscActions";

const PersistDataInitializer = () => {
  const dispatch = useDispatch();
  const { validateRentalPeriod } = useProductAvailability();
  const rentalPeriod = useSelector((state) => state.app.rentalPeriod);

  useEffect(() => {
    // Validate and adjust existing rental period after rehydration
    const validation = validateRentalPeriod(
      rentalPeriod.dates[0],
      rentalPeriod.dates[1]
    );

    if (!validation.isValid) {
      // Set default rental period if current is invalid
      dispatch(updateRentalPeriod(validation.defaultPeriod));
    } else if (validation.needsUpdate) {
      // Update with adjusted dates
      dispatch(
        updateRentalPeriod({
          dates: validation.dates,
          days: validation.days,
        })
      );
    }
  }, []); // Only run once after rehydration

  return null; // This is a utility component, it doesn't render anything
};

export default PersistDataInitializer;
