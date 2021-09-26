import React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";

import { InputFiled } from "../../../components/InputFiled";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useRouter } from "next/router";
import { useGetIntId } from "src/utils/useGetIntId";
import { usePostQuery } from "src/generated/graphql";
import { withApollo } from "src/utils/withAopllo";

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();

  const { data, error, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          console.log(values, "ddd");

          await updatePost({ variables: { id: intId, ...values } });

          router.push("/");
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
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: true })(EditPost);
