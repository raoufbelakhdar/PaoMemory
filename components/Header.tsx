
interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
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

        {/* Right side - optional user greeting */}
        {userName && (
          <div className="text-sm text-muted-foreground">
            👋 Hi, <span className="font-medium text-foreground">{userName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
