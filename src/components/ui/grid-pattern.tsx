"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useEffect, useId, useRef, useState } from "react";

/**
 *  GridPattern Component Props
 *
 * @param {number} [width=40] - The horizontal spacing between grid lines
 * @param {number} [height=40] - The vertical spacing between grid lines
 * @param {number} [x=0] - The x-offset of the entire pattern
 * @param {number} [y=0] - The y-offset of the entire pattern
 * @param {number} [strokeWidth=1] - The width of the grid lines
 * @param {string} [className] - Additional CSS classes to apply to the SVG container
 * @param {boolean} [animate=false] - Whether grid lines should have an animation effect
 */
interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
  [key: string]: unknown;
}

/**
 * GridPattern Component
 *
 * A React component that creates an animated or static grid pattern background using SVG.
 * The pattern automatically adjusts to fill its container and can optionally display animated lines.
 *
 * @component
 *
 * @see GridPatternProps for the props interface.
 *
 * @example
 * // Basic usage
 * <GridPattern />
 *
 * // With animation and custom spacing
 * <GridPattern
 *   width={30}
 *   height={30}
 *   animate={true}
 *   className="opacity-50"
 * />
 */

export function GridPattern({
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  strokeWidth = 1,
  className,
  animate = false,
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate number of lines needed
  const verticalLines = Math.ceil(dimensions.width / width) + 1;
  const horizontalLines = Math.ceil(dimensions.height / height) + 1;

  // Generate vertical lines
  const vLines = Array.from({ length: verticalLines }, (_, i) => ({
    x: i * width + x,
    y1: 0,
    y2: dimensions.height,
    delay: animate ? i * 0.1 : 0, // Sequential delay instead of random
  }));

  // Generate horizontal lines
  const hLines = Array.from({ length: horizontalLines }, (_, i) => ({
    y: i * height + y,
    x1: 0,
    x2: dimensions.width,
    delay: animate ? i * 0.1 : 0, // Sequential delay instead of random
  }));

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-gradient`} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Vertical Lines */}
      {vLines.map((line, index) => (
        <motion.line
          key={`v-${index}`}
          x1={line.x}
          y1={line.y1}
          x2={line.x}
          y2={line.y2}
          stroke={animate ? `url(#${id}-gradient)` : "currentColor"}
          strokeWidth={strokeWidth}
          initial={animate ? { pathLength: 0, opacity: 0.6 } : {}}
          animate={
            animate
              ? {
                  pathLength: [0, 1, 0],
                  opacity: [0.3, 0.8, 0.3],
                }
              : {}
          }
          transition={
            animate
              ? {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: line.delay,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
      
      {/* Horizontal Lines */}
      {hLines.map((line, index) => (
        <motion.line
          key={`h-${index}`}
          x1={line.x1}
          y1={line.y}
          x2={line.x2}
          y2={line.y}
          stroke={animate ? `url(#${id}-gradient)` : "currentColor"}
          strokeWidth={strokeWidth}
          initial={animate ? { pathLength: 0, opacity: 0.6 } : {}}
          animate={
            animate
              ? {
                  pathLength: [0, 1, 0],
                  opacity: [0.3, 0.8, 0.3],
                }
              : {}
          }
          transition={
            animate
              ? {
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: line.delay,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
    </svg>
  );
}
