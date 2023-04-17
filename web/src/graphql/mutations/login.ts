import { gql } from "urql";
import { RegularUserFragment } from "../fragments/RegularUser";

export const loginMutation = gql`
  ${RegularUserFragment}
  mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
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

// alternative way:
/*

export const loginMutation = gql`
  mutation login($username: String!, $password: String!) {
    login(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;


*/
