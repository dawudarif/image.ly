import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { GrGallery } from 'react-icons/gr';
import { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfilePosts from '../components/Profile/ProfilePosts';

const Profile = () => {
  const state = useSelector((store) => store.account.userProfile);

  const [file, setFile] = useState(undefined);
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);

  const fetchImage = async () => {
    try {
      const response = await axios.get('/api/users/profile-pic', {
        withCredentials: true,
      });

      setProfilePic(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
        setProfilePic(previewUrl);
      }
      setText('media uploaded');

      // navigate('/', { replace: true });
    } catch (error) {
      setText(error.message);
      console.log(error);
    } finally {
      setPreviewUrl(undefined);
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

  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setText(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

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
        ) : profilePic ? (
          <img
            src={profilePic}
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
        <div className='border-b border-[#252525] text-white w-[100%] flex justify-around items-center p-4'>
          <GrGallery size={30} color='white' />
          <Link to='/new-post'>
            <FaPlus size={30} color='#252525' />
          </Link>
        </div>
        <ProfilePosts />
      </div>
    </div>
  );
};

export default Profile;
