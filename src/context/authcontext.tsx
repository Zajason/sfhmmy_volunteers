import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
  
  interface AuthContextType {
    isSignedIn: boolean;
    setIsSignedIn: (isSignedIn: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    // Check for token on initial load
    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        console.log("Initial auth check, token exists:", !!token);
        setIsSignedIn(!!token);
        setIsLoading(false);
      };
  
      checkAuth();
    }, []);
  
    const login = (token: string) => {
      console.log("Setting token in localStorage");
      localStorage.setItem("authToken", token);
      setIsSignedIn(true);
    };
  
    const logout = () => {
      console.log("Removing token from localStorage");
      localStorage.removeItem("authToken");
      setIsSignedIn(false);
    };
  
    return (
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, isLoading, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };