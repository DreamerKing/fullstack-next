import React from "react";
import { Formik, Form } from "formik";
import { Button, Link, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { Wrapper } from "../components/Wrapper";
import { InputFiled } from "../components/InputFiled";
// import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "../utils/createUrqlClient";

interface loginProps {}

const Login: React.FC<loginProps> = ({ values, handleChange }) => {
  const [, login] = useLoginMutation();
  const route = useRouter();
  console.log(route, "route");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login?.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof route.query.next === "string") {
              route.push(route.query.next);
            } else {
              route.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled
              name="usernameOrEmail"
              placeholder="Username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputFiled
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml={"auto"}>forgot password</Link>
              </NextLink>
            </Flex>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              variant="outline"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
