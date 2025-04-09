import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const blobVariants = {
  animate: {
    scale: [1, 1.15, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
    },
  },
};

const blobs = [
  { top: "10%", left: "20%", size: "350px", color: "bg-pink-400" },
  { top: "30%", left: "60%", size: "300px", color: "bg-blue-400" },
  { top: "60%", left: "30%", size: "250px", color: "bg-purple-400" },
  { top: "40%", left: "50%", size: "200px", color: "bg-yellow-400" },
];

export const InkBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 blur-xl">
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute ${blob.color} rounded-full filter mix-blend-multiply pointer-events-none`}
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
          }}
          variants={blobVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};
