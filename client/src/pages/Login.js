import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Ring from "../components/loading/ring";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = { email, password };
    const req = await axios.post("/api/users/auth", body, {
      withCredentials: true,
    });

    if (req.status >= 200 && req.status <= 299) {
      setLoading(false);
      window.location.href = "/";
    } else {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-[100vh] justify-center bg-black py-4">
      <form className="flex w-[30%] flex-col items-center justify-center gap-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter email"
          className="w-[100%] rounded-md border border-white bg-black p-4 px-6 font-medium text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
          className="w-[100%] rounded-md border border-white bg-black p-4 px-6 font-medium text-white"
        />
        <p className="font-mono text-white">{error}</p>
        <button
          onClick={loginUser}
          className={`rounded-md border border-white bg-black p-4 px-32 font-bold text-white ${
            !loading && "hover:bg-white hover:text-black"
          } w-[100%] transition-colors duration-300`}
          disabled={loading}
        >
          {loading ? <Ring size={22} /> : <>Login</>}
        </button>
        <Link to="/register" className="italic text-white hover:underline">
          New to Image.ly? Register here.
        </Link>
      </form>
    </div>
  );
};

export default Login;
