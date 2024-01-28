import { defineStore } from "pinia";
import type { User, jwt, login } from "~/types";

export const useUserStore = defineStore("user", () => {
  const user = ref();
  const userId = useCookie("userId", {
    maxAge: 60 * 60,
  });
  const token = useCookie("jwt", {
    maxAge: 60 * 60,
  });
  const apiErrors = ref();

  const setToken = (data?: string) => (token.value = data);
  const setUser = (data?: any) => (user.value = data);
  const setUserId = (data?: string) => (userId.value = data);
  const setApiErrors = (data?: string | null) => (apiErrors.value = data);

  const login = async (data: login) => {
    try {
      const res = await $fetch<jwt>("http://localhost:3333/auth/login", {
        method: "POST",
        body: data,
      });

      if (res) {
        // Successful HTTP request
        setToken(res.accessToken);
        setUserId(res.userId.toString());
        console.log(res);
        await fetchUser();
      } else {
        // HTTP request failed
        console.log("Login failed");
        setToken();
        setUser();
        setApiErrors("Login failed");
      }
    } catch (error) {
      // Other errors (e.g., network issues)
      console.log(error);
      setToken();
      setUser();
      setApiErrors(
        (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      );
    }
  };

  const logout =  () => {
    setToken();
    setUser(null);
    setUserId();
    setApiErrors(null);
  };

  const fetchUser = async () => {
    if (token.value) {
      try {
        const res = await $fetch<User>(
          `http://localhost:3333/users/${userId.value}`,
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );
        setUser(res);
        console.log(res);
      } catch (error) {
        setUser();
        console.log(error);
        setApiErrors(
          (error as Error).message.split(":")[3]?.trim() || "Unknown error"
        );
      }
    }
  };

  return {
    userId,
    user,
    apiErrors,
    token,
    setToken,
    setUser,
    login,
    logout,
    fetchUser,
  };
});
