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

export { CREATE_TASK, STAMP_TASK };
