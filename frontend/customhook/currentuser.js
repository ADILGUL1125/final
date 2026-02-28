import { useEffect } from "react";
import { useAuthStore } from "../zustand/auth";

const useCurrentUser = () => {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("https://final-git-main-adilgul1125s-projects.vercel.app/api/currentuser", {
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

