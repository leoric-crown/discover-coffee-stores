import Document, { Html, Head, Main, NextScript } from "next/document";
import React from 'react'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <meta charSet="UTF-8"></meta>
        <meta name="description" content="A project based on Next.js Zero to Mastery course on Udemy"/>
        <Head>
          <link
            rel="preload"
            href="/fonts/Pacifico-Regular.ttf"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-Regular.ttf"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-Bold.ttf"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/IBMPlexSans-SemiBold.ttf"
            as="font"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
