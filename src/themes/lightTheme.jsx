import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D4B996" },
    secondary: { main: "#B89C7D" },
    background: {
      default: "#FAF8F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#3B3A38",
      secondary: "#6B6866",
    },
    success: { main: "#4CAF50" },
    warning: { main: "#FFC107" },
    error: { main: "#E57373" },
    info: { main: "#64B5F6" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  shape: { borderRadius: 8 },
  shadows: [
  "none",
  "0 1px 3px rgba(180,160,130,0.12)",
  "0 4px 8px rgba(180,160,130,0.18)",
  "0 8px 20px rgba(140,120,90,0.25)",
  // you can add more if you need (up to 25)
],

});
