import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/SideBar";
import DashboardHeader from "../components/Dashboard/DashboradHeader";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../redux/slices/productSlice";
import { LoadingScreen } from "../components/ui/loading";
import { fetchUserOrders } from "../redux/slices/ordersSlice";
const DashboardLayout = () => {
    const { allLoading, allProducts, error } = useSelector((state) => state.products);
    const orders = useSelector((state) => state.orders);
    
  const dispatch = useDispatch();
    // Fetch products on mount
    useEffect(() => {
      dispatch(fetchAllProducts());
      dispatch(fetchUserOrders());
    }, [dispatch]);
  const [showSide, setShowSide] = useState(false);

    if (allLoading ) return <LoadingScreen loading={true} />;
    if (error) return <div className="text-center mt-24 text-error bg-error-bg">{error}</div>;
  return (
    <main className="min-h-screen bg-border grid grid-cols-12 gap-5 relative ">
      {/* side bar  */}
              <button
          className="fixed  bg-card text-text p-2 rounded-full lg:hidden top-3 left-3 z-40"
          onClick={() => setShowSide(!showSide)}
        >
          {showSide ? <X /> : <Menu />}
        </button>
      <div
        className={cn(
          " fixed  sm:w-[20dvw] lg:opacity-100 lg:transform-[translateX(0)] w-full z-20 top-0 left-0 max-h-screen transition-all duration-500 origin-left",
          showSide
            ? "transform-[translateX(0)] opacity-100  "
            : "sm:transform-[translateX(-350px)] transform-[translateX(-100%)] opacity-20"
        )}
      >
        <Sidebar />
      </div>
      {/* header */}
      <div className="xl:col-start-4 p-5 lg:col-start-5 col-start-2 col-end-13">
        <DashboardHeader />
      </div>
      {/* content  */}
      <div className="xl:col-start-4 lg:col-start-5 col-start-1 col-end-13 ">
        <Outlet context={{products: allProducts, orders }} />
      </div>
    </main>
  );
};
export default DashboardLayout;
