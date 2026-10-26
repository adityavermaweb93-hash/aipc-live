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
        <link rel="icon" href="/assets/EIC_Favicon.png" />
      </Head>
      <Component {...pageProps} />
    </ConferenceProvider>
  );
}
