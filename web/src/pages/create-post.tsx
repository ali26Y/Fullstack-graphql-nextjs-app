import React from "react";
import { Wrapper } from "../components/Wrapper";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";

import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { CreatePostMutation } from "../graphql/mutations/createPost";
import { useMutation } from "urql";
import { useRouter } from "next/router";

export const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, createPost] = useMutation(CreatePostMutation);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log(values);
          await createPost({ input: values });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt="4">
              <InputField
                textArea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Box mt="4">
              <Button
                type="submit"
                backgroundColor="teal"
                color="white"
                isLoading={isSubmitting}
              >
                create post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
