import { FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { GrGallery } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { Link } from "react-router-dom";
import ProfilePosts from "../components/Profile/ProfilePosts";
import Ring from "../components/loading/ring";

const Profile = () => {
  const state = useSelector((store) => store.account.userProfile);

  const [file, setFile] = useState(undefined);
  const [previewUrl, setPreviewUrl] = useState(undefined);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    try {
      const response = await axios.get("/api/users/profile-pic", {
        withCredentials: true,
      });

      setProfilePic(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitImage = async () => {
    setLoading(true);
    try {
      setText("uploading...");

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.put("/api/users/update-user", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setProfilePic(previewUrl);
      }
      setText("media uploaded");
    } catch (error) {
      setText(error.message);
      console.log(error);
    } finally {
      setPreviewUrl(undefined);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    const size = file?.size / (1024 * 1024);
    if (size > 3) {
      setText("File should be smaller than 3Mbs");
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
    <div className="xs:px-4 flex min-h-[100vh] w-[100%] flex-col items-center bg-black py-4">
      <p className="font-mono text-white">{text}</p>
      <div className="xs:w-full  mt-10 flex justify-between sm:w-[80%] md:w-[50%] lg:w-[40%]">
        <div className="text-white">
          <h4 className="font-sans text-lg font-semibold">{state.name}</h4>
          <h6 className="font-sans text-base font-semibold italic">
            @{state.username}
          </h6>
        </div>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="new"
              onDoubleClick={() => fileInputRef.current.click()}
              className="h-24 w-24 rounded-[50%] border border-[#252525] object-cover"
            />
          </>
        ) : profilePic ? (
          <img
            src={profilePic}
            alt={state.name}
            onDoubleClick={() => fileInputRef.current.click()}
            className="h-24 w-24 rounded-[50%] border border-[#252525] object-cover"
          />
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-[50%] border border-[#252525]"
            onDoubleClick={() => fileInputRef.current.click()}
          >
            <FiUser size={35} color="#252525" />
          </div>
        )}
      </div>
      {previewUrl && (
        <div className="xs:w-full mt-6 flex h-10 items-end  justify-center gap-4 sm:w-[80%] md:w-[50%] lg:w-[40%]">
          <button
            onClick={submitImage}
            className={`rounded-md border border-white bg-black p-2 font-bold text-white ${
              !loading && "hover:bg-white hover:text-black"
            } h-10 w-[45%] transition-colors duration-300`}
            disabled={loading}
          >
            {loading ? <Ring size={18} /> : <> Update </>}
          </button>

          <button
            className="mt-10 w-[45%] rounded-md border border-white bg-white p-2 font-bold text-black transition-colors duration-300 hover:bg-black hover:text-white"
            onClick={() => setPreviewUrl(undefined)}
          >
            Cancel
          </button>
        </div>
      )}
      <div className="xs:w-full mt-[5rem] sm:w-[80%] md:w-[50%] lg:w-[40%]">
        <div className="flex w-[100%] items-center justify-around border-b border-[#252525] p-4 text-white">
          <GrGallery size={30} color="white" />
          <Link to="/new-post">
            <FaPlus size={30} color="#252525" />
          </Link>
        </div>
        <ProfilePosts />
      </div>
    </div>
  );
};

export default Profile;
