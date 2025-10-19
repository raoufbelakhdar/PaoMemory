import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  FileText, 
  Wand2, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  HelpCircle, 
  Home,
  Copy,
  Check
} from 'lucide-react';
import { VideoTutorialModal } from './VideoTutorialModal';

interface OnboardingScreenProps {
  onComplete: () => void;
}

// Move these components OUTSIDE the main component
const PromptBox = ({ prompt, label = "Copy this prompt" }: { prompt: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 text-left">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-600 uppercase">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 max-h-48 overflow-auto">
        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
          {prompt}
        </pre>
      </div>
    </div>
  );
};

const OnboardingSlide = ({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-start h-full px-6 pt-8 pb-4 text-center overflow-y-auto">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-5 rounded-3xl shadow-2xl">
          <Icon className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 text-base mb-6 max-w-md"
      >
        {description}
      </motion.p>

      {children && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md space-y-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Main component
export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '' });

  const importPrompt = `Convert your PAO list to this format:

00 - Person: Harry Potter | Action: Casting spell | Object: Wand
01 - Person: Albert Einstein | Action: Writing equation | Object: Chalkboard
02 - Person: Hermione Granger | Action: Reading | Object: Book
...

Then paste it in the Import section. The app will convert it automatically!`;

  const createPrompt = `Create a complete PAO (Person-Action-Object) system for numbers 00-99.

For each number, assign:
- A memorable PERSON (celebrity, character, or figure)
- An ACTION they commonly do
- An OBJECT associated with them

Format exactly like this:
00 - Person: Harry Potter | Action: Casting spell | Object: Wand
01 - Person: Albert Einstein | Action: Writing equation | Object: Chalkboard
02 - Person: Hermione Granger | Action: Reading | Object: Book

Continue for all numbers 00 to 99. Make them vivid, memorable, and personally meaningful!`;

  const openVideo = (url: string, title: string) => {
    setCurrentVideo({ url, title });
    setShowVideoModal(true);
  };

  const slides = [
    {
      icon: Brain,
      title: "Welcome to PAO Memory",
      description: "Master the Person-Action-Object technique to remember numbers effortlessly. Transform digits into vivid stories!",
      content: (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-5 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-purple-600">02</span>
            <span className="text-gray-400">→</span>
            <span className="text-sm text-gray-700">Hermione Granger Reading a Book</span>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Each number becomes a memorable image in your mind!
          </p>
        </div>
      )
    },
    {
      icon: FileText,
      title: "Import Your PAO",
      description: "Already have a PAO system? Paste it in plain text format and we'll set it up for you instantly.",
      content: (
        <>
          <PromptBox prompt={importPrompt} label="Text Format Guide" />
          <button
            onClick={() => openVideo('https://youtu.be/import-tutorial', 'How to Import Your PAO')}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Import Tutorial
          </button>
        </>
      )
    },
    {
      icon: Wand2,
      title: "Create with AI",
      description: "Let AI build your personalized PAO system. Copy this prompt and use it with ChatGPT, Claude, or any AI assistant:",
      content: (
        <>
          <PromptBox prompt={createPrompt} label="AI Prompt - Copy & Use" />
          <button
            onClick={() => openVideo('https://youtu.be/create-tutorial', 'How to Create PAO with AI')}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Creation Tutorial
          </button>
        </>
      )
    },
    {
      icon: Sparkles,
      title: "You're Ready!",
      description: "Start practicing, create stories, and unlock your memory potential. Need help? Access the guide anytime from Settings.",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-5 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 p-2 rounded-full">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Need Help Later?</span>
            </div>
            <p className="text-sm text-gray-600">
              Find "View Guide" in Settings to watch these tutorials anytime.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>Ready to start your memory journey!</span>
          </div>
        </div>
      )
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    if (currentSlide + newDirection >= 0 && currentSlide + newDirection < slides.length) {
      setDirection(newDirection);
      setCurrentSlide(currentSlide + newDirection);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white z-40 flex flex-col"
      >
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 pt-6 pb-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              <OnboardingSlide 
                icon={slides[currentSlide].icon}
                title={slides[currentSlide].title}
                description={slides[currentSlide].description}
              >
                {slides[currentSlide].content}
              </OnboardingSlide>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6 flex items-center justify-between bg-white border-t border-gray-100">
          <button
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            className={`p-3 rounded-xl transition-all ${
              currentSlide === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {currentSlide === slides.length - 1 ? (
            <button
              onClick={handleFinish}
              className="flex-1 mx-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-xl transition-all"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
            >
              Skip
            </button>
          )}

          <button
            onClick={() => paginate(1)}
            disabled={currentSlide === slides.length - 1}
            className={`p-3 rounded-xl transition-all ${
              currentSlide === slides.length - 1
                ? 'opacity-0 pointer-events-none'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg text-white'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showVideoModal && (
          <VideoTutorialModal
            isOpen={showVideoModal}
            onClose={() => setShowVideoModal(false)}
            videoUrl={currentVideo.url}
            title={currentVideo.title}
          />
        )}
      </AnimatePresence>
    </>
  );
};