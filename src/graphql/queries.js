import { gql } from "@apollo/client";

const GET_ALL_TASKS = gql`
  query getAllTasks {
    octon {
      getAllTasks {
        _id
        content
        userId
        type
        status
        deadline
        createdAt
        completedOn
        stamps {
          _id
          message
          date
        }
      }
    }
  }
`;

const GET_EXPENSE_STATS = gql`
  query expenseStats {
    octon {
      expenseStats
    }
  }
`;

const GET_MONTHLY_EXPENSES = gql`
  query getExpensesByMonth($input: MonthlyExpensesInput!) {
    octon {
      getExpensesByMonth(input: $input) {
        _id
        amount
        message
        date
        expenseSubTypeId
        expenseTypeId
        expenseSourceId
        expenseAppId
        favorite
        excluded
      }
    }
  }
`;

const GET_TIMELINE = gql`
  query getTimeline($input: GetTimelineInput!) {
    octon {
      getTimeline(input: $input) {
        _id
        content
        date
        groupId
        createdAt
      }
    }
  }
`;

export { GET_ALL_TASKS, GET_MONTHLY_EXPENSES, GET_EXPENSE_STATS, GET_TIMELINE };
