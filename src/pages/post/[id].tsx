import React from "react";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "src/utils/createUrqlClient";
import { Layout } from "src/components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "src/utils/useGetPostFromUrl";
import EditDeletePostButtons from "src/components/EditDeletePostButtons";
import { withApollo } from "src/utils/withAopllo";

export const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();

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
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      <Box mb={4}>{data?.post?.text}</Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post?.creator?.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
