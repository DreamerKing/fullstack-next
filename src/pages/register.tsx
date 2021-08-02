import React from "react";
import { Formik, Form } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputFiled } from '../components/InputFiled';
// import { useMutation } from "urql";
import { useRegisterMutation} from '../generated/graphql';
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "../utils/createUrqlClient";
interface registerProps {
  // valuse:
};

const Register: React.FC<registerProps> = ({ values, handleChange }) => {
    const [, register ] = useRegisterMutation();
    const route = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "King", email: "", password: "123"}}
        onSubmit={ async (values, { setErrors}) => {
            console.log(values);
            const response = await register(values);
            console.log(response);
            if(response.data?.register?.errors) {
                setErrors(toErrorMap(response.data.register.errors));
            } else {
                route.push('/');
            }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
              <InputFiled name="username" placeholder="Username" label="Username"/>
            <Box mt={4}>
              <InputFiled name="email" placeholder="Enail" label="Email"/>
              <Box mt={4}></Box>
              <InputFiled type="password" name="password" placeholder="password" label="Password"/>
              </Box>
              <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" variant="outline">register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
