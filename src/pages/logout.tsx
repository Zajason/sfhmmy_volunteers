import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authcontext";

const Logout: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Clear user session through the AuthContext's logout method
    logout();
    // Redirect to the login page using Next.js router
    router.push("/login");
  }, [router, logout]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;