import { User, Mail, LogOut, Shield, Database, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ProfilePageProps {
  user: {
    email: string;
    name: string;
  };
  onLogout: () => void;
  customPAOCount: number;
}

export function ProfilePage({ user, onLogout, customPAOCount }: ProfilePageProps) {
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your custom PAO data? This cannot be undone.')) {
      localStorage.removeItem('custom-pao-data');
      window.location.reload();
    }
  };

  return (
    <main className="flex-1 px-6 pb-24 pt-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass-strong rounded-3xl p-6 shadow-medium">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl">{user.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl glass">
            <div className="text-center">
              <div className="text-3xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                {customPAOCount}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Custom PAOs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                100
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total Numbers</p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="glass-strong rounded-3xl p-6 shadow-medium">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Settings
          </h3>

          <div className="space-y-3">
            {/* Data info */}
            <div className="p-4 rounded-xl glass flex items-start gap-3">
              <Database className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">Local Storage</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your data is stored locally on this device only
                </p>
              </div>
            </div>

            {/* Clear data */}
            <button
              onClick={handleClearData}
              className="w-full p-4 rounded-xl glass flex items-center gap-3 hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/30"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
              <div className="flex-1 text-left">
                <p className="text-sm text-destructive">Clear All Data</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Remove all custom PAO entries
                </p>
              </div>
            </button>

            {/* Logout */}
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground text-center">
            PAO Master • Version 1.0.0
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Master the art of memory with Person-Action-Object system
          </p>
        </div>
      </div>
    </main>
  );
}
