/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_STATS } from "../../graphql/queries";
import "./Expenses.scss";
import _ from "lodash";
import colors from "@codedrops/react-ui";
import { Bar, Pie } from "react-chartjs-2";

const colorsList = [
  colors.green,
  colors.coffee,
  colors.yellow,
  colors.watermelon,
];

const generateMonthlyOverviewData = ({ input, rootExpenseTypes }) => {
  const datasets = [];
  const entries = Object.entries(input);

  const labels = entries.map(([label]) => label);

  rootExpenseTypes.forEach((type, idx) => {
    const { label } = type;
    const values = entries.map(([, values]) => values[label] || 0);

    datasets.push({ label, data: values, backgroundColor: colorsList[idx] });
  });

  return { labels, datasets };
};

const generateCategoryTotalData = ({ input }) => {
  return _.reduce(
    input,
    (acc, value, label) => {
      acc.labels.push(label.toUpperCase());
      acc.values.push(value);
      return acc;
    },
    { labels: [], values: [] }
  );
};

const Stats = ({ rootExpenseTypes }) => {
  const { loading, data } = useQuery(GET_EXPENSE_STATS, {
    fetchPolicy: "cache-and-network",
  });

  const stats = _.get(data, "atom.expenseStats", {});

  return (
    <>
      <MonthlyOverview
        input={stats.monthlyOverview || []}
        rootExpenseTypes={rootExpenseTypes || []}
      />
      <br />
      <br />
      <CategoryTotal input={stats.categoryTotal || {}} />
    </>
  );
};

const MonthlyOverview = (props) => {
  const data = generateMonthlyOverviewData(props);
  return (
    <div>
      <Bar {...props} data={data} />
    </div>
  );
};

const CategoryTotal = (props) => {
  const { labels, values } = generateCategoryTotalData(props) || {};

  return (
    <div>
      <Pie
        height={200}
        width={200}
        data={{
          labels: labels,
          datasets: [
            {
              backgroundColor: [
                colors.coffee,
                colors.yellow,
                colors.blue,
                colors.watermelon,
              ],
              data: values,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default Stats;
