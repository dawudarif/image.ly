import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Ring from '../components/loading/ring';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = { email, password };
    const req = await axios.post('/api/users/auth', body, {
      withCredentials: true,
    });
    setLoading(false);
    window.location.href = '/';
  };

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
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='enter password'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />
        <p className='text-white font-mono'>{error}</p>
        <button
          onClick={loginUser}
          className={`bg-black border border-white rounded-md text-white font-bold p-4 px-32 ${
            !loading && 'hover:bg-white hover:text-black'
          } transition-colors duration-300 w-[100%]`}
          disabled={loading}
        >
          {loading ? <Ring size={22} /> : <>Login</>}
        </button>
        <Link to='/register' className='text-white hover:underline italic'>
          New to Image.ly? Register here.
        </Link>
      </form>
    </div>
  );
};

export default Login;
