
import { motion } from 'framer-motion';
import { X, PlayCircle } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const VideoTutorialModal = ({ isOpen, onClose, videoUrl, title }: VideoTutorialModalProps) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-gray-900">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Video Player</p>
                    <p className="text-xs mt-1 opacity-75">Your video URL: {videoUrl}</p>
                  </div>
                </div>
              </div>
            </motion.div>
    </motion.div>
  );
};