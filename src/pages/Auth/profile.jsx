import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, saveProfile } from "../../redux/slices/profileSlice";
import { logoutUser } from "../../redux/slices/authSlice";
import { fetchUser } from "../../redux/slices/authSlice";
import {
  Loader2,
  Mail,
  User,
  MapPin,
  Phone,
  X,
  StopCircle,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../utils/ThemeToggle";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    data: profile,
    loading,
    error,
  } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    address: "",
    phone: "",
  });
  const handleLogout = () => {
    dispatch(logoutUser());
    setTimeout(() => navigate("/login"), 1500);
  };
  // Load user and profile
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return; // 🔒 prevent firing when logged out
    dispatch(fetchProfile(user.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    if (user?.id) {
      dispatch(saveProfile({ userId: user.id, updates: form }));
    }
  };
  if (!user)
    return (
      <>
        <section className="w-full h-screen flex justify-center items-center relative ">
          <div className="absolute inset-0 bg-[url('/1.jpg')] bg-cover opacity-10 pointer-events-none" />
          <div className="flex flex-col items-center bg-primary backdrop-blur-lg  w-2/3 rounded-3xl max-w-2xl min-w-75 text-bg-alt gap-5 p-10">
            <p className="text-2xl font-bold flex flex-col items-center">
              <span className="size-16 flex justify-center items-center bg-error-bg rounded-full text-error">
                <StopCircle size={36} />
              </span>
              you are logged out please sign in or register
            </p>
            <div className="btns flex gap-5 flex-wrap">
              <Link
                className=" py-3 px-10 rounded-xl bg-heading text-bg font-medium hover:bg-info/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
                to={"/login"}
              >
                {" "}
                Sign in{" "}
              </Link>
              <Link
                className=" py-3 px-10 rounded-xl bg-heading text-bg font-medium hover:bg-success/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
                to={"/register"}
              >
                {" "}
                Sign up{" "}
              </Link>
            </div>
            <div className="w-full h-1 bg-text"></div>
            <Link
              className="w-full py-3 rounded-xl bg-heading text-bg font-medium hover:bg-warning/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
              to={"/"}
            >
              {" "}
              go home{" "}
            </Link>
          </div>
        </section>
      </>
    );

  return (
    <section className="min-h-screen flex items-center justify-center  relative overflow-hidden">
      <div className="fixed rounded-full top-5 left-5">
        <ThemeToggle
          className={
            " p-1 rounded-full bg-primary text-border hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
          }
        />
      </div>
      <div className="fixed rounded-full top-5 left-15">
        <button
          className=" p-1 rounded-full bg-primary text-border hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          <Home size={20} />
        </button>
      </div>
      {/* Soft background texture */}
      <div className="absolute inset-0 bg-[url('/1.jpg')] bg-cover opacity-40 pointer-events-none" />

      {/* Profile card */}
      <div className="relative z-10  backdrop-blur-lg border border-border shadow-lg2 rounded-3xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-heading mb-2">
            Your <span className="text-primary">Profile</span>
          </h1>
          <p className="text-text-muted text-sm">
            Manage your personal information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Email (read-only) */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full pl-10 border rounded-xl p-3 text-sm text-primary  outline-none"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full pl-10 border rounded-xl p-3 text-sm  outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full pl-10 border rounded-xl p-3 text-sm  outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-10 border rounded-xl p-3 text-sm  outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-bg font-medium hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="submit"
            onClick={handleLogout}
            className="w-full py-3 font-semibold rounded-xl bg-primary text-border hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md disabled:opacity-60"
          >
            log out
          </button>
          {/* Error message */}
          {error && (
            <p className="text-center text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
}
