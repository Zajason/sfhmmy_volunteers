// pages/_app.tsx
import '../globals.css';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showNavbar = router.pathname !== '/login';

  return (
    <ChakraProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
        {showNavbar && <Navbar />}
        <Component {...pageProps} />
    </ThemeProvider>
      </ChakraProvider>
  );
}

export default MyApp;