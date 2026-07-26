import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validation";
import { Eye, EyeClosed, Home, Loader2, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../utils/ThemeToggle";
import { useState } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const user = await dispatch(loginUser(data)).unwrap();
      if (user) navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-[url('/24.jpg')] bg-cover bg-center opacity-60 pointer-events-none" />

      {/* Form container */}
      <div className="relative z-10 bg-bg-alt/90 backdrop-blur-lg border border-border shadow-lg2 rounded-3xl p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-heading mb-2">
            Welcome <span className="text-primary">Back</span>
          </h1>
          <p className="text-text-muted text-sm">
            Log in to continue your fragrance journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              autoComplete="email"
              className={`w-full pl-10 border rounded-xl p-3 text-sm  outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition ${
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
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              autoComplete="current-password"
              className={`w-full pl-10 border rounded-xl p-3 text-sm  outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition ${
                errors.password ? "border-error" : "border-border"
              }`}
            />
            {errors.password && (
              <p className="text-error text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-bg font-medium hover:bg-primary/90 transition flex justify-center items-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-center text-error text-sm mt-2">{error}</p>
          )}
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-text-muted mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
