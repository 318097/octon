import { gql } from "@apollo/client";

const CREATE_TASK = gql`
  mutation createTask($input: CreateTaskInput!) {
    octon {
      createTask(input: $input) {
        _id
      }
    }
  }
`;

const STAMP_TASK = gql`
  mutation stampTask($input: StampTaskInput!) {
    octon {
      stampTask(input: $input) {
        _id
      }
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($input: TaskByIdInput!) {
    octon {
      deleteTask(input: $input) {
        _id
      }
    }
  }
`;

const CREATE_EXPENSE = gql`
  mutation createExpense($input: CreateExpenseInput!) {
    octon {
      createExpense(input: $input) {
        _id
      }
    }
  }
`;

const UPDATE_EXPENSE = gql`
  mutation updateExpense($input: UpdateExpenseInput!) {
    octon {
      updateExpense(input: $input) {
        _id
      }
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation deleteExpense($input: DeleteExpenseInput!) {
    octon {
      deleteExpense(input: $input) {
        _id
      }
    }
  }
`;

const TOGGLE_FAVORITE_EXPENSE = gql`
  mutation toggleFavoriteExpense($input: FavoriteExpenseInput!) {
    octon {
      toggleFavoriteExpense(input: $input) {
        _id
      }
    }
  }
`;

const CREATE_TIMELINE_POST = gql`
  mutation createTimelinePost($input: CreateTimelineInput!) {
    octon {
      createTimelinePost(input: $input) {
        _id
      }
    }
  }
`;

const UPDATE_TIMELINE_POST = gql`
  mutation updateTimelinePost($input: UpdateTimelineInput!) {
    octon {
      updateTimelinePost(input: $input) {
        _id
      }
    }
  }
`;

const DELETE_TIMELINE_POST = gql`
  mutation deleteTimelinePost($input: DeleteTimelineInput!) {
    octon {
      deleteTimelinePost(input: $input) {
        _id
      }
    }
  }
`;

export {
  CREATE_TASK,
  STAMP_TASK,
  DELETE_TASK,
  CREATE_EXPENSE,
  UPDATE_EXPENSE,
  DELETE_EXPENSE,
  TOGGLE_FAVORITE_EXPENSE,
  CREATE_TIMELINE_POST,
  UPDATE_TIMELINE_POST,
  DELETE_TIMELINE_POST,
};
