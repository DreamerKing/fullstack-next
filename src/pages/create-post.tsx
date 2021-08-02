import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Link, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { isServer } from '../utils/isServer'

import { toErrorMap } from "src/utils/toErrorMap";
import { withUrqlClient } from "next-Urql";
import { InputFiled } from "../components/InputFiled";
import { Layout } from "../components/Layout";
import createUrqlClient from "src/utils/createUrqlClient";
import { useCreatePostMutation, useMeQuery } from "src/generated/graphql";
import { useRouter } from "next/router";
import { useIsAuth } from '../utils/useIsAuth';

export const CreatePost: React.FC<{}> = ({}) => {
//   const [{ data, fetching }] = useMeQuery({ pause: isServer() });
    const router = useRouter();
    useIsAuth();
//   useEffect(() => {
//     if (!fetching && !data?.me) {
//       router.replace("/login");
//     }
//   }, [data, router, fetching]);
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const { error } = await createPost({ input: values });
          if (error) {
            router.push("/login");
            console.log(error);
            // setErrors(error);
          } else {
            router.push("/");
          }
          /*   const response = await login({ options: values });
            // console.log(response);
            if (response.data?.login?.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else {
              route.push("/");
            } */
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputFiled
                textarea
                type="text"
                name="text"
                placeholder="content"
                label="Body"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              variant="outline"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
