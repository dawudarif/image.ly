import { MdOutlineHome } from 'react-icons/md';
import { FiPaperclip } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = () => {
  const size = 30;

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
    </div>
  );
};

export default Header;
