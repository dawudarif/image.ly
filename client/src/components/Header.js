import { MdOutlineHome } from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
  const size = 30;
  const state = useSelector((store) => store.account.userProfile);

  const logoutUser = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      if (response) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-8 border-b border-[#252525] bg-black py-6">
      <h1 className="xs:hidden absolute left-6 block font-mono text-[1.5rem] font-semibold text-white">
        Image.ly
      </h1>
      <Link to="/">
        <MdOutlineHome size={size + 6} color="white" />
      </Link>
      <Link to="/new-post">
        <FiPaperclip size={size} color="white" />
      </Link>
      <Link to="/profile">
        <FiUser size={size} color="white" />
      </Link>
      {state && (
        <div onClick={() => logoutUser()}>
          <IoLogOutOutline size={size} color="white" />
        </div>
      )}
    </div>
  );
};

export default Header;
