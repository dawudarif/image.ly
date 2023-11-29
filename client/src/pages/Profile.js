import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Profile = () => {
  const state = useSelector((store) => store.account.userProfile);

  const myPosts = async () => {};

  if (!state) return;

  return (
    <div className='bg-black min-h-[100vh] w-[100%] py-4 flex items-center flex-col'>
      <div className='flex justify-between mt-10 w-[40%]'>
        <div className='text-white'>
          <h4 className='text-lg font-sans font-semibold'>{state.name}</h4>
          <h6 className='text-base font-sans font-semibold italic'>
            @{state.username}
          </h6>
        </div>
        {state.image ? (
          <img src={state.image} alt={state.name} />
        ) : (
          <div className='rounded-[50%] border border-[#252525] h-24 w-24 flex justify-center items-center'>
            <FiUser size={35} color='#252525' />
          </div>
        )}
      </div>
      <div>
        <div className='w-[40%] mt-[5rem] border-b border-[#252525]'>
          <div className='border-b border-[#252525] text-white w-[100%]'>
            <p>Feed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
