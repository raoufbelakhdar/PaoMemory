import { Download, Sparkles } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: (choice: 'import' | 'create') => void;
  onSkip: () => void;
}

export function OnboardingCarousel({ onComplete, onSkip }: OnboardingCarouselProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-10 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col px-6 py-8 pt-12">
        {/* Skip button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Title section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Set up your PAO System
          </h1>
          <p className="text-muted-foreground">
            Choose how you'd like to begin
          </p>
        </div>

        {/* Choice cards */}
        <div className="flex-1 flex flex-col justify-center gap-5 max-w-md mx-auto w-full">
          {/* Import Card */}
          <button
            onClick={() => onComplete('import')}
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Glass background */}
            <div className="absolute inset-0 glass-strong shadow-xl" />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-chart-2/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-2 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Download className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="px-3 py-1.5 rounded-full glass text-xs backdrop-blur-xl border border-white/20">
                  Have a list?
                </div>
              </div>
              
              <h2 className="text-2xl mb-2">Import my PAO</h2>
              <p className="text-muted-foreground leading-relaxed">
                Already have a PAO system? Import your existing list and start training immediately.
              </p>
              
              <div className="mt-6 flex items-center text-chart-2 group-hover:translate-x-2 transition-transform">
                <span className="text-sm">Get started</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Create Card */}
          <button
            onClick={() => onComplete('create')}
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Glass background */}
            <div className="absolute inset-0 glass-strong shadow-xl" />
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="px-3 py-1.5 rounded-full glass text-xs backdrop-blur-xl border border-white/20">
                  AI powered
                </div>
              </div>
              
              <h2 className="text-2xl mb-2">Create my PAO</h2>
              <p className="text-muted-foreground leading-relaxed">
                Start fresh with AI. Generate a complete PAO system from scratch using ChatGPT.
              </p>
              
              <div className="mt-6 flex items-center text-primary group-hover:translate-x-2 transition-transform">
                <span className="text-sm">Get started</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            You can change this later in Settings
          </p>
        </div>
      </div>
    </div>
  );
}
