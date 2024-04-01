import { defineStore } from "pinia";
import type { Signup, User, jwt, login } from "~/types";

export const useUserStore = defineStore("user", () => {
  const useModel = useMyModalErrorStore();
  const user = ref<User>();
  const userId = useCookie("userId", {
    maxAge: 86400, //1d
  });
  const token = useCookie("jwt", {
    maxAge: 86400,
  });
  const apiErrors = ref();

  // console.log("Token in useUserStore:", token.value);
  const setToken = (data?: any) => (token.value = data);
  const setUser = (data?: any) => (user.value = data);
  const setUserId = (data?: any) => (userId.value = data);
  const setApiErrors = (data?: string | null) => (apiErrors.value = data);

  const signup = async (data: Signup) => {
    console.table(data);
    try {
      const res = await $fetch<any>("http://192.168.31.170:3333/users/create", {
        method: "post",
        body: data,
      });
      console.log(res);
      if (res.HttpStatus === 201) {
        useModel.setModalValues(
          true,
          "Account Created Successfully",
          `your new account ${res.create.email} is ready to use `
        );
      }
    } catch (error: any) {
      console.log(error);
      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  const login = async (data: login) => {
    console.log(data);
    try {
      const res = await $fetch<jwt>("http://192.168.31.170:3333/auth/login", {
        method: "POST",
        body: data,
      });

      if (res) {
        // Successful HTTP request
        await setToken(res.accessToken);
        await setUserId(res.userId);
        // console.table(res);
        console.table({ token: token.value, userId: userId.value });
        await fetchUser();
      } else {
        // HTTP request failed
        console.log("Login failed");
        setToken();
        setUser();
        setApiErrors("Login failed");
      }
    } catch (error: any) {
      // Other errors (e.g., network issues)
      console.log(error);
      setToken();
      setUser();
      setApiErrors(error.response._data.message)
      // setApiErrors(
      //   (error as Error).message.split(":")[3]?.trim() || "Unknown error"
      // );

      useModel.setModalValues(
        true,
        error.response.statusText + " " + error.response._data.statusCode,
        JSON.stringify(error.response._data.message, null, 2)
      );
    }
  };

  const test = ref("aaaaaaaaaaaaaaaaa");
  const logout = () => {
    setToken();
    setUser(null);
    setUserId();
    setApiErrors(null);
  };

  const fetchUser = async () => {
    if (token.value) {
      try {
        const res = await $fetch<User>(
          `http://192.168.31.170:3333/users/${userId.value}`,
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
    test,
    setToken,
    setUser,
    signup,
    login,
    logout,
    fetchUser,
  };
});
