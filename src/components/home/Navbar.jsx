import { navLinks } from "@/data/data";
import logo from "/public/logo.jpg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LogIn,
  Menu,
  User,
  UserRoundPlus,
  LogOut,
  UserCircle2,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/utils/ThemeToggle";
import { Logo } from "../ui/Logo";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, fetchUser } from "@/redux/slices/authSlice";

export const Header = () => {
  const [isUserMenueActive, setIsUserMenueActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get auth state from Redux
  const { user } = useSelector((state) => state.auth);
  const mainEmail = import.meta.env.VITE_ADMIN_EMAIL;
  // ✅ Fetch current user if exists (on page refresh)
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // ✅ Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserMenueActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsUserMenueActive(false);
    navigate("/login");
  };

  return (
    <header className="w-full capitalize z-50 md:px-8 fixed top-0 px-3 py-3 md:min-h-20 max-h-25 bg-primary">
      <div className="grid md:grid-cols-12 grid-cols-3 gap-2">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="logo cursor-pointer flex gap-2 justify-center items-center lg:col-span-2 md:col-span-2"
        >
          <img
            src={logo}
            alt="logo"
            className="rounded-full lg:block hidden md:min-w-16 md:size-14 size-12"
          />
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="h-full md:col-span-8 md:block hidden">
          <ul className="flex justify-evenly items-center h-full">
            {navLinks.map((link, key) => (
              <li key={key}>
                <NavLink
                  className={({ isActive }) =>
                    `lg:text-lg flex gap-2 hover:rounded-xl p-2 transition-all duration-300 hover:bg-bg-alt/90 hover:text-primary-dark ${
                      isActive
                        ? "text-text-muted bg-card rounded-2xl px-4 py-2 font-bold"
                        : "text-bg font-semibold"
                    }`
                  }
                  to={link.path}
                >
                  {link.icon && <link.icon />} {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Nav */}
        <nav
          ref={menuRef}
          className="h-full md:hidden flex justify-center items-center"
        >
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn(
              "bg-bg-alt rounded-full md:size-16 size-12 flex justify-center items-center text-primary border-3 hover:text-bg-alt/90 hover:bg-primary transition-all duration-300 cursor-pointer",
              isMenuOpen ? "text-info" : ""
            )}
          >
            <Menu className="md:size-12 size-8" />
          </button>

          <ul
            className={cn(
              "absolute sm:w-[clamp(300px,40dvw,500px)] w-full h-screen p-5 bg-primary-dark/70 backdrop-blur-md right-0 top-[100%] flex flex-col transition-all duration-500 origin-right",
              isMenuOpen
                ? "transform-[scaleX(1)] opacity-100"
                : "transform-[scaleX(0)] opacity-0"
            )}
          >
            {navLinks.map((link, key) => (
              <li key={key} className="w-full">
                <NavLink
                  onClick={() => setIsMenuOpen(false)}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex gap-2 w-full px-4 py-3 rounded-xl text-lg transition-all duration-300 ${
                      isActive
                        ? "bg-card text-text-muted font-bold shadow-inner2"
                        : "text-bg font-semibold hover:bg-bg-alt/90 hover:text-primary-dark"
                    }`
                  }
                >
                  {link.icon && <link.icon />} {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Actions */}
        <div
          ref={userRef}
          className="btns md:col-span-2 text-primary flex justify-center items-center"
        >
          <button
            aria-expanded={isUserMenueActive}
            aria-label="User menu"
            onClick={() => setIsUserMenueActive((prev) => !prev)}
            className={cn(
              "bg-bg-alt rounded-full md:size-16 size-12 flex justify-center items-center border-3 transition-all duration-300 cursor-pointer focus:outline-none",
              isUserMenueActive
                ? "text-info hover:bg-primary-dark"
                : "hover:text-bg-alt/90 hover:bg-primary"
            )}
          >
            <User className="md:size-12 size-8" />
          </button>

          <div
            className={cn(
              "absolute w-[clamp(300px,40dvw,400px)] rounded-3xl p-5 bg-primary-light/70 backdrop-blur-md sm:right-10 right-2 top-[120%] flex flex-col transition-all duration-500 origin-top",
              isUserMenueActive
                ? "transform-[scale(1)] opacity-100"
                : "transform-[scale(0)] opacity-0"
            )}
          >
            {/* ✅ If user logged in */}
            {user ? (
              <>
                <Link
                  onClick={() => setIsUserMenueActive(false)}
                  to="/profile"
                  className="flex gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-3.5 rounded-2xl"
                >
                  <UserCircle2 size={28} />
                  <span>{user?.user_metadata?.username}</span>
                </Link>
                {user.email.toLowerCase() === mainEmail.toLowerCase() && (
                  <Link
                    onClick={() => setIsUserMenueActive(false)}
                    to="/dashboard"
                    className="flex gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-3.5 rounded-2xl"
                  >
                    <LayoutDashboard size={28} />
                    <span>dashboard</span>
                  </Link>
                )}

                <div
                  onClick={handleLogout}
                  className="flex gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-3.5 rounded-2xl cursor-pointer"
                >
                  <LogOut size={28} />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              /* ✅ If no user */
              <>
                <Link
                  onClick={() => setIsUserMenueActive(false)}
                  to="/login"
                  className="flex gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-3.5 rounded-2xl"
                >
                  <LogIn size={28} />
                  <span>Log in</span>
                </Link>

                <Link
                  onClick={() => setIsUserMenueActive(false)}
                  to="/register"
                  className="flex gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-3.5 rounded-2xl"
                >
                  <UserRoundPlus size={28} />
                  <span>Sign up</span>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <div className="flex cursor-pointer items-center gap-3 hover:shadow-inner text-heading text-xl font-semibold hover:bg-bg py-3.5 px-2 rounded-2xl">
              <ThemeToggle size={28} color={"text-heading"}>
                te
              </ThemeToggle>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
