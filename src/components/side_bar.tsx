import {
  FaUser,
  FaUsers,
  FaFileAlt,
  FaSignOutAlt,
  FaArrowRight,
  FaArrowLeft,
  FaVideo,
} from "react-icons/fa";
import Link from "next/link";
import { success, throwError, useSetState } from "@/helper";
import LogoutModal from "./logout_modal";
import axios from "axios";
import router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { clearUserData } from "@/store/userSlice";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const userData = useSelector((state: RootState) => state.user.userData);
  const dispatch: AppDispatch = useDispatch();
  const [logout, setLogout] = useSetState({
    modalOpen: false,
  });
  const handleLogout = async () => {
    try {
      const response = await axios.post("api/logout");
      if (response.status == 200) {
        success(response.data.message);
        setLogout({ modalOpen: false });
        dispatch(clearUserData());

        router.push("/login");
      }
    } catch (error) {
      throwError("Logout failed, Try again");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white transition-transform transform ${
          isOpen ? "w-48" : "w-20"
        } z-10`}
      >
        <div className="flex items-center justify-between p-4 bg-gray-900">
          <h1
            className={`text-xl font-bold transition-all ${
              isOpen ? "block" : "hidden"
            }`}
          >
            Prompt Editor
          </h1>
          <h1
            className={`text-xl font-bold transition-all ${
              isOpen ? "hidden" : "block"
            }`}
          >
            PE
          </h1>
          <button onClick={toggleSidebar} className="text-white">
            {isOpen ? <FaArrowLeft size={15} /> : <FaArrowRight size={15} />}
          </button>
        </div>
        <nav className="flex flex-col space-y-4 mt-4">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FaUser className="mr-3" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Profile</span>
          </Link>
          {userData?.role_name === "super_admin" && (
            <Link
              href="/users"
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FaUsers className="mr-3" />
              <span className={`${isOpen ? "block" : "hidden"}`}>Users</span>
            </Link>
          )}
          <Link
            href="/projects"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FaFileAlt className="mr-3" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Script</span>
          </Link>
          <Link
            href="/projects?page=outline"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FaVideo className="mr-3" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Outline</span>
          </Link>
          <button
            onClick={() => setLogout({ modalOpen: true })}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
          </button>
        </nav>
      </div>
      {logout.modalOpen && (
        <LogoutModal
          open={logout.modalOpen}
          onLogout={handleLogout}
          onClose={() => {
            setLogout({ modalOpen: false });
          }}
        />
      )}
    </>
  );
}
