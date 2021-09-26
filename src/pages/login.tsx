import React from "react";
import { Formik, Form } from "formik";
import { Button, Link, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { Wrapper } from "../components/Wrapper";
import { InputFiled } from "../components/InputFiled";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "src/utils/withAopllo";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const [login] = useLoginMutation();
  const route = useRouter();
  console.log(route, "route");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts: {}" });
            },
          });
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

export default withApollo({ ssr: false })(Login);
