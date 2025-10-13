//import React from 'react';

export function Header() {
  return (
    <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-xl">🧠</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">PAO Memory</h1>
            <p className="text-xs text-muted-foreground">Build your memory palace</p>
          </div>
        </div>
      </div>
    </header>
  );
}