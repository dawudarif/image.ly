import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { TbDownload } from 'react-icons/tb';
import { useSelector } from 'react-redux';

const Home = () => {
  const state = useSelector((store) => store.account.userProfile);

  const [data, setData] = useState([]);

  const getData = async () => {
    const response = await axios.get('/api/posts/get-posts');
    // console.log(response);
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
            <div key={p.id} className='rounded-md border border-[#252525] p-0'>
              <div className='flex justify-start items-center p-2 gap-2'>
                <img
                  src={p.createdBy.imgUrl}
                  alt={p.createdBy.name}
                  className='rounded-[50%] h-8 w-8 border border-[#252525] object-cover'
                />
                <p className='font-sans text-white font-bold text-sm'>
                  {p.createdBy.username}
                </p>
              </div>
              {mediaType === 'image' ? (
                <img
                  src={p.media}
                  alt={p.id}
                  loading='lazy'
                  className='rounded-sm overflow-hidden min-h-[20rem] object-contain'
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
                  {p.createdBy.id === state.id && (
                    <MdDelete
                      color='white'
                      size={20}
                      onClick={() => deletePost(p.id)}
                    />
                  )}
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
