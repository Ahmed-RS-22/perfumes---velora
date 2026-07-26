import { Outlet } from "react-router-dom";
import { Header } from "../components/home/Navbar";
import { Footer } from "../components/home/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-border flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
