"use client";

import { useUser } from "@/providers/AuthProvider";

const Home = () => {
  const { myUser } = useUser();
  return (
    <div>
      <div>HELLO</div>
      {myUser?.email}
    </div>
  );
};
export default Home;
