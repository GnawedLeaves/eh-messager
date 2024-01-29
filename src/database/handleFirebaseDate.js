export const handleFirebaseDate = (inputDate) => {
  const date = new Date(
    inputDate.seconds * 1000 + inputDate.nanoseconds / 1000000
  );
  date.setHours(date.getHours() + 8);

  const extractedDateString = date.toUTCString().slice(0, -7);
  // const extractedDateString = date.toLocaleString("en-US", {
  //   timeZone: "Asia/Singapore",
  // });
  // const extractedDateString = date.toLocaleString("en-US", {
  //   day: "2-digit",
  //   month: "short",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   timeZone: "Asia/Singapore",
  //   hour12: false, // Use 24-hour format
  // });

  return extractedDateString;
};
