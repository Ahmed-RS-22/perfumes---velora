// src/components/ui/LoadingScreen.jsx
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export const LoadingScreen = ({ loading }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center 
      bg-bg/95 backdrop-blur-sm transition-opacity duration-700 
      ${loading ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col items-center space-y-6 animate-fadeIn">
        {/* === LOGO WITH GLOW === */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 blur-3xl opacity-50 bg-primary animate-pulse-slow rounded-full" />
          <Logo size="text-5xl md:text-7xl text-primary" />
        </div>

        {/* === LUXURY LOADING TEXT === */}
        <p className="text-primary-dark text-lg md:text-xl font-cinzel tracking-[0.15em] animate-luxuryGlow">
          Unveiling Elegance...
        </p>

        {/* === SUBTLE PROGRESS RING === */}
        <div className="mt-4 w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin-slow shadow-lg shadow-primary/20"></div>
      </div>
    </div>
  );
};
