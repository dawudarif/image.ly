import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { TbDownload } from 'react-icons/tb';

const Home = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get('/api/get-posts');
    setData(response.data);
  };

  const deletePost = async (id) => {
    const post = await axios.delete(`/api/delete-post/${id}`);

    const deleteId = post.data.id;

    if (deleteId) {
      const filteredPosts = data.filter((post) => deleteId !== post.id);

      setData(filteredPosts);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='bg-black min-h-[100vh] flex justify-center py-4'>
      <div className='w-[25rem] flex h-auto flex-col gap-4 mt-4'>
        {data.map((p) => {
          const mediaType = p.mediaType.split('/')[0];

          return (
            <div key={p.id} className='rounded-md border border-white p-0'>
              {mediaType === 'image' ? (
                <img
                  src={p.media}
                  alt={p.id}
                  loading='lazy'
                  className='rounded-sm overflow-hidden min-h-[20rem] object-cover'
                />
              ) : (
                <video
                  src={p.media}
                  autoPlay
                  controls
                  muted
                  autoplay
                  loop
                  controlsList='nodownload'
                  className='rounded-sm overflow-hidden min-h-[20rem] object-cover'
                />
              )}

              <div className='flex justify-between items-center mt-2 p-4'>
                <p className='text-white font-medium'>{p.caption}</p>
                <div className='flex justify-center items-center gap-2'>
                  <a
                    id='downloadLink'
                    href={p.media}
                    download='video_filename.mp4'
                  >
                    <TbDownload color='white' size={20} />
                  </a>
                  <MdDelete
                    color='white'
                    size={20}
                    onClick={() => deletePost(p.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
