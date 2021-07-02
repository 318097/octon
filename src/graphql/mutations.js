import { gql } from "@apollo/client";

const CREATE_TASK = gql`
  mutation createTask($input: CreateTaskInput!) {
    atom {
      createTask(input: $input) {
        _id
      }
    }
  }
`;

const STAMP_TASK = gql`
  mutation stampTask($input: StampTaskInput!) {
    atom {
      stampTask(input: $input) {
        _id
      }
    }
  }
`;

const CREATE_EXPENSE = gql`
  mutation createExpense($input: CreateExpenseInput!) {
    atom {
      createExpense(input: $input) {
        _id
      }
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation updateExpense($input: UpdateExpenseInput!) {
    atom {
      updateExpense(input: $input) {
        _id
      }
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation deleteExpense($input: DeleteExpenseInput!) {
    atom {
      deleteExpense(input: $input) {
        _id
      }
    }
  }
`;

export {
  CREATE_TASK,
  STAMP_TASK,
  CREATE_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
};
