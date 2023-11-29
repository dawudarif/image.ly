import { useRef, useState } from 'react';
import { FaFileImage } from 'react-icons/fa';
import axios from 'axios';
import { FiPaperclip } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function UploadImage() {
  const navigate = useNavigate();

  const [image, setImage] = useState(undefined);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const fileInputRef = useRef(null);
  const [type, setType] = useState('');
  console.log(image?.size / 1024);

  const submitImage = async () => {
    try {
      setType('uploading...');

      const api = await axios.get(`/api/get-upload-url?type=${image?.type}`);
      const url = api.data.url;
      const key = api.data.key;

      await axios.put(url, image, {
        'Content-Type': image?.type,
      });

      const data = {
        media: key,
        mediaType: image?.type,
        text: caption,
      };

      await axios.post(`/api/create-post`, data);

      setType('media uploaded');

      navigate('/', { replace: true });
    } catch (error) {
      setType(error.message);
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className='flex justify-center items-center h-[100vh] bg-black text-white gap-6'>
      <div>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt='image1'
            className='h-[15rem] w-[15rem] shadow-sm shadow-white  border border-white rounded-md object-cover'
          />
        ) : (
          <div className='h-[15rem] w-[15rem] shadow-sm shadow-white  border border-white rounded-md flex justify-center items-center'>
            <FaFileImage size={30} />
          </div>
        )}
      </div>
      <div className='flex justify-center items-baseline gap-6 flex-col'>
        <pre>{type}</pre>
        <input
          type='file'
          accept='image/jpg'
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <div className='flex justify-center items-center'>
          <div className='mr-2 p-4 hover:bg-[#252525] transition-all duration-300 rounded-md'>
            <FiPaperclip
              onClick={() => fileInputRef.current.click()}
              color='white'
              size={25}
            />
          </div>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder='Caption'
            className='bg-black border border-white rounded-md text-white font-medium p-4 px-6'
          />
        </div>
        <button
          onClick={submitImage}
          className='bg-black border border-white rounded-md text-white font-bold p-4 px-32 hover:bg-white hover:text-black transition-colors duration-300'
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default UploadImage;
