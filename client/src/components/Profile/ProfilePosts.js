import React, { useCallback, useRef, useState } from "react";
import useFetchProfilePosts from "../../hooks/useFetchProfilePosts";

const ProfilePosts = () => {
  const [page, setPage] = useState(1);
  const { posts, loading, error, fetchNew } = useFetchProfilePosts(page);

  const view = posts?.length === 0 ? true : false;

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

  return (
    <div className="mt-2 grid grid-cols-3 gap-1">
      {view ? (
        <></>
      ) : (
        posts &&
        posts.map((item, index) => (
          <div
            key={index}
            ref={index === posts.length - 1 ? lastElementRef : null}
            className="w-[100%] border border-[#252525] sm:h-36 md:h-48 lg:h-48 xs:h-32"
          >
            {posts &&
              (item.mediaType.split("/")[0] === "image" ? (
                <img
                  src={item.media}
                  alt={item.caption}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={item.media}
                  className="h-full w-full object-cover"
                  muted
                  // preload='none'
                />
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePosts;
