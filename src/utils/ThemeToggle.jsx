import { Sun, Moon } from "lucide-react";
import { useThemeMode } from "../context/ThemeContext";

export const ThemeToggle = ({ color, size, children, className }) => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <button
      onClick={toggleTheme}
      className={" cursor-pointer flex gap-3 " + className}
    >
      {mode === "light" ? (
        <Moon size={size || 20} className={color + "hover:opacity-80"} />
      ) : (
        <Sun size={size || 20} className={color} />
      )}

      {children && (
        <span className={"text-xl font-semibold text-heading"}>
          {children ? (mode === "light" ? "dark mode" : "light mode") : null}
        </span>
      )}
    </button>
  );
};
