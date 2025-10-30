import { Outlet } from "react-router-dom";
import { Header } from "../components/home/Navbar";
import { Footer } from "../components/home/Footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect, useMemo, useState } from "react";
import { LoadingScreen } from "../components/ui/loading";

const PublicLayout = () => {
  const { loading, data, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [initialLoad, setInitialLoad] = useState(true);
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => setInitialLoad(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (initialLoad && loading) return <LoadingScreen loading={true} />;
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
