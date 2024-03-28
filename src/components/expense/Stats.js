/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_STATS } from "../../graphql/queries";
import "./Expenses.scss";
import _ from "lodash";
import { Spin } from "antd";
import colors, { Loading } from "@codedrops/react-ui";
import { Bar, Pie } from "react-chartjs-2";
import { getColor } from "../../lib/utils";

const generateMonthlyOverviewData = ({ input, expenseTypes }) => {
  const entries = Object.entries(input);

  const labels = entries.map(([label]) => label);

  const datasets = [];

  const expenseSubTypes = expenseTypes.filter(
    (expenseType) => !!expenseType.parentTagId && expenseType.visible
  );

  expenseSubTypes.forEach(({ label }, idx) => {
    const data = entries.map(([, values]) => values[label]);
    const hasValue = data.reduce(
      (sum, val) => Number(sum) + Number(val || 0),
      0
    );

    const obj = {
      label,
      data,
      backgroundColor: getColor(idx),
    };

    if (hasValue) datasets.push(obj);
  });

  return { labels, datasets };
};

const MonthlyBreakdown = ({ expenseTypes }) => {
  const response = useQuery(GET_EXPENSE_STATS, {
    fetchPolicy: "cache-and-network",
    variables: { input: {} },
  });

  const stats = _.get(response.data, "octon.expenseStats", {});
  const props = {
    input: stats.monthlyOverview || [],
    expenseTypes: expenseTypes || [],
  };

  const data = generateMonthlyOverviewData(props);

  return (
    <>
      {response.loading && (
        <Loading background="blur" renderLoadingComponent={<Spin />} />
      )}
      <div>
        <Bar
          {...props}
          height={340}
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
    </>
  );
};

const SubCategoryBreakdown = ({ data }) => {
  const { labels, values, colors } = _.reduce(
    data,
    (acc, [label, { color, total }]) => {
      acc.labels.push(label);
      acc.values.push(total);
      acc.colors.push(color);

      return acc;
    },
    { labels: [], values: [], colors: [] }
  );

  return (
    <div>
      <Pie
        height={320}
        // width={200}
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

export { SubCategoryBreakdown, MonthlyBreakdown };
