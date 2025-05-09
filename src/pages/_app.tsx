// pages/_app.tsx
import "../globals.css";
import { ThemeProvider } from "../utils/ThemeContext"
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import { AuthProvider } from "../context/authcontext";
import { AuthGuard } from "../components/AuthGuard";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname;

  // list all the pages that should NOT require login:
  const publicRoutes = ["/login"];
  const isPublic = publicRoutes.includes(path);

  return (
    <ChakraProvider>
      <ThemeProvider>
        <AuthProvider>
          {path !== "/login" && <Navbar />}

          {isPublic ? (
            <Component {...pageProps} />
          ) : (
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          )}
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
