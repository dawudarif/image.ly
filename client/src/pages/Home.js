import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "../components/Home/Post";
import { IoRefreshSharp } from "react-icons/io5";
import Ring from "../components/loading/ring";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/posts/get-posts");
      if (response.status >= 200 && response.status <= 299) {
        setData(response.data);
      } else {
        throw new error();
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshFeed = () => {
    setError(false);
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading || error) {
    return (
      <div className="flex min-h-[100vh] items-center justify-center bg-black">
        {loading ? (
          <Ring size={50} color="white" />
        ) : (
          error && (
            <div className="flex w-[100%] flex-col items-center justify-center">
              <h4 className="font-mono text-white">
                "Something went wrong, try again later"
              </h4>
              <div
                className="w-max rounded-md p-4 transition-all duration-300 hover:bg-[#252525]"
                onClick={() => refreshFeed()}
              >
                <IoRefreshSharp size={30} color="white" />
              </div>
            </div>
          )
        )}
      </div>
    );
  }

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
