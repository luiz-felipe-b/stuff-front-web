import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}


const dotBase = "inline-block rounded-full mx-1";
const bounce = "animate-bounce";

const Loader: React.FC<LoaderProps> = ({ size = 32, color = "#F4A64E", className = "", label }) => (
  <div className={`flex flex-col items-center justify-center ${className}`} style={{ minHeight: size * 1.5 }}>
    <div className="flex items-end justify-center" style={{ height: size, width: size * 2 }}>
      <span
        className={`${dotBase} ${bounce}`}
        style={{ background: color, width: size / 4, height: size / 4, animationDelay: "0s" }}
      />
      <span
        className={`${dotBase} ${bounce}`}
        style={{ background: color, width: size / 4, height: size / 4, animationDelay: "0.2s" }}
      />
      <span
        className={`${dotBase} ${bounce}`}
        style={{ background: color, width: size / 4, height: size / 4, animationDelay: "0.4s" }}
      />
    </div>
    {label && <span className="mt-2 text-stuff-dark text-base font-medium">{label}</span>}
  </div>
);

export default Loader;
