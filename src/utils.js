export const calculateTotal = (expenses) =>
  expenses.reduce((acc, { amount }) => amount + acc, 0);

export const getObjFromId = (arr = [], key, value) => {
  return arr.find((item) => item[key] === value) || {};
};
