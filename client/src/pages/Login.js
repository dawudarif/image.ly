import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='bg-black min-h-[100vh] flex justify-center py-4'>
      <form className='flex justify-center items-center flex-col gap-6 w-[30%]'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='enter email'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />
        <input
          type='email'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='enter password'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />

        <button
          // onClick={submitImage}
          className='bg-black border border-white rounded-md text-white font-bold p-4 px-32 hover:bg-white hover:text-black transition-colors duration-300 w-[100%]'
        >
          Login
        </button>
        <Link to='/register' className='text-white hover:underline italic'>
          New to Image.ly? Register here.
        </Link>
      </form>
    </div>
  );
};

export default Login;
