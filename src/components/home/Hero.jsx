import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
export const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex pt-5 md:pt-2 items-center justify-center overflow-hidden bg-img hero-section">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br  from-[#00000010] to-[#00000020] dark:from-[#00000090] dark:to-[#00000040]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 grid-cols-1 gap-8 items-center text-center md:text-left">
        {/* Text Content */}
        <div className="flex lg:pl-20 flex-col md:items-start items-center justify-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[#EAD9B7] animate-fadeIn drop-shadow-[0_0_15px_rgba(198,167,118,0.5)]">
            Welcome to <Logo size={"text-4xl md:text-6xl"} />
          </h1>

          <p className="md:text-lg text-[#F1E8DA] dark:text-[#F5EDE2] max-w-md leading-relaxed">
            Indulge your senses in timeless fragrances that embody elegance,
            confidence, and allure.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to={"/shop"}
              className="md:px-8 px-5 py-3 rounded-full bg-[#C6A776] text-white font-semibold hover:bg-[#b5965d] transition-all duration-300 shadow-lg hover:shadow-[#C6A776]/50"
            >
              Shop Now
            </Link>
            <button className="md:px-8 px-5 py-3 rounded-full border border-[#C6A776] text-[#EAD9B7] font-semibold hover:bg-[#C6A776]/10 transition-all duration-300">
              Explore
            </button>
          </div>
        </div>

        {/* Perfume Image */}
        <div className="relative flex justify-center md:justify-end">
          <img
            src={"./20.jpg"}
            alt="Velora Perfume"
            className="md:w-[50%] w-2/3 hover:shadow-lg2 transition-all duration-300 rounded-3xl max-w-[400px] drop-shadow-[0_0_25px_rgba(198,167,118,0.3)] animate-float"
          />
        </div>
      </div>
    </section>
  );
};
