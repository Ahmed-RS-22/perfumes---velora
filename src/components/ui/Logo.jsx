// Logo.jsx
export const Logo = ({size}) => {
  return (
    <span
      className={`${size? size:"lg:text-4xl md:text-3xl text-2xl"} font-[Cinzel] tracking-wide font-semibold select-none
                 text-[#EAD9B7] drop-shadow-[0_0_8px_rgba(245,230,196,0.6)]
                 animate-luxuryGlow transition-all duration-700`}
    >
      Velora
    </span>
  );
};
