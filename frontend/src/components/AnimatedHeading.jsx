import { motion as Motion } from "framer-motion";


function AnimatedHeading() {
  return (
    <Motion.h1
      initial={{ opacity: 0, x: -50 }} // Start invisible & shifted left
      animate={{ opacity: 1, x: 0 }}  // Animate to normal position
      transition={{
        duration: 1.2, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      }}
      className="text-6xl font-[Open_Sans] font-bold mb-20 mr-10 ml-0 text-gray-800 drop-shadow-xs"
    >
      Prepare for GATE with Real Mock Tests
    </Motion.h1>
  );
}

export default AnimatedHeading;
