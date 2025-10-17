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

  return {
    isLoading,
    error,
    isProductAvailable,
    getAvailableSlots,
    availabilityData: itemsAvailable,
  };
};

export default useProductAvailability;
