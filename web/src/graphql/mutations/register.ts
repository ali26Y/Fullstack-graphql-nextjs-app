import { gql } from "urql";
import { RegularUserFragment } from "../fragments/RegularUser";

export const registerMutation = gql`
  ${RegularUserFragment}
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        ...RegularUser
      }
    }
  }
`;
