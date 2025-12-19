const formatDateWithOrdinal = (dateString, htmlFormat = true) => {
  const [day, month, year] = dateString.split("/"); // Split the date string (DD/MM/YYYY)

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (day) => {
    const dayNum = parseInt(day, 10);
    if (dayNum > 3 && dayNum < 21) return "th"; // Covers 4th-20th
    switch (dayNum % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const ordinalSuffix = getOrdinalSuffix(day);

  // Convert the month number to a short month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month, 10) - 1];

  if (!htmlFormat) {
    return `${day}${ordinalSuffix} ${monthName}`;
  }

  // Return the formatted date with superscript for the ordinal suffix
  return (
    <>
      {day}
      <sup>{ordinalSuffix}</sup> {monthName}
    </>
  );
};

export default formatDateWithOrdinal;
