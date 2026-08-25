import React from 'react';
import heroBgImage from '../assets/user_hero_bg.png';

export const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative w-full min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] flex items-center justify-center text-center overflow-hidden py-14 sm:py-16 px-4"
      style={{
        backgroundImage: `url(${heroBgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      
      {/* Full-Width Uniform Dark Atmosphere Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(8, 69, 47, 0.42)'
        }}
      />

      {/* Direct Clean Hero Typography (Zero Boxes, Zero Cards) */}
      <div className="max-w-[1040px] mx-auto space-y-4 relative z-10 text-center">
        
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold text-white tracking-[-1.5px] leading-[1.05] sm:leading-[1.08] drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]">
          Indian Seed Congress 2027 <br />
          <span className="text-white">Ramoji Film City, </span>
          <span className="text-[#39D98A] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] font-extrabold">
            Hyderabad
          </span>
        </h1>

        {/* Narrative Paragraph */}
        <p className="text-sm sm:text-base text-white max-w-xl mx-auto leading-relaxed font-semibold pt-1 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
          Bringing together India's seed industry, agricultural leaders, innovators and professionals for the next chapter of seed innovation.
        </p>

      </div>

    </section>
  );
};
