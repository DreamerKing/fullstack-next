import React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputFiled } from "../components/InputFiled";
// import { useMutation } from "urql";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "src/utils/withAopllo";
interface registerProps {
  // valuse:
}

const Register: React.FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const route = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "King", email: "", password: "123" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.register.user,
                },
              });
            },
          });
          console.log(response);
          if (response.data?.register?.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else {
            route.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiled
              name="username"
              placeholder="Username"
              label="Username"
            />
            <Box mt={4}>
              <InputFiled name="email" placeholder="Enail" label="Email" />
              <Box mt={4}></Box>
              <InputFiled
                type="password"
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="teal"
              variant="outline"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);
