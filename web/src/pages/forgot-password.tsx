import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useMutation } from "urql";
import { forgotPasswordMutation } from "../graphql/mutations/forgotPassword";

export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useMutation(forgotPasswordMutation);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Box mt="4">
                <Button
                  type="submit"
                  backgroundColor="teal"
                  color="white"
                  isLoading={isSubmitting}
                >
                  Forgot Password
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
