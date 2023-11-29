import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const body = { email, password, username, name };
      const response = await axios.post('/api/users/register', body, {
        withCredentials: true,
      });

      console.log(response);

      if (response.status !== 201) {
        setError(response.data);
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className='bg-black min-h-[100vh] flex justify-center py-12'>
      <form className='flex  items-center flex-col gap-6 w-[30%]'>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='enter name'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />
        <input
          type='text'
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          placeholder='@username'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />
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
        <input
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='confirm password'
          className='bg-black border border-white rounded-md text-white font-medium p-4 px-6 w-[100%]'
        />
        <p className='text-white font-mono'>{error}</p>
        <button
          onClick={registerUser}
          className='bg-black border border-white rounded-md text-white font-bold p-4 px-32 hover:bg-white hover:text-black transition-colors duration-300 w-[100%]'
        >
          Register
        </button>
        <Link to='/login' className='text-white hover:underline italic'>
          Already a user? Login here.
        </Link>
      </form>
    </div>
  );
};

export default Register;
