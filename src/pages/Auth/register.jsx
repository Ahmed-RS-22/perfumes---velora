import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validation";
import { Eye, EyeClosed, Home, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../utils/ThemeToggle";
import { useState } from "react";

export default function Register() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    const { email, password, username } = data;
    dispatch(registerUser({ email, password, username }));
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <section className="min-h-screen flex relative  items-center justify-center  px-4">
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
      <div className="absolute inset-0 bg-[url('/5.jpg')] bg-cover bg-center opacity-60 pointer-events-none" />

      <div className=" backdrop-blur-lg shadow-lg shadow-shad rounded-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-cinzel font-bold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join us and explore premium fragrances!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              autoComplete="username"
              className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                errors.username ? "border-error" : "border-border"
              }`}
            />
            {errors.username && (
              <p className="text-error text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              autoComplete="email"
              className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                errors.email ? "border-error" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
                        {showPassword ? (
              <Eye size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)} />
            ):(<EyeClosed size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}/>)}
            <input
             type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              autoComplete="new-password"
              className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                errors.password ? "border-error" : "border-border"
              }`}
            />
            {errors.password && (
              <p className="text-error text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
                                    {showConPassword ? (
              <Eye size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 cursor-pointer" onClick={() => setShowConPassword((prev) => !prev)} />
            ):(<EyeClosed size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 cursor-pointer" onClick={() => setShowConPassword((prev) => !prev)}/>)}
            <input
              type={showConPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              autoComplete="new-password"
              className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                errors.confirmPassword ? "border-error" : "border-border"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-error text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Registering...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Error */}
          {error && (
            <p className="text-center text-error text-sm mt-2">{error}</p>
          )}
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
