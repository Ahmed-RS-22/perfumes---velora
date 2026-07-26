import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/authSlice";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../components/ui/loading";
import { supabase } from "../lib/supabase-client";

const ProtectedRoute = ({ adminOnly = false }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [checkingSession, setCheckingSession] = useState(true);
  const mainEmail = import.meta.env.VITE_ADMIN_EMAIL;
  
  useEffect(() => {
    const init = async () => {
      try {
        // Check for active session
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          // If there’s a session but Redux has no user → fetch it
          if (!user) await dispatch(fetchUser());
        }
      } catch (err) {
        console.error("Session check failed:", err.message);
      } finally {
        setCheckingSession(false);
      }
    };

    init();
  }, [dispatch, user]);

  // ✅ Still verifying session
  if (loading || checkingSession) {
    return <LoadingScreen loading={true} />;
  }

  // ✅ No authenticated user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Admin-only route check
  if (adminOnly && user.email.toLowerCase() !== mainEmail.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return <Outlet />;
};

export default ProtectedRoute;
