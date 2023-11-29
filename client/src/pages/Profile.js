import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { GrGallery } from 'react-icons/gr';
import { useRef, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const state = useSelector((store) => store.account.userProfile);

  const [file, setFile] = useState(undefined);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);

  const myPosts = async () => {};

  const submitImage = async () => {
    try {
      setText('uploading...');

      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.put('/api/users/update-user', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log(response);
      }

      setText('media uploaded');

      // navigate('/', { replace: true });
    } catch (error) {
      setText(error.message);
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    const size = file?.size / (1024 * 1024);
    if (size > 3) {
      setText('File should be smaller than 3Mbs');
      setFile(undefined);
    } else {
      setFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  if (!state) return;

  return (
    <div className='bg-black min-h-[100vh] w-[100%] py-4 flex items-center flex-col'>
      <p className='text-white font-mono'>{text}</p>
      <div className='flex justify-between mt-10 w-[40%]'>
        <div className='text-white'>
          <h4 className='text-lg font-sans font-semibold'>{state.name}</h4>
          <h6 className='text-base font-sans font-semibold italic'>
            @{state.username}
          </h6>
        </div>
        <input
          type='file'
          accept='image/jpg'
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt='new'
              onDoubleClick={() => fileInputRef.current.click()}
              className='rounded-[50%] border border-[#252525] h-24 w-24 object-cover'
            />
          </>
        ) : state.image ? (
          <img
            src={state.image}
            alt={state.name}
            onDoubleClick={() => fileInputRef.current.click()}
            className='rounded-[50%] border border-[#252525] h-24 w-24 object-cover'
          />
        ) : (
          <div
            className='rounded-[50%] border border-[#252525] h-24 w-24 flex justify-center items-center'
            onDoubleClick={() => fileInputRef.current.click()}
          >
            <FiUser size={35} color='#252525' />
          </div>
        )}
      </div>
      {previewUrl && (
        <div className='flex w-[40%] gap-4'>
          <button
            className='bg-black border border-white rounded-md text-white font-bold p-2 hover:bg-white hover:text-black transition-colors duration-300 mt-10 w-[45%]'
            onClick={submitImage}
          >
            Update
          </button>
          <button
            className='bg-white border border-white rounded-md text-black font-bold p-2 hover:bg-black hover:text-white transition-colors duration-300 mt-10 w-[45%]'
            onClick={() => setPreviewUrl(undefined)}
          >
            Cancel
          </button>
        </div>
      )}
      <div className='w-[40%] mt-[5rem]'>
        <div className='border-b border-[#252525] text-white w-[100%] flex justify-center items-center gap-6 p-4'>
          <GrGallery size={30} color='#252525' />
        </div>
      </div>
    </div>
  );
};

export default Profile;
