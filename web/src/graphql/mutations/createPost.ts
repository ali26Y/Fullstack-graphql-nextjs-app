import { gql } from "urql";

export const CreatePostMutation = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      id
      createdAt
      updatedAt
      title
      text
      points
      creatorId
    }
  }

  input PostInput {
    title: String!
    text: String!
  }
`;
