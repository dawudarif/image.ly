import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ProfilePosts = () => {
  const [posts, setPosts] = useState(null);
  const view = posts?.length === 0 ? true : false;

  const myPosts = async () => {
    try {
      const response = await axios.get('/api/posts/my-posts', {
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
    <div className='grid grid-cols-3 gap-1 mt-2'>
      {view ? (
        <></>
      ) : (
        posts &&
        posts.map((item, index) => (
          <div key={index} className='h-48 w-[100%] border border-[#252525]'>
            {posts && (
              <img
                src={item.media}
                alt={item.caption}
                className='object-cover h-full w-full'
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePosts;
