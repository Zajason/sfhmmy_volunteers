import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../utils/ThemeContext";
import cn from "classnames"; // Assuming you're using the classnames package

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const meteorColor = theme === "dark" ? "bg-white" : "bg-blue-900";
  const trailColor = theme === "dark" ? "from-white" : "from-blue-700";

  // Generate meteor random data once and memoize it
  const meteorData = useMemo(() => {
    return new Array(number || 20).fill(true).map(() => ({
      top: Math.floor(Math.random() * 100) + "vh",
      left: Math.floor(Math.random() * 90) + "vw",
      animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
    }));
  }, [number]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {meteorData.map((data, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute h-1 w-1 rounded-full",
            meteorColor,
            "shadow-md before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%]",
            "before:w-[80px] before:h-[1px] before:bg-gradient-to-r",
            `before:${trailColor} before:to-transparent`,
            className
          )}
          style={{
            top: data.top,
            left: data.left,
            animationDelay: data.animationDelay,
          }}
        ></span>
      ))}
    </div>
  );
};
