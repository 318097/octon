import COLORS from "@codedrops/react-ui";

const formatNumber = (number) => `₹${Number(number).toLocaleString()}`;

const getColor = (idx) => {
  const colorList = [
    "green",
    "nbPink",
    "cdBlue",
    "cdGreen",
    "blue",
    "nbPink",
    "coffee",
    "watermelon",
    "orchid",
    "green",
  ];
  return COLORS[colorList[idx % colorList.length]];
};

export { formatNumber, getColor };
