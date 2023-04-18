import { gql } from "urql";
import { RegularUserResponse } from "../fragments/RegularUserResponse";

export const changePasswordMutation = gql`
  ${RegularUserResponse}
  mutation changePassword($newPassword: String!, $token: String!) {
    changePassword(newPassword: $newPassword, token: $token) {
      ...RegularUserResponse
    }
  }
`;
