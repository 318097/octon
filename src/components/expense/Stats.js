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
    const { label, color } = type;
    const values = entries.map(([, values]) => values[label] || 0);

    datasets.push({ label, data: values, backgroundColor: colors[color] });
  });

  return { labels, datasets };
};

const generateCategoryTotalData = ({ input, rootExpenseTypes }) => {
  return _.reduce(
    input,
    (acc, value, label) => {
      const match = rootExpenseTypes.find((item) => item.label === label);
      acc.labels.push(label);
      acc.values.push(value);
      acc.colors.push(colors[match.color]);

      return acc;
    },
    { labels: [], values: [], colors: [] }
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
      <CategoryTotal
        input={stats.categoryTotal || {}}
        rootExpenseTypes={rootExpenseTypes || []}
      />
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
  const { labels, values, colors } = generateCategoryTotalData(props) || {};

  return (
    <div>
      <Pie
        height={200}
        width={200}
        data={{
          labels,
          datasets: [
            {
              backgroundColor: colors,
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
