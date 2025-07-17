import { motion } from "framer-motion";
import expLogoImage from "@assets/99bd69fadb3e36af30d22079a2d800ac-removebg-preview_1752771882095.png";

interface ExpLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ExpLogo({ size = "md", className = "" }: ExpLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} flex items-center justify-center ${className}`}
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <img 
        src={expLogoImage} 
        alt="EXP Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {/* Sparkle effects */}
      <motion.div
        className="absolute top-0 right-0 text-yellow-400 text-xs"
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5
        }}
      >
        ✨
      </motion.div>
    </motion.div>
  );
}
