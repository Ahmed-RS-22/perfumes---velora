import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/home/Navbar";
import { Footer } from "../components/home/Footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect, useMemo, useState } from "react";
import { LoadingScreen } from "../components/ui/loading";

const PublicLayout = () => {
  const { loading,data,error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(true);
  const memoizedData = useMemo(() => data, [data]);
  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Show loading when app first mounts
  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Show loading briefly when route changes
  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Combine both loading states
  if (loading || routeLoading) return <LoadingScreen loading={true} />;
  if (error) return <div className="text-center mt-24 text-error bg-error-bg">{error}</div>;

  return (
    <div className="min-h-screen bg-border flex flex-col">
      {/* Shared header */}
      <Header />

      {/* Main content (renders current route) */}
      <main className="flex-1">
        <Outlet  context={{data:memoizedData,loading}}/>
      </main>

      {/* Shared footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
