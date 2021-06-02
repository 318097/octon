import { gql } from "@apollo/client";

const GET_ALL_TASKS = gql`
  query getAllTasks {
    atom {
      getAllTasks {
        _id
        content
      }
    }
  }
`;

export { GET_ALL_TASKS };
