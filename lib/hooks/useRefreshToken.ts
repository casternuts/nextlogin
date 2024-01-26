"use client";

import axios from "lib/axios";
import { signIn, useSession } from "next-auth/react";

// export const useRefreshToken = () => {
//   const { data: session } = useSession();

//   const refreshToken = async () => {
//     const res = await axios.post("/auth/refresh", {
//       refresh: session?.user.refreshToken,
//     });
//     console.log("refresh::" + res);

//     if (session) session.user.access_token = res.data.accessToken;
//     else signIn();
//   };
//   return refreshToken;
// };

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const res = await axios.get("/api/v1/auth/refresh");
    console.log("refresh::" + res);
    //리프레시 토큰도 만료
    if (res.data.code == "4010001" || res.data.code == "4010002") {
      signIn();
    } else {
      //리프레시 토큰정상 갱신
      if (session) {
        session.user.access_token = res.data.access_token;
      } else {
        //세션이 없으면 로그인 페이지로 분기
        signIn();
      }
    }
  };
  return refreshToken;
};
