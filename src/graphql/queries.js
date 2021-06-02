import { gql } from "@apollo/client";

const GET_ALL_TASKS = gql`
  query getAllTasks {
    atom {
      getAllTasks {
        _id
        content
        userId
        type
        deadline
        createdAt
        completedOn
      }
    }
  }
`;

export { GET_ALL_TASKS };
