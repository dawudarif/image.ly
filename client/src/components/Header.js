import { MdOutlineHome } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
  const size = 30;
  const navigate = useNavigate();
  const state = useSelector((store) => store.account.userProfile);

  const logoutUser = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      if (response) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-8 border-b border-[#252525] bg-black py-4">
      <h1 className="absolute left-6 block font-mono text-[1.5rem] font-semibold text-white xs:hidden">
        Image.ly
      </h1>

      {state ? (
        <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "rounded-lg bg-[#252525] p-1" : "p-1"
            }
          >
            <MdOutlineHome size={size + 6} color="white" />
          </NavLink>
          <NavLink
            to="/new-post"
            className={({ isActive }) =>
              isActive ? "rounded-lg bg-[#252525] p-2 " : "p-2"
            }
          >
            <FiPaperclip size={size} color="white" />
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "rounded-lg bg-[#252525] p-2" : "p-2"
            }
          >
            <FiUser size={size} color="white" />
          </NavLink>
          <div onClick={() => logoutUser()}>
            <IoLogOutOutline size={size} color="white" />
          </div>
        </>
      ) : (
        <NavLink
          to="/login"
          className="font-mono text-[1.1rem] font-bold text-white"
        >
          login / register
        </NavLink>
      )}
    </div>
  );
};

export default Header;
