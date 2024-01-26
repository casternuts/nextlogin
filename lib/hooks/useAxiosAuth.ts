"use client";
import { axiosAuth } from "lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        console.log(prevRequest);
        console.log("access토큰 만료::");
        if (error.response.data.code == "4010001") {
          prevRequest.sent = true;
          await refreshToken();
          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${session?.user.access_token}`;
          return axiosAuth(prevRequest);
        }
        // if (error?.response?.status === 401 && !prevRequest?.sent) {
        //   prevRequest.sent = true;
        //   await refreshToken();
        //   prevRequest.headers[
        //     "Authorization"
        //   ] = `Bearer ${session?.user.access_token}`;
        //   return axiosAuth(prevRequest);
        // }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;