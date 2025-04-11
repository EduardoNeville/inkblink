import { motion } from "framer-motion";

const generateMotion = (delay: number = 0) => ({
  animate: {
    x: ["0%", "20%", "-10%", "0%"],
    y: ["0%", "-10%", "15%", "0%"],
    scale: [1, 1.15, 0.95, 1],
    rotate: [0, 15, -10, 0],
    transition: {
      duration: 15 + Math.random() * 10,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
      delay,
    },
  },
});

const blobs = [
  { top: "10%", left: "15%", size: "400px", color: "bg-pink-400" },
  { top: "30%", left: "60%", size: "350px", color: "bg-blue-400" },
  { top: "55%", left: "30%", size: "300px", color: "bg-purple-400" },
  { top: "45%", left: "50%", size: "250px", color: "bg-yellow-400" },
];

export const InkBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 blur-2xl pointer-events-none mix-blend-multiply">
      {blobs.map((blob, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${blob.color} opacity-50 rounded-full`}
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
          }}
          variants={generateMotion(idx * 2)}
          animate="animate"
        />
      ))}
    </div>
  );
};
