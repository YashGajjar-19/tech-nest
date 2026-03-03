"use client";

import { createContext, useContext, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const ScrollContext = createContext(0);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress(v);
  });

  return (
    <ScrollContext.Provider value={progress}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollDepth = () => useContext(ScrollContext);
