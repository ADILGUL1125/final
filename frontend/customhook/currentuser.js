import { useEffect } from "react";
import { useAuthStore } from "../zustand/auth";

const useCurrentUser = () => {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/currentuser", {
          credentials: "include",
        });

        if (!response.ok) {
          logout();
          return;
        }

        const data = await response.json();
        setUser(data?.user || data || null);
      } catch {
        logout();
      }
    };

    fetchCurrentUser();
  }, [setUser, logout]);
};

export default useCurrentUser;
