import StoreProvider from "../store/store-context";
import "../styles/globals.css";
import React from 'react'

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
