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
        stamps {
          _id
          message
          date
        }
      }
    }
  }
`;

export { GET_ALL_TASKS };
