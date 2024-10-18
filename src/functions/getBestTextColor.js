export const getBestTextColor = (hexColor) => {
  // Ensure hexColor is a valid string and has the correct length
  if (
    typeof hexColor !== "string" ||
    hexColor.length !== 7 ||
    !hexColor.startsWith("#")
  ) {
    console.error("Invalid hex color:", hexColor);
    return "#333333"; // Return a default color in case of an invalid hex color
  }

  // Convert hex color to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Normalize RGB values to [0, 1]
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction (sRGB luminance)
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.5 ? "#333333" : "#FEFBF1";
};
