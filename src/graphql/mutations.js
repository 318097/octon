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

export { CREATE_TASK };
