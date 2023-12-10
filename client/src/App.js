import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { fetchUserProfile } from "./features/account";
import "./index.css";
import Ring from "./components/loading/ring";

const Home = React.lazy(() => import("./pages/Home"));
const UploadImage = React.lazy(() => import("./pages/Upload"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Profile = React.lazy(() => import("./pages/Profile"));

const Fallback = () => (
  <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 bg-black">
    <Ring size={50} />
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  const state = useSelector((store) => store.account.userProfile);

  if (!state) {
    <div className="h-[100vh] bg-black"></div>;
  }

  return (
    <>
      <Header />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/new-post" element={<UploadImage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
