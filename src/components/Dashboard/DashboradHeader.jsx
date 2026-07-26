import { Bell, Search, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "@/redux/slices/authSlice";
import { Link } from "react-router-dom";
const DashboardHeader = () => {
  const [showUsername, setShowUsername] = useState(false);
  const dispatch = useDispatch();

  // ✅ Get auth state from Redux
  const { user } = useSelector((state) => state.auth);
  // ✅ Fetch current user if exists (on page refresh)
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <header className="px-3 lg:px-6 md:py-6 shadow-lg2 py-4 gap-4 ml-3 flex justify-evenly  items-center rounded-4xl  bg-bg-alt max-h-24 ">
      <div className="search md:flex-2 flex ">
        <span className="md:hidden nav-icon">
          <Search className="" size={28} />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 hidden md:block  py-2 border border-border rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="md:flex-1 flex items-center">
        <span className="nav-icon">
          <Bell size={28} />
        </span>
      </div>
      <Link to={"/profile"} className="flex items-center md:flex-1 md:justify-end gap-4  relative ">
        <span className="nav-icon">
          <User size={28} onClick={() => setShowUsername((prev) => !prev)} />
        </span>
        <span
          className={cn(
            "text-primary font-medium text-lg absolute top-[150%]   -left-20 md:static",
            "md:p-0 p-3 rounded-xl  bg-bg-alt origin-top transition-all duration-300 md:scale-100 md:opacity-100 ",
            showUsername ? "scale-100 opacity-100 whitespace-nowrap" : "scale-0 opacity-0 whitespace-nowrap"
          )}
        >
          {user?.user_metadata.username || "User"}
        </span>
      </Link>
    </header>
  );
};
export default DashboardHeader;
