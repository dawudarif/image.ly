import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Post from '../components/Home/Post';

const Home = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get('/api/posts/get-posts');
    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='bg-black min-h-[100vh] flex justify-center py-4'>
      <div className='w-[25rem] flex h-auto flex-col gap-4 mt-4'>
        {data.map((post) => (
          <Post
            key={post.id}
            post={post}
            data={data}
            setData={(items) => setData(items)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
