import { MdOutlineHome } from 'react-icons/md';
import { FiPaperclip } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const Header = () => {
  const size = 30;
  const state = useSelector((store) => store.account.userProfile);

  return (
    <div className='bg-black flex justify-center items-center py-6 gap-8 border-b border-[#252525] relative'>
      <h1 className='absolute left-6 font-semibold font-mono text-white text-[1.5rem]'>
        Image.ly
      </h1>
      <Link to='/'>
        <MdOutlineHome size={size + 6} color='white' />
      </Link>
      <Link to='/new-post'>
        <FiPaperclip size={size} color='white' />
      </Link>
      <Link to='/profile'>
        <FiUser size={size} color='white' />
      </Link>
      {state && (
        <div>
          <IoLogOutOutline size={size} color='white' />
        </div>
      )}
    </div>
  );
};

export default Header;
