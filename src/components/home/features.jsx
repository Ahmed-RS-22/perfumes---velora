import { features } from "../../data/data";
export const FeaturesSection = () => {
  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden text-center">
      {/* soft gradient glow background */}
      <div className="absolute inset-0 bg-border  pointer-events-none"></div>
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-heading mb-14">
          Why Choose <span className="text-primary">Velora</span>
        </h2>
        {/* Features Grid */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 justify-items-center max-w-6xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-card shadow-md2 hover:shadow-lg2 rounded-3xl p-8 w-full sm:w-[85%] md:w-[90%] lg:w-[100%]
              transition-all duration-500 border border-border hover:border-primary/40 hover:-translate-y-2 flex flex-col items-center justify-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-bg transition-all duration-500">
                  <feature.icon size={40} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-heading mb-3">
                {feature.title}
              </h3>
              <p className="text-text-muted leading-relaxed max-w-[280px]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
