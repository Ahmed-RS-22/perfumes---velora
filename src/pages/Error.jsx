import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export const ErrorPage = () => {
  return (
    <section className="flex flex-col items-center justify-center h-screen bg-primary text-bg px-6 text-center">
      {/* Icon */}
      <div className="flex items-center justify-center bg-bg-alt/80 p-6 rounded-full shadow-lg mb-6 animate-pulse">
        <AlertTriangle className="text-primary-dark" size={60} />
      </div>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-bold text-text-muted drop-shadow-lg">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold text-heading mt-3">
        Oops! Page not found.
      </h2>

      {/* Description */}
      <p className="text-lg text-bg/90 max-w-md mt-3">
        The page you’re looking for doesn’t exist or has been moved.  
        Don’t worry — let’s get you back on track.
      </p>

      {/* Button */}
      <Link
        to="/"
        className={cn(
          "mt-8 flex items-center gap-3 bg-bg-alt text-primary-dark font-semibold text-lg px-6 py-3 rounded-2xl shadow-md",
          "hover:bg-primary-dark hover:text-bg transition-all duration-300"
        )}
      >
        <Home size={24} />
        Back to Home
      </Link>
    </section>
  );
};
