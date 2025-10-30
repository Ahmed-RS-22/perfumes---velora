import { createTheme } from "@mui/material/styles";
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#C9A87A" },
    secondary: { main: "#A38C6D" },
    background: {
      default: "#1E1D1A",
      paper: "#272522",
    },
    text: {
      primary: "#F5F3EF",
      secondary: "#C7C3BD",
    },
    success: { main: "#81C784" },
    warning: { main: "#FFD54F" },
    error: { main: "#EF9A9A" },
    info: { main: "#90CAF9" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  shape: { borderRadius: 8 },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.4)",
    "0 4px 10px rgba(0,0,0,0.55)",
    "0 8px 25px rgba(0,0,0,0.65)",
  ],
});
