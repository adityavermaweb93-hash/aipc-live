import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ConferenceProvider } from '@/context/ConferenceContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConferenceProvider initialData={pageProps.initialData}>
      <Head>
        <title>AIPC – All India Pastors’ Conference</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="All India Pastors' Conference" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ConferenceProvider>
  );
}
