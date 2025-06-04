export const dateFormatter = (date, locale = 'en-US') => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: 'UTC'
  };
  if (date == "Invalid Date") {
    return "Unknown Date";
  } else {
    return date.toLocaleDateString(locale, options);
  }

};
