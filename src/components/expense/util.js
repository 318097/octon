export const calculateTotal = expenses =>
  expenses.reduce((acc, { amount }) => amount + acc, 0);
