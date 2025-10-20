import { useEffect, useMemo, useCallback } from "react";
import dayjs, { formatDate, parseDate } from "@/helpers/dayjs";
import { useAvailabilityStore } from "./useAvailabilityStore";

const useProductAvailability = () => {
  const {
    itemsAvailable,
    isLoading,
    error,
    fetchAvailability,
    getAvailabilityByTags,
  } = useAvailabilityStore();

  // Fetch availability data on mount
  useEffect(() => {
    fetchAvailability();
  }, []);

  // Memoize the availability data by product tags
  const availabilityByTag = useMemo(() => {
    return itemsAvailable.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});
  }, [itemsAvailable]);

  // Check if a product is available for rent
  const isProductAvailable = useCallback(
    (product, startDate, endDate) => {
      if (!product?.tags || !startDate || !endDate) return false;

      // Parse input dates using our helper
      const startIST = parseDate(startDate);
      const endIST = parseDate(endDate);

      return product.tags.every((tag) => {
        const tagItems = availabilityByTag[tag] || [];
        return tagItems.some((item) =>
          item.availability.some(([availStart, availEnd]) => {
            const availStartDate = parseDate(availStart);
            const availEndDate = parseDate(availEnd);
            return (
              availStartDate.isSameOrBefore(startIST) &&
              availEndDate.isSameOrAfter(endIST)
            );
          })
        );
      });
    },
    [availabilityByTag]
  );

  // Get available slots for a product
  const getAvailableSlots = useCallback(
    (product) => {
      if (!product?.tags) return [];

      const allTagsIntervals = product.tags.map((tag) => {
        const tagItems = availabilityByTag[tag] || [];

        const mergedIntervals = tagItems
          .flatMap((item) => item.availability)
          .map(([start, end]) => ({
            start: parseDate(start),
            end: parseDate(end),
          }))
          .sort((a, b) => a.start.valueOf() - b.start.valueOf())
          .reduce((merged, current) => {
            const last = merged[merged.length - 1];
            if (!last || current.start.isAfter(last.end)) {
              merged.push(current);
            } else if (current.end.isAfter(last.end)) {
              last.end = current.end;
            }
            return merged;
          }, []);

        return mergedIntervals;
      });

      // Find common intervals across all tags
      const commonIntervals = allTagsIntervals.reduce((common, intervals) => {
        if (!common.length) return intervals;

        return common.filter((commonInterval) =>
          intervals.some(
            (interval) =>
              interval.start.isSameOrBefore(commonInterval.end) &&
              interval.end.isSameOrAfter(commonInterval.start)
          )
        );
      }, []);

      return commonIntervals.map((interval) => ({
        start: formatDate(interval.start),
        end: formatDate(interval.end),
      }));
    },
    [availabilityByTag]
  );

  // Get default rental period (7 days starting tomorrow)
  const getDefaultRentalPeriod = useCallback(() => {
    const tomorrow = dayjs().startOf("day").add(1, "day");
    const endDate = tomorrow.add(7, "days");

    return {
      dates: [formatDate(tomorrow), formatDate(endDate)],
      days: 7,
    };
  }, []);

  // Validate and adjust rental period if needed
  const validateRentalPeriod = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) {
      return {
        isValid: false,
        defaultPeriod: getDefaultRentalPeriod(),
      };
    }

    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const maxAdvanceDate = today.add(2, "month");

    const start = parseDate(startDate).startOf("day");
    const end = parseDate(endDate).startOf("day");

    // If start date is today or in past, shift both dates forward
    if (start.isSameOrBefore(today)) {
      const daysDiff = end.diff(start, "days");
      const newStart = tomorrow;
      const newEnd = tomorrow.add(daysDiff, "days");

      // Check if new end date is within allowed range
      if (newEnd.isAfter(maxAdvanceDate)) {
        return {
          isValid: false,
          defaultPeriod: getDefaultRentalPeriod(),
        };
      }

      return {
        isValid: true,
        needsUpdate: true,
        dates: [formatDate(newStart), formatDate(newEnd)],
        days: daysDiff,
      };
    }

    // If dates are valid but end date exceeds max allowed
    if (end.isAfter(maxAdvanceDate)) {
      return {
        isValid: false,
        defaultPeriod: getDefaultRentalPeriod(),
      };
    }

    // Dates are valid and don't need adjustment
    return {
      isValid: true,
      needsUpdate: false,
      dates: [startDate, endDate],
      days: end.diff(start, "days"),
    };
  }, []);

  // Get available product code for the given dates and tags
  const getAvailableProductCode = useCallback(
    (product, startDate, endDate) => {
      if (!product?.tags || !startDate || !endDate) return null;

      // Parse input dates and normalize to start of day
      const startIST = parseDate(startDate).startOf("day");
      const endIST = parseDate(endDate).startOf("day");

      // For each tag, find first item (product codes) that is available
      const availableItemByTag = product.tags
        .map((tag) => {
          const tagItems = availabilityByTag[tag] || [];
          return tagItems.find((item) =>
            item.availability.some(([availStart, availEnd]) => {
              const availStartDate = parseDate(availStart).startOf("day");
              const availEndDate = parseDate(availEnd).startOf("day");
              return (
                availStartDate.isSameOrBefore(startIST) &&
                availEndDate.isSameOrAfter(endIST)
              );
            })
          );
        })
        .filter((_) => _);

      return product.tags.length === availableItemByTag.length
        ? availableItemByTag.map((item) => item.productCode)
        : null;
    },
    [availabilityByTag]
  );

  return {
    isLoading,
    error,
    isProductAvailable,
    getAvailableSlots,
    getAvailableProductCode,
    validateRentalPeriod,
    getDefaultRentalPeriod,
    availabilityData: itemsAvailable,
  };
};

export default useProductAvailability;
