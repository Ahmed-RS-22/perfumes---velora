import { Link } from "react-router-dom";
export const AboutSection = () => {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 grid-cols-1 gap-14 items-center">
        {/* Left: Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-[75%] animate-float max-w-[400px] aspect-[3/4] rounded-3xl overflow-hidden shadow-lg2 border border-border">
            <img
              src="/24.jpg"
              alt="Velora Essence"
              className="w-full h-full object-cover hover:scale-105  transition-transform duration-700"
            />
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Glow behind image */}
          <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full opacity-70 animate-pulse-slow"></div>
        </div>

        {/* Right: Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-heading">
            About <span className="text-primary">Velora</span>
          </h2>

          <p className="text-text-muted leading-relaxed max-w-xl">
            At <span className="text-primary font-semibold">Velora</span>, we believe fragrance is more than a scent —
            it’s an expression of identity, emotion, and memory.  
            Our carefully crafted perfumes are designed to inspire confidence, grace, and timeless beauty.
          </p>

          <p className="text-text-muted leading-relaxed max-w-xl">
            Each essence is born from passion and precision — combining exquisite notes and sophisticated packaging to create a truly unforgettable experience.
          </p>

          <Link to={"/store"} className="px-8 py-3 rounded-full bg-primary text-bg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40">
            Discover More
          </Link>
        </div>
      </div>
    </section>
  );
};
