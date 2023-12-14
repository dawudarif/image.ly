import React, { useCallback, useRef, useState } from "react";
import { IoRefreshSharp } from "react-icons/io5";
import Post from "../components/Home/Post";
import Ring from "../components/loading/ring";
import useFetchData from "../hooks/useFetchData";

const Home = () => {
  const [page, setPage] = useState(1);

  const { data, loading, postLoading, error, fetchNew, setData } =
    useFetchData(page);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && fetchNew) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, fetchNew],
  );

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
                onClick={() => (window.location.href = "/")}
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
    <div className="flex h-max justify-center bg-black py-4">
      <div className="mt-4 flex h-max w-[30rem] flex-col gap-4 xs:w-[98vw]">
        {data.length === 0 ? (
          <div className="text-center font-mono text-[1.2rem] text-white">
            No Posts
          </div>
        ) : (
          <>
            {data.map((post, index) => {
              return (
                <div
                  key={post.id}
                  ref={index === data.length - 1 ? lastElementRef : null}
                >
                  <Post
                    post={post}
                    data={data}
                    setData={(items) => setData(items)}
                  />
                </div>
              );
            })}
            {postLoading && (
              <div className="flex w-full items-center justify-center p-4">
                <Ring size={50} color="white" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
