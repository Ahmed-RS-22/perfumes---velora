import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import { Home } from "./pages/Home/home";
import { Cart } from "./pages/Home/cart";
import Login from "./pages/Auth/login";
import { ErrorPage } from "./pages/Error";
import { Shop } from "./pages/Home/Shop";
import { Favourites } from "./pages/Home/favourits";
import Register from "./pages/Auth/register";
import Profile from "./pages/Auth/profile";
import DashboardLayout from "./layouts/DashboardLayout";
import OverviewPage from "./pages/DashBoard/OverView";
import ProductsPage from "./pages/DashBoard/Products";
import OrdersPage from "./pages/DashBoard/Orders";
import UsersPage from "./pages/DashBoard/Users";
import SettingsPage from "./pages/DashBoard/Settings";
import ProtectedRoute from "./routes/ProtectedRoutes";
const App = () => {
  return (
    <div>
      <>
        <Routes>
          {/* Main layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/favourites" element={<Favourites />} />
          </Route>
          {/* dashboard Layout */}
          <Route element={<ProtectedRoute adminOnly={true} />}>

          <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"  element={<OverviewPage />} />
            <Route path="products" element={<ProductsPage/>} />  
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          </Route>
          {/* general pages  */}
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </>
    </div>
  );
};

export default App;
