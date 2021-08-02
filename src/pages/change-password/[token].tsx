import { NextPage } from "next";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Link, Box } from "@chakra-ui/react";
import { Wrapper } from "../../components/Wrapper";
import { InputFiled } from "../../components/InputFiled";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-Urql";
import NextLink from "next/link";
import createUrqlClient from "../../utils/createUrqlClient";

const ChangePassword: NextPage/* <{ token: string }> */ = (/* { token } */) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: typeof router.query.token === "string" ? router.query.token: '',
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {tokenError && (
              <Box>
                <Box color="red" mr={4}>{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>go forget it again</Link>
                </NextLink>
              </Box>
            )}
            {/* <Box mt={4}>
              <InputFiled
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box> */}
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              variant="outline"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

/* ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
}; */

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
