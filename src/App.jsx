import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingScreen } from "./components/ui/loading";

const PublicLayout = lazy(() => import("./layouts/PublicLayout"));
const Home = lazy(() => import("./pages/Home/home").then(m => ({ default: m.Home })));
const Cart = lazy(() => import("./pages/Home/cart").then(m => ({ default: m.Cart })));
const Shop = lazy(() => import("./pages/Home/Shop").then(m => ({ default: m.Shop })));
const Favourites = lazy(() => import("./pages/Home/favourits").then(m => ({ default: m.Favourites })));
const Login = lazy(() => import("./pages/Auth/login"));
const Register = lazy(() => import("./pages/Auth/register"));
const Profile = lazy(() => import("./pages/Auth/profile"));
const ErrorPage = lazy(() => import("./pages/Error").then(m => ({ default: m.ErrorPage })));

const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const OverviewPage = lazy(() => import("./pages/DashBoard/OverView"));
const ProductsPage = lazy(() => import("./pages/DashBoard/Products"));
const OrdersPage = lazy(() => import("./pages/DashBoard/Orders"));
const UsersPage = lazy(() => import("./pages/DashBoard/Users"));
const SettingsPage = lazy(() => import("./pages/DashBoard/Settings"));
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoutes"));
const App = () => {
  return (
    <Suspense fallback={<LoadingScreen loading={true} />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/favourites" element={<Favourites />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
};

export default App;
