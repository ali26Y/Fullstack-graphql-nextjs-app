import { gql } from "urql";
import { RegularUserResponse } from "../fragments/RegularUserResponse";

export const loginMutation = gql`
  ${RegularUserResponse}
  mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      ...RegularUserResponse
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
