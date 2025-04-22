// components/AuthGuard.tsx
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authcontext";

interface Props {
  children: ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // once we know we're not loading, if there's no session token, redirect
    if (!isLoading && !isSignedIn) {
      router.replace("/login");
    }
  }, [isLoading, isSignedIn, router]);

  // while checking or redirecting, don’t flash the protected UI
  if (isLoading || !isSignedIn) {
    return <div>Loading…</div>;
  }

  return <>{children}</>;
};
