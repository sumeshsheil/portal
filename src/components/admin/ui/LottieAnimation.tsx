"use client";

import Lottie from "lottie-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

interface LottieAnimationProps {
  animationData?: object;
  src?: string; // URL based loading
  width?: number | string;
  height?: number | string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  src,
  width,
  height,
  className,
  loop = true,
  autoplay = true,
}) => {
  const [data, setData] = useState<object | undefined>(animationData);
  const [shouldRender, setShouldRender] = useState(false);

  // Also support immediate data if provided
  useEffect(() => {
    if (animationData) {
      setData(animationData);
    }
  }, [animationData]);

  // Fetch data when shouldRender becomes true (i.e. in view)
  useEffect(() => {
    if (shouldRender && src && !data) {
      fetch(src)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((jsonData) => setData(jsonData))
        .catch((error) =>
          console.error("Error loading Lottie animation:", error),
        );
    }
  }, [shouldRender, src, data]);

  return (
    <motion.div
      className={className}
      style={{
        width: width || "100%",
        height: height || "auto",
        minHeight: "10px",
      }}
      onViewportEnter={() => setShouldRender(true)}
      viewport={{ once: true, margin: "200px" }}
    >
      {shouldRender && data ? (
        <Lottie
          animationData={data}
          loop={loop}
          autoplay={autoplay}
          className="w-full h-full"
        />
      ) : null}
    </motion.div>
  );
};

export default LottieAnimation;
