import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputFiled } from "../components/InputFiled";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const route = useRouter();
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, we sent you can email
            </Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputFiled
                  type="email"
                  name="email"
                  placeholder="email"
                  label="Email"
                />
              </Box>
              <Button
                type="submit"
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
                variant="outline"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
