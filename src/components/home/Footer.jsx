import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { navLinks } from "@/data/data";
export const Footer = () => {
  return (
    <footer className="relative bg-primary text-bg dark:text-bg/90 py-14 overflow-hidden">
      {/* Subtle top shimmer line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-80 animate-pulse-slow"></div>

      {/* Content */}
      <div className="relative container mx-auto px-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 text-center md:text-left">
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Logo size="text-4xl" />
          <p className="text-bg/80 max-w-xs leading-relaxed">
            Timeless fragrances crafted with passion and precision — discover
            elegance redefined at Velora.
          </p>

          {/* Social Icons */}
          <div className="flex gap-5 justify-center md:justify-start pt-2">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Linkedin, href: "#" },
            ].map(({ Icon, href }, i) => (
              <Link
                key={i}
                to={href}
                className="p-2 rounded-full bg-bg/10 text-bg hover:bg-bg hover:text-primary-dark transition-all duration-300 shadow-sm2 hover:shadow-md2"
              >
                <Icon size={24} />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h3 className="text-bg font-semibold text-lg mb-2">Quick Links</h3>
          {navLinks.map(({ name, path, icon: Icon }, i) => (
            <Link
              key={i}
              to={path}
              className="flex items-center gap-2 text-bg/80 hover:text-bg transition-all duration-300"
            >
              <Icon size={20} className="text-bg/70" />
              {name}
            </Link>
          ))}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h3 className="text-bg font-semibold text-lg mb-2">Contact</h3>
          <p className="text-bg/80">123 Velvet Street, Cairo, Egypt</p>
          <p className="text-bg/80">contact@velora.com</p>
          <p className="text-bg/80">+20 123 456 7890</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-bg/20 my-10"></div>

      {/* Copyright */}
      <div className="text-center text-sm text-bg/70">
        © {new Date().getFullYear()}{" "}
        <span className="text-bg font-semibold">Ahmed RS</span>. All rights
        reserved.
      </div>

      {/* Soft radial glow behind */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-[200px] bg-primary-light/20 blur-3xl rounded-full"></div>
    </footer>
  );
};
