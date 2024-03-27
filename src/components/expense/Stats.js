/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_STATS } from "../../graphql/queries";
import "./Expenses.scss";
import _ from "lodash";
import { Spin } from "antd";
import colors, { Loading } from "@codedrops/react-ui";
import { Bar, Pie } from "react-chartjs-2";

const generateMonthlyOverviewData = ({
  input,
  rootExpenseTypes,
  expenseTypes,
}) => {
  const entries = Object.entries(input);

  const labels = entries.map(([label]) => label);

  const datasets = [];
  const expenseSubTypes = expenseTypes.filter(
    (expenseType) => !!expenseType.parentTagId
  );

  expenseSubTypes.forEach(({ label, color, key, parentTagId }) => {
    const matchedSubType = expenseTypes.find(
      (expense) => expense._id === parentTagId
    );

    datasets.push({
      label,
      data: entries.map(([, values]) => values[label] || 0),
      backgroundColor: colors[matchedSubType?.color || "bar"],
    });
  });

  return { labels, datasets };
};

const generateCategoryTotalData = ({
  input,
  rootExpenseTypes,
  expenseTypes,
}) => {
  return _.reduce(
    input,
    (acc, value, label) => {
      const match = expenseTypes.find((expense) => expense.label === label);
      const matchedSubType = expenseTypes.find(
        (expense) => expense._id === match?.parentTagId
      );

      acc.labels.push(label);
      acc.values.push(value);
      acc.colors.push(colors[matchedSubType?.color] || "bar");

      return acc;
    },
    { labels: [], values: [], colors: [] }
  );
};

const Stats = ({ rootExpenseTypes, expenseTypes }) => {
  const { loading, data } = useQuery(GET_EXPENSE_STATS, {
    fetchPolicy: "cache-and-network",
    variables: { input: {} },
  });

  const stats = _.get(data, "octon.expenseStats", {});

  return (
    <>
      {loading && (
        <Loading background="blur" renderLoadingComponent={<Spin />} />
      )}
      <MonthlyBreakdown
        input={stats.monthlyOverview || []}
        rootExpenseTypes={rootExpenseTypes || []}
        expenseTypes={expenseTypes || []}
      />
      <br />
      <br />
      <SubCategoryBreakdown
        input={stats.categoryTotal || {}}
        rootExpenseTypes={rootExpenseTypes || []}
        expenseTypes={expenseTypes || []}
      />
    </>
  );
};

const MonthlyBreakdown = (props) => {
  const data = generateMonthlyOverviewData(props);
  return (
    <div>
      <Bar
        {...props}
        data={data}
        options={{
          plugins: {
            tooltip: {
              filter: (obj) => !!obj.raw,
            },
          },
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
};

const SubCategoryBreakdown = (props) => {
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
