import { gql } from "urql";
import { RegularUserFragment } from "../fragments/RegularUser";
import { RegularErrorFragment } from "../fragments/RegularError";

export const RegularUserResponse = gql`
  ${RegularUserFragment}
  ${RegularErrorFragment}
  fragment RegularUserResponse on UserResponse {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
`;
