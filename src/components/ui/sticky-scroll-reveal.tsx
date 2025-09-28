"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * No `any` anywhere.
 * ContentItem.content is typed as React.ReactNode (you can pass images/components there).
 */
type ContentItem = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

const BACKGROUND_COLORS = ["#0f172a", "#000000", "#171717"] as const;
const LINEAR_GRADIENTS = [
  "linear-gradient(to bottom right, #06b6d4, #10b981)",
  "linear-gradient(to bottom right, #ec4899, #6366f1)",
  "linear-gradient(to bottom right, #f97316, #eab308)",
] as const;

export const StickyScroll: React.FC<{
  content: ContentItem[];
  contentClassName?: string;
}> = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  // useScroll accepts a ref object for container
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = Math.max(1, content.length);

  // Hook will fire on scroll progress changes and pick the closest breakpoint
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        return distance < Math.abs(latest - cardsBreakpoints[acc])
          ? index
          : acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const [backgroundGradient, setBackgroundGradient] = useState<string>(
    LINEAR_GRADIENTS[0],
  );

  useEffect(() => {
    setBackgroundGradient(
      LINEAR_GRADIENTS[activeCard % LINEAR_GRADIENTS.length],
    );
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor:
          BACKGROUND_COLORS[activeCard % BACKGROUND_COLORS.length],
      }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={`${item.title}-${index}`} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-lg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}

          <div className="h-40" />
        </div>
      </div>

      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {/* safe access to avoid runtime crash */}
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};
