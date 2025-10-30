
import { LayoutDashboard, ShoppingBag, PlusCircle, Users, Package, Settings, ShoppingCart, Home, Store, Info, Heart, Sparkles, Clock, Truck, Recycle } from "lucide-react";

export const dashboardLinks = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    path: "overview",
  },
  {
    name: "Products",
    icon: ShoppingBag,
    path: "products",
  },
  {
    name: "Orders",
    icon: Package,
    path: "orders",
  },
  {
    name: "Users",
    icon: Users,
    path: "users",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "settings",
  },
];

// home nav links 
export const navLinks = [
  { name: "Home", path: "/",icon:Home },
  { name: "Shop", path: "/shop",icon:Store }, // optional if you’ll list all products
  // { name: "About", path: "/about" ,icon:Info },
  { name: "Cart", path: "/cart",icon:ShoppingCart },
  { name: "Favourites", path: "/favourites" ,icon:Heart},
];
// features

export const features = [
  {
    icon: Sparkles,
    title: "Exquisite Quality",
    desc: "Crafted from the finest natural ingredients for a long-lasting, elegant scent.",
  },
  {
    icon: Clock,
    title: "Timeless Scents",
    desc: "A curated selection of perfumes designed to leave a lasting impression.",
  },
  {
    icon: Truck,
    title: "Fast & Secure Delivery",
    desc: "Experience quick, safe shipping right to your door — with premium packaging.",
  },
  {
    icon: Recycle,
    title: "Sustainable Luxury",
    desc: "Eco-friendly packaging and cruelty-free production in every fragrance.",
  },
];