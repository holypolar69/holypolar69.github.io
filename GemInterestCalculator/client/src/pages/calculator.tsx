import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator as CalculatorIcon, Clock, Gem, TrendingUp, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import ExpLogo from "@/components/exp-logo";
import FloatingGems from "@/components/floating-gems";
import { useSound } from "@/hooks/use-sound";

const timeOptions = [
  { label: "1 Day", days: 1, hours: 24, gradient: "from-purple-500 to-pink-500" },
  { label: "2 Days", days: 2, hours: 48, gradient: "from-blue-500 to-cyan-500" },
  { label: "3 Days", days: 3, hours: 72, gradient: "from-green-500 to-teal-500" },
  { label: "7 Days", days: 7, hours: 168, gradient: "from-yellow-500 to-orange-500" },
  { label: "14 Days", days: 14, hours: 336, gradient: "from-red-500 to-pink-500" },
  { label: "30 Days", days: 30, hours: 720, gradient: "from-indigo-500 to-purple-500" },
  { label: "90 Days", days: 90, hours: 2160, gradient: "from-rose-500 to-pink-500" },
];

export default function Calculator() {
  const [startingGems, setStartingGems] = useState<number>(0);
  const [startingGemsInput, setStartingGemsInput] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(24);
  const [customDays, setCustomDays] = useState<string>("");
  const [results, setResults] = useState<{
    finalGems: number;
    totalProfit: number;
    percentage: number;
  } | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [animatedFinalGems, setAnimatedFinalGems] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { playGemChime, playButtonClick } = useSound();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper function to parse shorthand numbers (1b, 1m, 1k)
  const parseShorthandNumber = (value: string): number => {
    if (!value) return 0;
    
    const cleanValue = value.toLowerCase().trim();
    const lastChar = cleanValue.slice(-1);
    const numPart = parseFloat(cleanValue.slice(0, -1));
    
    if (lastChar === 'b' && !isNaN(numPart)) {
      return numPart * 1000000000; // billion
    } else if (lastChar === 'm' && !isNaN(numPart)) {
      return numPart * 1000000; // million
    } else if (lastChar === 'k' && !isNaN(numPart)) {
      return numPart * 1000; // thousand
    } else {
      return parseFloat(cleanValue) || 0;
    }
  };

  // Helper function to format number with shorthand
  const formatShorthandNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'b';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num.toLocaleString();
    }
  };

  const handleGemsInputChange = (value: string) => {
    setStartingGemsInput(value);
    const parsedValue = parseShorthandNumber(value);
    setStartingGems(parsedValue);
  };

  const calculateInterest = () => {
    if (!startingGems || startingGems <= 0 || !selectedHours || selectedHours <= 0) {
      setResults(null);
      setShowProgress(false);
      return;
    }

    setIsCalculating(true);
    playButtonClick();

    // Add a brief delay for smooth animation
    setTimeout(() => {
      // Formula: Final = Gems × (1 + 0.001/24)^Hours
      const dailyRate = 0.001; // 0.10% as decimal
      const hourlyRate = dailyRate / 24;
      const finalGems = startingGems * Math.pow(1 + hourlyRate, selectedHours);
      const totalProfit = finalGems - startingGems;
      const percentage = ((finalGems - startingGems) / startingGems) * 100;

      setResults({
        finalGems: Math.round(finalGems),
        totalProfit: Math.round(totalProfit),
        percentage
      });

      // Play sound effect
      playGemChime();

      // Trigger progress animation
      setShowProgress(true);
      setIsCalculating(false);

      // Scroll to results section after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 600);
    }, 300);
  };

  // Animate numbers counting up
  useEffect(() => {
    if (results) {
      const duration = 1000; // 1 second
      const steps = 60; // 60fps
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        setAnimatedFinalGems(Math.round(results.finalGems * easeOut));
        setAnimatedProfit(Math.round(results.totalProfit * easeOut));
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [results]);

  // Clear results when inputs change (but don't auto-calculate)
  useEffect(() => {
    if (results) {
      setResults(null);
      setShowProgress(false);
    }
  }, [startingGems, selectedHours]);

  const handleTimeOptionClick = (hours: number) => {
    setSelectedHours(hours);
    setCustomDays("");
    playButtonClick();
  };

  const handleCustomDaysChange = (value: string) => {
    setCustomDays(value);
    const customValue = parseFloat(value);
    if (customValue && customValue > 0) {
      setSelectedHours(customValue * 24); // Convert days to hours
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 font-poppins overflow-x-hidden">
      <FloatingGems />
      
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <motion.div 
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ExpLogo size="lg" className="animate-pulse-slow" />
          <motion.h1 
            className="font-fredoka text-4xl md:text-6xl text-white glow-effect"
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 107, 107, 0.5)",
                "0 0 30px rgba(78, 205, 196, 0.8)",
                "0 0 20px rgba(255, 107, 107, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💎 EXP Interest Calculator 💎
          </motion.h1>
        </motion.div>
        <motion.div 
          className="text-purple-200 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <span>Calculate how many gems you'll earn with our 0.10% daily interest rate, compounded hourly! </span>
          <Tooltip>
            <TooltipTrigger className="inline-block ml-2 cursor-pointer">
              <div className="inline-flex items-center justify-center w-5 h-5 bg-cyan-400/20 rounded-full">
                <span className="text-cyan-400 text-sm">?</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div>Interest compounds every hour, meaning your gems earn gems on gems!</div>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </header>

      {/* Main Calculator */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <motion.div 
          className="glass-effect rounded-3xl p-6 md:p-8 gem-shadow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Mobile-First Layout */}
          <div className="space-y-6">
            {/* Starting Gems Input - Full Width on Mobile */}
            <div className="w-full">
              <Label className="flex items-center justify-center text-white font-semibold text-xl brightness-125 mb-4">
                <Gem className="w-6 h-6 text-yellow-400 mr-2" />
                Starting Gems
              </Label>
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Enter gems (e.g., 1b, 500m, 1.5k)..."
                  value={startingGemsInput}
                  onChange={(e) => handleGemsInputChange(e.target.value)}
                  className="w-full px-6 py-5 bg-white/10 backdrop-blur border-2 border-white/20 rounded-3xl text-white text-xl font-bold placeholder-white/50 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 smooth-all focus:bg-white/20 text-center hover:bg-white/15 focus:scale-105 [&:not(:placeholder-shown)]:text-white"
                />
                {startingGems > 0 && startingGemsInput && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-center text-cyan-300 text-sm font-medium drop-shadow-sm"
                  >
                    = {formatShorthandNumber(startingGems)} gems
                  </motion.div>
                )}
              </div>
            </div>

            {/* Time Duration Selector - Responsive Grid */}
            <div className="w-full">
              <Label className="flex items-center justify-center text-white font-semibold text-xl brightness-125 mb-4">
                <Clock className="w-6 h-6 text-green-400 mr-2" />
                Time Duration
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {timeOptions.map((option) => (
                  <motion.button
                    key={option.hours}
                    onClick={() => handleTimeOptionClick(option.hours)}
                    className={`px-3 py-4 bg-gradient-to-r ${option.gradient} text-white rounded-2xl font-semibold smooth-all text-sm md:text-base hover:shadow-lg active:shadow-inner ${
                      selectedHours === option.hours && !customDays
                        ? "ring-4 ring-white/50 scale-105 shadow-xl"
                        : "hover:scale-105 hover:shadow-lg"
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
                <Input
                  type="number"
                  placeholder="Custom days"
                  value={customDays}
                  onChange={(e) => handleCustomDaysChange(e.target.value)}
                  className="px-4 py-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white font-semibold placeholder-white/50 focus:border-cyan-400 focus:outline-none smooth-all focus:bg-white/20 text-center hover:bg-white/15 focus:scale-105 [&:not(:placeholder-shown)]:text-white"
                />
              </div>
            </div>

            {/* Calculate Button - Centered and Prominent */}
            <div className="text-center pt-4">
              <motion.div 
                whileHover={{ scale: 1.05, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={calculateInterest}
                  disabled={isCalculating}
                  className={`rainbow-gradient px-8 py-5 md:px-12 md:py-6 rounded-3xl text-white font-bold text-lg md:text-xl shadow-2xl hover:shadow-cyan-500/50 smooth-all w-full max-w-md relative overflow-hidden ${
                    isCalculating ? "animate-pulse cursor-not-allowed" : "hover:shadow-2xl active:shadow-inner"
                  }`}
                >
                  <CalculatorIcon className={`w-5 h-5 mr-2 smooth-transform ${isCalculating ? "animate-spin" : ""}`} />
                  {isCalculating ? "Calculating..." : "Calculate My Gems! ✨"}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {results && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 gap-4 mb-8 mt-8"
              >
                {/* Final Gems */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="glass-effect border-2 border-yellow-400/30 hover:border-yellow-400/50 smooth-all hover:shadow-xl min-h-[120px]">
                    <CardContent className="p-4 md:p-6 text-center">
                      <motion.div 
                        className="text-yellow-400 text-4xl md:text-5xl mb-2"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💎
                      </motion.div>
                      <div className="text-white/90 text-sm font-medium mb-1 drop-shadow-sm">Final Gems</div>
                      <motion.div 
                        className="text-white font-bold text-xl md:text-2xl animate-result-pop drop-shadow-md"
                        key={results.finalGems}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                      >
                        {formatShorthandNumber(animatedFinalGems)}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Total Profit */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="glass-effect border-2 border-green-400/30 hover:border-green-400/50 smooth-all hover:shadow-xl min-h-[120px]">
                    <CardContent className="p-4 md:p-6 text-center">
                      <motion.div 
                        className="text-green-400 text-4xl md:text-5xl mb-2"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        📈
                      </motion.div>
                      <div className="text-white/80 text-sm font-medium mb-1">Total Profit</div>
                      <motion.div 
                        className="text-green-400 font-bold text-xl md:text-2xl animate-result-pop"
                        key={results.totalProfit}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                      >
                        +{formatShorthandNumber(animatedProfit)}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Interest Rate Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="glass-effect border-2 border-cyan-400/30 hover:border-cyan-400/50 smooth-all hover:shadow-xl min-h-[120px]">
                    <CardContent className="p-4 md:p-6 text-center">
                      <motion.div 
                        className="text-cyan-400 text-4xl md:text-5xl mb-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚡
                      </motion.div>
                      <div className="text-white/80 text-sm font-medium mb-1">Daily Rate</div>
                      <div className="text-cyan-400 font-bold text-xl md:text-2xl">0.10%</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Visualization */}
          <AnimatePresence>
            {showProgress && results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-effect rounded-2xl p-4 md:p-6"
              >
                <h3 className="text-white font-semibold text-lg mb-4 text-center flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  Gem Growth Progress
                </h3>
                <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rainbow-gradient rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between text-white/80 text-sm mt-2">
                  <span>Start</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    +{results.percentage.toFixed(2)}%
                  </motion.span>
                  <span>Complete</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Discord Invite */}
      <footer className="relative z-10 max-w-2xl mx-auto px-4 pb-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-white font-fredoka text-2xl mb-4">Join Our Community! 🎮</h2>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="rainbow-gradient px-8 py-6 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
              <a
                href="https://discord.gg/gems"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <div className="mr-3 text-2xl">🎮</div>
                Join the EXP Discord 💬
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </motion.div>
          
          {/* Polar credit */}
          <div className="text-center mt-8">
            <p className="text-white/20 text-xs font-light">polar</p>
          </div>
        </motion.div>
      </footer>
      </div>
    </TooltipProvider>
  );
}
