import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  userName?: string;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export function Header({ userName, theme, onThemeChange }: HeaderProps) {
  return (
    <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        
        {/* Left side - App title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">PAO Memory</h1>
            <p className="text-xs text-muted-foreground">Memorize Numbers Faster</p>
          </div>
        </div>

        {/* Right side - user + theme toggle */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="text-sm text-muted-foreground">
              👋 Hi, <span className="font-medium text-foreground">{userName}</span>
            </div>
          )}

          {theme && onThemeChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl w-10 h-10 p-0"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Moon size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </Button>
          )}
        </div>

      </div>
    </header>
  );
}
