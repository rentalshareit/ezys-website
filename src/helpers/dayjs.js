import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to IST
dayjs.tz.setDefault("Asia/Kolkata");

// Custom parse format for our date format
const DATE_FORMAT = "DD/MM/YYYY";

export const formatDate = (date) => {
  if (!date) return null;
  return dayjs(date).format(DATE_FORMAT);
};

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return dayjs(dateStr, DATE_FORMAT);
};

export const DEFAULT_DATE_FORMAT = DATE_FORMAT;

export default dayjs;