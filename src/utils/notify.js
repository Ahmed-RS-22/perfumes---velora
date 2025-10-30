import toast from "react-hot-toast";

export const notify = {
  success: (msg, duration = 3000) => toast.success(msg, { duration }),
  error: (msg, duration = 4000) => toast.error(msg, { duration }),
  info: (msg, duration = 3000) =>
    toast(msg, {
      duration,
      style: {
        background: "var(--color-info-bg)",
        color: "var(--color-info)",
        border: "1px solid var(--color-info)",
      },
      iconTheme: {
        primary: "var(--color-info)",
        secondary: "var(--color-card)",
      },
    }),
  loading: (msg) => toast.loading(msg, { duration: Infinity }),
  dismiss: (id) => toast.dismiss(id),
};
