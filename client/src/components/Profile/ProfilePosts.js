import axios from "axios";
import React, { useEffect, useState } from "react";

const ProfilePosts = () => {
  const [posts, setPosts] = useState(null);
  const view = posts?.length === 0 ? true : false;

  const myPosts = async () => {
    try {
      const response = await axios.get("/api/posts/my-posts", {
        withCredentials: true,
      });

      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myPosts();
  }, []);

  return (
    <div className="mt-2 grid grid-cols-3 gap-1">
      {view ? (
        <></>
      ) : (
        posts &&
        posts.map((item, index) => (
          <div
            key={index}
            className="xs:h-32 w-[100%] border border-[#252525] sm:h-36 md:h-48 lg:h-48"
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
