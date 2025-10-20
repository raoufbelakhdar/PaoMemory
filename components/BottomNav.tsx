import { Home, Plus, Play, Settings, UserCircle } from 'lucide-react';
import type { AppPage } from '../src/types/AppPage';


interface BottomNavProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Home', page: 'home' as AppPage },
    { icon: Plus, label: 'Create', page: 'create' as AppPage },
    { icon: Play, label: 'Practice', page: 'practice' as AppPage },
    { icon: Settings, label: 'Settings', page: 'settings' as AppPage },
    { icon: UserCircle, label: 'Profile', page: 'profile' as AppPage }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Enhanced glass background with better contrast */}
      <div className="relative">
        {/* Glass morphism layer with enhanced backdrop blur for transparency */}
        <div className="relative shadow-2xl">
          {/* Top accent line with gradient */}
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full" />
          
          <nav className="flex items-center justify-around py-4 px-2 nav-glass">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              
              return (
                <button
                  key={item.label}
                  onClick={() => onPageChange(item.page)}
                  className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-300 ease-out min-w-0 flex-1 max-w-[72px] group ${
                    isActive 
                      ? 'text-primary nav-item-active scale-105' 
                      : 'text-slate-600 nav-item-inactive hover:scale-105'
                  }`}
                >
                  {/* Active state background with enhanced styling */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-2xl border border-primary/25 shadow-lg dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 dark:border-primary/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-2xl" />
                    </>
                  )}
                  
                  {/* Enhanced hover state */}
                  <div className="absolute inset-0 bg-slate-500/0 group-hover:bg-slate-500/8 dark:group-hover:bg-slate-400/10 rounded-2xl transition-colors duration-300" />
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    {/* Icon container with enhanced styling */}
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/12 shadow-sm dark:bg-primary/20' 
                        : 'bg-transparent group-hover:bg-slate-500/8 dark:group-hover:bg-slate-400/10'
                    }`}>
                      <Icon 
                        size={20} 
                        strokeWidth={isActive ? 2.5 : 2}
                        className="transition-all duration-300"
                      />
                    </div>
                    
                    {/* Enhanced label styling */}
                    <span className={`text-[10px] transition-all duration-300 ${
                      isActive 
                        ? 'font-semibold' 
                        : 'font-medium'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Enhanced active indicator */}
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-sm" />
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    </>
                  )}
                  
                  {/* Interaction ripple effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-primary/10 transition-opacity duration-150" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Enhanced safe area spacing with transparency */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white/85 dark:bg-slate-900/85" />
    </div>
  );
}