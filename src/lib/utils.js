import COLORS from "@codedrops/react-ui";
import dayjs from "dayjs";
import _ from "lodash";
import { calculateTotal } from "@codedrops/lib";

const formatNumber = (number) => `₹${Number(number).toLocaleString()}`;

const getColor = (idx) => {
  const colorList = [
    "red",
    "orchid",
    "yellow",
    "orange",
    "green",
    "foBlue",
    "nbOrange",
    "purple",
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

const processExpenses = ({
  expenseTypes,
  expenseSources,
  expenseGroups,
  expenseCategories,
  dataSource,
  showFavoritesOnly,
  filters,
}) => {
  const expenseTypesKeyed = _.keyBy(expenseTypes, "_id");
  const expenseSourcesKeyed = _.keyBy(expenseSources, "_id");
  const expenseGroupsKeyed = _.keyBy(expenseGroups, "_id");
  const expenseCategoriesKeyed = _.keyBy(expenseCategories, "_id");

  const filteredDataSource = dataSource
    .filter((item) => (showFavoritesOnly ? item.favorite : true))
    .map((item) => ({
      ...item,
      expenseSubType: _.get(expenseTypesKeyed, [
        item.expenseSubTypeId,
        "label",
      ]),
      expenseSource: _.get(expenseSourcesKeyed, [
        item.expenseSourceId,
        "label",
      ]),
      expenseGroup: _.get(expenseGroupsKeyed, [item.expenseGroupId, "label"]),
      expenseCategory: _.get(expenseCategoriesKeyed, [
        item.expenseCategoryId,
        "label",
      ]),
      expenseDate: dayjs(item.date).format("YYYY-MM-DD"),
    }));

  const groupedDataSource = _.groupBy(
    filteredDataSource,
    (expense) => expense.expenseDate
  );

  const sortedGroupKeys = _.orderBy(
    Object.keys(groupedDataSource),
    null,
    "desc"
  );

  const [sortKey, sortOrder] = (filters.sort || "").split("_");

  return {
    sortedGroupKeys,
    hasData: filteredDataSource.length,
    groupedDataSource,
    sortedDataSource: _.orderBy(filteredDataSource, sortKey, sortOrder),
  };
};

const calculateTotalAmount = (expenses) => calculateTotal(expenses, "amount");

export { formatNumber, getColor, processExpenses, calculateTotalAmount };
