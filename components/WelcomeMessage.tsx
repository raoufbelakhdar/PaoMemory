import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WelcomeMessageProps {
  userName: string;
}

export function WelcomeMessage({ userName }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome message
    const hasSeenWelcome = localStorage.getItem('pao-seen-welcome');
    
    if (!hasSeenWelcome) {
      setIsVisible(true);
      localStorage.setItem('pao-seen-welcome', 'true');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className="glass-strong rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <div>
            <h2 className="text-2xl mb-2">Welcome, {userName}! 🎉</h2>
            <p className="text-muted-foreground">
              You're all set to master the Person-Action-Object memory technique!
            </p>
          </div>

          <div className="w-full space-y-3 mt-2">
            <div className="glass rounded-2xl p-4 text-left">
              <p className="text-sm">
                <strong>Getting Started:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Start by exploring the default PAO system</li>
                <li>• Create your own custom PAO items</li>
                <li>• Practice with interactive exercises</li>
                <li>• Track your progress as you learn</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 transition-colors"
          >
            Let's Get Started!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
