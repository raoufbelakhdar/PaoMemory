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

// Import PAO data from TypeScript module
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

export type AppPage = 'home' | 'create' | 'practice' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [customPAOData, setCustomPAOData] = useState<CustomPAOItem[]>([]);
  const [practiceMode, setPracticeMode] = useState<'menu' | 'exercise'>('menu');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [numberInputs, setNumberInputs] = useState<NumberInputs>({
    person: '02',
    action: '02', 
    object: '02'
  });
  
  const [paoState, setPaoState] = useState<PAOState>({
    person: 'Ballerina',
    action: 'bouncing',
    object: 'ball'
  });
  
  const [hasInteracted, setHasInteracted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pao-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pao-theme', theme);
  }, [theme]);

  // Load custom PAO data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('custom-pao-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCustomPAOData(parsedData);
      } catch (error) {
        console.error('Failed to load custom PAO data:', error);
      }
    }
  }, []);

  // Save custom PAO data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('custom-pao-data', JSON.stringify(customPAOData));
  }, [customPAOData]);

  // Update PAO when any number input changes
useEffect(() => {
  const personNum = parseInt(numberInputs.person, 10);
  const actionNum = parseInt(numberInputs.action, 10);
  const objectNum = parseInt(numberInputs.object, 10);

  const newPaoState: PAOState = {
    person: '',
    action: '',
    object: ''
  };

  if (!isNaN(personNum) && defaultPAOData[personNum]) {
    newPaoState.person = defaultPAOData[personNum].person;
  }

  if (!isNaN(actionNum) && defaultPAOData[actionNum]) {
    newPaoState.action = defaultPAOData[actionNum].action;
  }

  if (!isNaN(objectNum) && defaultPAOData[objectNum]) {
    newPaoState.object = defaultPAOData[objectNum].object;
  }

  setPaoState(newPaoState);
}, [numberInputs]);


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
    setCustomPAOData(prev => prev.map(item => 
      item.id === id ? { ...updatedItem, id } : item
    ));
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
    // Reset practice mode when leaving practice page
    if (page !== 'practice') {
      setPracticeMode('menu');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

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
          />
        );
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
            
            {hasInteracted && (
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

  // Determine if header should be shown
  const shouldShowHeader = currentPage !== 'practice' || practiceMode === 'menu';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex flex-col">
      {shouldShowHeader && <Header />}
      
      {renderPage()}
      
      <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}