import { gql } from "urql";

export const postsQuery = gql`
  query posts {
    posts {
      id
      title
      createdAt
      updatedAt
    }
  }
`;
