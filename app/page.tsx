"use client";

import Button from "@elements/Button";
import useAxiosAuth from "lib/hooks/useAxiosAuth";

import { useSession } from "next-auth/react";
import { useState } from "react";

const HomePage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState();
  const axiosAuth = useAxiosAuth();
  const fetchPost = async () => {
    const res = await axiosAuth.get("/api/v1/test/");
    setPosts(res.data);
  };
  return (
    <div>
      <Button onClick={fetchPost}>Get User Posts</Button>
      {posts && JSON.stringify(posts)}
    </div>
  );
};

export default HomePage;
