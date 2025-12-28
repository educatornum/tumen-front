import React, { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Create snowflakes with random properties - slower and more realistic
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 8 + 8, // 8-16 seconds (much slower)
      opacity: Math.random() * 0.6 + 0.4,
      size: Math.random() * 10 + 15, // 15-25px (emoji-д тохирсон хэмжээ)
      delay: -(Math.random() * 16), // negative delay to start at different positions
      drift: Math.random() * 30 - 15 // horizontal drift -15 to +15
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-fall"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            ['--drift' as any]: `${flake.drift}px`
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white">
            ❄️
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(50vh) translateX(var(--drift)) rotate(180deg);
          }
          100% {
            transform: translateY(110vh) translateX(0) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Snowfall;