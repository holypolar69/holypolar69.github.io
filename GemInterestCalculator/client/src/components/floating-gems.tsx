import { motion } from "framer-motion";

const gems = [
  { emoji: "💎", color: "text-yellow-400", delay: 0 },
  { emoji: "💎", color: "text-green-400", delay: 0.5 },
  { emoji: "💎", color: "text-blue-400", delay: 1 },
  { emoji: "💎", color: "text-pink-400", delay: 1.5 },
  { emoji: "✨", color: "text-purple-400", delay: 2 },
  { emoji: "✨", color: "text-yellow-400", delay: 2.5 },
  { emoji: "✨", color: "text-green-400", delay: 3 },
  { emoji: "✨", color: "text-blue-400", delay: 3.5 },
];

const positions = [
  { top: "10%", left: "10%" },
  { top: "20%", right: "15%" },
  { bottom: "30%", left: "5%" },
  { bottom: "20%", right: "10%" },
  { top: "50%", left: "5%" },
  { top: "30%", right: "5%" },
  { bottom: "40%", left: "25%" },
  { top: "70%", right: "25%" },
];

export default function FloatingGems() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {gems.map((gem, index) => (
        <motion.div
          key={index}
          className={`absolute ${gem.color} text-2xl select-none`}
          style={positions[index]}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            delay: gem.delay,
            ease: "easeInOut"
          }}
        >
          {gem.emoji}
        </motion.div>
      ))}
    </div>
  );
}
