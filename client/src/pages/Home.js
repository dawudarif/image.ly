import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "../components/Home/Post";

const Home = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get("/api/posts/get-posts");
    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex min-h-[100vh] justify-center bg-black py-4">
      <div className="mt-4 flex h-auto w-[30rem] flex-col gap-4 xs:w-[98vw]">
        {data.length === 0 ? (
          <div className="text-center font-mono text-[1.2rem] text-white">
            No Posts
          </div>
        ) : (
          data.map((post) => (
            <div key={post.id}>
              <Post
                post={post}
                data={data}
                setData={(items) => setData(items)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
