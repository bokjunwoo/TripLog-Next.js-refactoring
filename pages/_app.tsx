import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AppLayout from '@/components/layout/AppLayout';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} />
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
          </Head>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </Hydrate>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
