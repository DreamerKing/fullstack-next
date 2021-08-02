import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import createUrqlClient from "src/utils/createUrqlClient";
import { Provider } from "urql";
import theme from "../theme";

// const client = createUrqlClient();

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
