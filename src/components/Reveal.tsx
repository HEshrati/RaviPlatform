"use client";

import { ElementType, ReactNode, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type RevealDirection = "up" | "down" | "left" | "right" | "fade";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  offset?: number;
}

const defaultOffset = 60;

const directionInitial = (direction: RevealDirection, offset: number) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: offset };
    case "down":
      return { opacity: 0, y: -offset };
    case "left":
      return { opacity: 0, x: offset };
    case "right":
      return { opacity: 0, x: -offset };
    case "fade":
    default:
      return { opacity: 0 };
  }
};

export default function Reveal({
  children,
  className,
  as: Component = "div",
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = true,
  offset = defaultOffset,
}: RevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.15,
  });

  const MotionComponent = useMemo(
    () => motion(Component as ElementType),
    [Component],
  );

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      ref(node);
    },
    [ref],
  );

  const variants = useMemo(
    () => ({
      hidden: directionInitial(direction, offset),
      show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          delay,
          duration,
          ease: [0.33, 1, 0.68, 1],
        },
      },
    }),
    [direction, offset, delay, duration],
  );

  return (
    <MotionComponent
      ref={setRefs}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={variants}
    >
      {children}
    </MotionComponent>
  );
}
