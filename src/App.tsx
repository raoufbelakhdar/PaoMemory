import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { InputBar } from '../components/InputBar';
import { StoryOutput } from '../components/StoryOutput';
import { PAOCards } from '../components/PAOCards';
import { BottomNav } from '../components/BottomNav';
import { CreatePage } from '../components/CreatePage';
import { PracticePage } from '../components/PracticePage';
import { SettingsPage } from '../components/SettingsPage';
import { paoData } from '../data/pao-data';

import { SplashScreen } from '../components/SplashScreen';
import { OnboardingCarousel } from '../components/OnboardingCarousel';
import { ImportFlow } from '../components/ImportFlow';
import { CreateFlow } from '../components/CreateFlow';
import { AuthPage } from '../components/AuthPage';
import { ProfilePage } from '../components/ProfilePage';
import { WelcomeMessage } from '../components/WelcomeMessage';
import type { AppPage } from './types/AppPage';

// --- Interfaces ---
const defaultPAOData = paoData;

export interface PAOState {
  person: string;
  action: string;
  object: string;
}

export interface NumberInputs {
  person: string;
  action: string;
  object: string;
}

export interface CustomPAOItem {
  id: string;
  number: number;
  title: string;
  imageUrl: string;
  type: 'person' | 'action' | 'object';
}

export interface User {
  email: string;
  name: string;
}


// --- MAIN APP ---
export default function App() {
  const [currentFlow, setCurrentFlow] = useState<'splash' | 'onboarding-choice' | 'onboarding-import' | 'onboarding-create' | 'auth' | 'app'>('splash');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [user, setUser] = useState<User | null>(null);
  const [customPAOData, setCustomPAOData] = useState<CustomPAOItem[]>([]);
  const [tempOnboardingPAOData, setTempOnboardingPAOData] = useState<CustomPAOItem[]>([]);
  const [practiceMode, setPracticeMode] = useState<'menu' | 'exercise'>('menu');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [hasInteracted, setHasInteracted] = useState(false);

  const [numberInputs, setNumberInputs] = useState<NumberInputs>({
    person: '00',
    action: '00',
    object: '00'
  });

  const [paoState, setPaoState] = useState<PAOState>({
    person: 'Ballerina',
    action: 'bouncing',
    object: 'ball'
  });

  // --- Theme ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('pao-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pao-theme', theme);
  }, [theme]);

  // --- Load PAO Data ---
  useEffect(() => {
    const savedData = localStorage.getItem('custom-pao-data');
    if (savedData) {
      try {
        setCustomPAOData(JSON.parse(savedData));
      } catch (err) {
        console.error('Failed to parse PAO data', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('custom-pao-data', JSON.stringify(customPAOData));
  }, [customPAOData]);

  // --- Update displayed PAO ---
  useEffect(() => {
    const personNum = parseInt(numberInputs.person);
    const actionNum = parseInt(numberInputs.action);
    const objectNum = parseInt(numberInputs.object);

    let newPaoState: PAOState = { person: 'Unknown', action: 'unknown', object: 'unknown' };

    if (!isNaN(personNum) && defaultPAOData[personNum])
      newPaoState.person = defaultPAOData[personNum].person;
    if (!isNaN(actionNum) && defaultPAOData[actionNum])
      newPaoState.action = defaultPAOData[actionNum].action;
    if (!isNaN(objectNum) && defaultPAOData[objectNum])
      newPaoState.object = defaultPAOData[objectNum].object;

    setPaoState(newPaoState);
  }, [numberInputs]);

  // --- Handlers ---
  const handlePAONumberChange = (field: 'person' | 'action' | 'object', value: string) => {
    setNumberInputs(prev => ({ ...prev, [field]: value }));
    setHasInteracted(true);
  };

  const handleAddCustomPAO = (item: Omit<CustomPAOItem, 'id'>) => {
    const newItem: CustomPAOItem = {
      ...item,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setCustomPAOData(prev => [...prev, newItem]);
  };

  const handleEditCustomPAO = (id: string, updatedItem: Omit<CustomPAOItem, 'id'>) => {
    setCustomPAOData(prev => prev.map(item => (item.id === id ? { ...updatedItem, id } : item)));
  };

  const handleDeleteCustomPAO = (id: string) => {
    setCustomPAOData(prev => prev.filter(item => item.id !== id));
  };

  const handleImportPAOData = (importedData: CustomPAOItem[]) => {
    setCustomPAOData(prev => [...prev, ...importedData]);
  };

  const handlePracticeModeChange = (mode: 'menu' | 'flashcards' | 'quiz-challenge' | 'sequence-challenge' | 'speed-training') => {
    setPracticeMode(mode === 'menu' ? 'menu' : 'exercise');
  };

  const handlePageChange = (page: AppPage) => {
    setCurrentPage(page);
    if (page !== 'practice') setPracticeMode('menu');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => setTheme(newTheme);

  // --- Onboarding & Auth flow handlers ---
  const handleSplashComplete = () => setCurrentFlow('onboarding-choice');

  const handleOnboardingChoice = (choice: 'import' | 'create') =>
    setCurrentFlow(choice === 'import' ? 'onboarding-import' : 'onboarding-create');

  const handleOnboardingBackToChoice = () => setCurrentFlow('onboarding-choice');

  const handleOnboardingSkip = () => setCurrentFlow('auth');

  const handleImportComplete = (data: CustomPAOItem[]) => {
    setTempOnboardingPAOData(data);
    setCurrentFlow('auth');
  };

  const handleCreateComplete = (data: CustomPAOItem[]) => {
    setTempOnboardingPAOData(data);
    setCurrentFlow('auth');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (tempOnboardingPAOData.length > 0) {
      setCustomPAOData(prev => [...prev, ...tempOnboardingPAOData]);
      setTempOnboardingPAOData([]);
    }
    setCurrentFlow('app');
  };

  const handleSkipAuth = () => {
    const guestUser: User = { email: 'guest@paomaster.app', name: 'Guest' };
    setUser(guestUser);
    if (tempOnboardingPAOData.length > 0) {
      setCustomPAOData(prev => [...prev, ...tempOnboardingPAOData]);
      setTempOnboardingPAOData([]);
    }
    setCurrentFlow('app');
  };

  // --- Page Renderer ---
  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return (
          <CreatePage
            customPAOData={customPAOData}
            onAddCustomPAO={handleAddCustomPAO}
            onEditCustomPAO={handleEditCustomPAO}
            onDeleteCustomPAO={handleDeleteCustomPAO}
          />
        );
      case 'practice':
        return (
          <PracticePage
            defaultPAOData={defaultPAOData}
            customPAOData={customPAOData}
            onModeChange={handlePracticeModeChange}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            theme={theme}
            onThemeChange={handleThemeChange}
            customPAOData={customPAOData}
            onImportPAOData={handleImportPAOData}
            onShowOnboarding={handleOnboardingSkip}
          />
        );
      case 'profile':
        return user ? (
          <ProfilePage
            user={user}
            onLogout={() => setUser(null)}
            customPAOCount={customPAOData.length}
            customPAOData={customPAOData}
          />
        ) : null;
      default:
        return (
          <main className="flex-1 px-6 pb-24">
            <InputBar
              numberInputs={numberInputs}
              paoState={paoState}
              onPAONumberChange={handlePAONumberChange}
              defaultPAOData={defaultPAOData}
            />
            <StoryOutput paoState={paoState} />
            <PAOCards paoState={paoState} defaultPAOData={defaultPAOData} numberInputs={numberInputs} />
            {!user && hasInteracted && (
              <div className="mt-8 glass rounded-3xl p-6 text-center shadow-medium border border-white/20">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">✨</span>
                  <h4>Ready to save your progress?</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create an account to build and practice your complete PAO system
                </p>
              </div>
            )}
          </main>
        );
    }
  };

  // --- Flow Rendering ---
  if (currentFlow === 'splash') return <SplashScreen onComplete={handleSplashComplete} />;

  if (currentFlow === 'onboarding-choice')
    return <OnboardingCarousel onComplete={handleOnboardingChoice} onSkip={handleOnboardingSkip} />;

  if (currentFlow === 'onboarding-import')
    return <ImportFlow onComplete={handleImportComplete} onBack={handleOnboardingBackToChoice} />;

  if (currentFlow === 'onboarding-create')
    return <CreateFlow onComplete={handleCreateComplete} onBack={handleOnboardingBackToChoice} />;

  if (currentFlow === 'auth')
    return <AuthPage onLogin={handleLogin} onSkip={handleSkipAuth} hasPAOData={tempOnboardingPAOData.length > 0} />;

  // --- Main App ---
  const shouldShowHeader = currentPage !== 'practice' || practiceMode === 'menu';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex flex-col">
      {shouldShowHeader && (
        <Header
          userName={user?.name}
          theme={theme}
          onThemeChange={handleThemeChange}
        />
      )}
      {renderPage()}
      <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      {user && <WelcomeMessage userName={user.name} />}
    </div>
  );
}
