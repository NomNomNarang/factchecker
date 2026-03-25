import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LandingPage = ({ onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen flex flex-col items-center justify-center bg-white"
    >
      <div className="flex items-center gap-6">
        <h1 
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "'Outfit', 'SF Pro Display', sans-serif" }}
        >
          Verify a claim?
        </h1>
        <motion.button
          onClick={onContinue}
          data-testid="landing-continue-button"
          whileHover={{ x: 8, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 shadow-sm hover:shadow-md"
          aria-label="Continue to fact-checking"
        >
          <ArrowRight className="w-8 h-8 text-gray-900" strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LandingPage;