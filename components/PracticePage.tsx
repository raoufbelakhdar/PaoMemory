import { useState, useEffect } from 'react';
import { Brain, CreditCard, Target, Shuffle, ArrowLeft, ArrowRight, Check, X, RotateCcw, Eye, EyeOff, Clock, Zap, Timer, Play, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CustomPAOItem } from '../src/App';

interface PracticePageProps {
  defaultPAOData: any;
  customPAOData: CustomPAOItem[];
  onModeChange?: (mode: PracticeMode) => void;
}

type PracticeMode = 'menu' | 'flashcards' | 'quiz-challenge' | 'sequence-challenge' | 'speed-training';
type PAOType = 'person' | 'action' | 'object';
type SpeedTrainingMode = 'number-to-name' | 'name-to-number';
type QuizType = 'name-to-number' | 'number-to-name' | 'mixed';

interface QuizQuestion {
  id: string;
  type: 'name-to-number' | 'number-to-name';
  paoType: PAOType;
  question: string;
  correctAnswer: string;
  options: string[];
  number: number;
}

interface FlashcardData {
  number: number;
  person: string;
  action: string;
  object: string;
  images: {
    person: string;
    action: string;
    object: string;
  };
}

interface SequenceChallenge {
  numbers: number[];
  story: string;
  revealed: boolean;
}

interface SpeedTrainingCard {
  number: number;
  paoType: PAOType;
  name: string;
  image: string;
}

interface NumberRange {
  start: number;
  end: number;
  useAll: boolean;
}

interface QuizSettings {
  questionType: QuizType;
  questionCount: number;
  range: NumberRange;
}

export function PracticePage({ defaultPAOData, onModeChange }: PracticePageProps) {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('menu');

  // Notify parent when mode changes
  useEffect(() => {
    onModeChange?.(currentMode);
  }, [currentMode, onModeChange]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flashcardType, setFlashcardType] = useState<PAOType>('person');
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  
  // Range selection state
  const [numberRange, setNumberRange] = useState<NumberRange>({ start: 0, end: 99, useAll: true });
  
  // Quiz state
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    questionType: 'mixed',
    questionCount: 10,
    range: { start: 0, end: 99, useAll: true }
  });
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizSetupPhase, setQuizSetupPhase] = useState(true);

  // Sequence Challenge state
  const [sequenceLength, setSequenceLength] = useState(3);
  const [currentSequence, setCurrentSequence] = useState<SequenceChallenge | null>(null);
  const [sequencePhase, setSequencePhase] = useState<'setup' | 'studying' | 'recall'>('setup');
  const [studyTime, setStudyTime] = useState(30); // seconds
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Speed Training state
  const [speedTrainingMode, setSpeedTrainingMode] = useState<SpeedTrainingMode>('number-to-name');
  const [speedTimeLimit, setSpeedTimeLimit] = useState(10); // seconds
  const [speedSessionLength, setSpeedSessionLength] = useState(10); // number of questions
  const [_speedTrainingActive, setSpeedTrainingActive] = useState(false);


  const [speedTrainingPhase, setSpeedTrainingPhase] = useState<'setup' | 'training' | 'result' | 'session-complete'>('setup');
  const [currentSpeedCard, setCurrentSpeedCard] = useState<SpeedTrainingCard | null>(null);
  const [speedTimeRemaining, setSpeedTimeRemaining] = useState(0);
  const [speedUserAnswer, setSpeedUserAnswer] = useState('');
  const [speedScore, setSpeedScore] = useState(0);
  const [speedShowResult, setSpeedShowResult] = useState(false);
  const [speedIsCorrect, setSpeedIsCorrect] = useState(false);
  const [speedTrainingCount, setSpeedTrainingCount] = useState(0);
  const [speedAutoAdvanceDelay] = useState(2000); // 2 seconds

  // Timer for sequence challenge
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sequencePhase === 'studying' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSequencePhase('recall');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sequencePhase, timeRemaining]);

  // Timer for speed training
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (speedTrainingPhase === 'training' && speedTimeRemaining > 0) {
      interval = setInterval(() => {
        setSpeedTimeRemaining(prev => {
          if (prev <= 1) {
            handleSpeedTrainingTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [speedTrainingPhase, speedTimeRemaining]);

  // Auto-advance timer for speed training
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (speedShowResult && speedTrainingPhase === 'training') {
      timeout = setTimeout(() => {
        if (speedTrainingCount >= speedSessionLength) {
          setSpeedTrainingPhase('session-complete');
        } else {
          nextSpeedTrainingCard();
        }
      }, speedAutoAdvanceDelay);
    }
    return () => clearTimeout(timeout);
  }, [speedShowResult, speedTrainingCount, speedSessionLength, speedTrainingPhase]);

  // Get filtered number range
  const getFilteredNumbers = (range: NumberRange = numberRange): number[] => {
    const allNumbers = Object.keys(defaultPAOData).map(n => parseInt(n)).filter(n => n >= 0 && n <= 99);
    if (range.useAll) {
      return allNumbers;
    }
    return allNumbers.filter(n => n >= range.start && n <= range.end);
  };

  // Prepare flashcard data
  const getFlashcardData = (): FlashcardData[] => {
    const flashcards: FlashcardData[] = [];
    
    // Add default PAO data
    for (let i = 0; i <= 99; i++) {
      if (defaultPAOData[i]) {
        flashcards.push({
          number: i,
          person: defaultPAOData[i].person,
          action: defaultPAOData[i].action,
          object: defaultPAOData[i].object,
          images: defaultPAOData[i].images
        });
      }
    }
    
    return flashcards;
  };

  const flashcards = getFlashcardData();

  // Generate random speed training card
  const generateSpeedTrainingCard = (): SpeedTrainingCard => {
    const availableNumbers = getFilteredNumbers();
    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    const paoTypes: PAOType[] = ['person', 'action', 'object'];
    const randomPaoType = paoTypes[Math.floor(Math.random() * paoTypes.length)];
    
    const data = defaultPAOData[randomNumber];
    return {
      number: randomNumber,
      paoType: randomPaoType,
      name: data[randomPaoType],
      image: data.images[randomPaoType]
    };
  };

  const startSpeedTraining = () => {
    const card = generateSpeedTrainingCard();
    setCurrentSpeedCard(card);
    setSpeedTrainingPhase('training');
    setSpeedTimeRemaining(speedTimeLimit);
    setSpeedUserAnswer('');
    setSpeedShowResult(false);
    setSpeedTrainingActive(true);
    setSpeedTrainingCount(1); // Start with first question
    setSpeedScore(0);
  };

  const handleSpeedTrainingSubmit = () => {
    if (!currentSpeedCard || speedShowResult) return;

    const correctAnswer = speedTrainingMode === 'number-to-name' 
      ? currentSpeedCard.name.toLowerCase().trim()
      : currentSpeedCard.number.toString().padStart(2, '0');
    
    const userAnswer = speedTrainingMode === 'number-to-name'
      ? speedUserAnswer.toLowerCase().trim()
      : speedUserAnswer.trim();

    const isCorrect = userAnswer === correctAnswer;
    setSpeedIsCorrect(isCorrect);
    setSpeedShowResult(true);
    setSpeedScore(prev => isCorrect ? prev + 1 : prev - 1);
  };

  const handleSpeedTrainingTimeout = () => {
    if (!speedShowResult && currentSpeedCard) {
      setSpeedIsCorrect(false);
      setSpeedShowResult(true);
      setSpeedScore(prev => prev - 1);
    }
  };

  const nextSpeedTrainingCard = () => {
    if (speedTrainingCount >= speedSessionLength) {
      setSpeedTrainingPhase('session-complete');
      return;
    }

    const card = generateSpeedTrainingCard();
    setCurrentSpeedCard(card);
    setSpeedTrainingPhase('training');
    setSpeedTimeRemaining(speedTimeLimit);
    setSpeedUserAnswer('');
    setSpeedShowResult(false);
    setSpeedTrainingCount(prev => prev + 1);
  };

  const resetSpeedTraining = () => {
    setSpeedTrainingPhase('setup');
    setSpeedTrainingActive(false);
    setSpeedScore(0);
    setSpeedTrainingCount(0);
    setCurrentSpeedCard(null);
    setSpeedUserAnswer('');
    setSpeedShowResult(false);
  };

  // Generate random sequence
  const generateSequence = (length: number): SequenceChallenge => {
    const numbers: number[] = [];
    const availableNumbers = getFilteredNumbers();
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      numbers.push(availableNumbers[randomIndex]);
    }

    // Create story from sequence
    const story = createSequenceStory(numbers);

    return {
      numbers,
      story,
      revealed: false
    };
  };

  const createSequenceStory = (numbers: number[]): string => {
    if (numbers.length === 0) return '';

    const sequences: string[] = [];
    
    // Group numbers into sets of 3 for PAO combinations
    for (let i = 0; i < numbers.length; i += 3) {
      const group = numbers.slice(i, i + 3);
      if (group.length === 3) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        const action = defaultPAOData[group[1]]?.action || 'doing something';
        const object = defaultPAOData[group[2]]?.object || 'with something';
        sequences.push(`${person} is ${action} with a ${object}`);
      } else if (group.length === 2) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        const action = defaultPAOData[group[1]]?.action || 'doing something';
        sequences.push(`${person} is ${action}`);
      } else if (group.length === 1) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        sequences.push(`${person} appears`);
      }
    }

    return sequences.join('. ') + '.';
  };

  const createColoredStoryElements = (numbers: number[]) => {
    if (numbers.length === 0) return [];

    const sequences: JSX.Element[] = [];
    
    // Group numbers into sets of 3 for PAO combinations
    for (let i = 0; i < numbers.length; i += 3) {
      const group = numbers.slice(i, i + 3);
      const sequenceIndex = Math.floor(i / 3);
      
      if (group.length === 3) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        const action = defaultPAOData[group[1]]?.action || 'doing something';
        const object = defaultPAOData[group[2]]?.object || 'with something';
        
        sequences.push(
          <span key={sequenceIndex}>
            <span className="pao-person font-semibold">{person}</span>
            {' is '}
            <span className="pao-action font-semibold">{action}</span>
            {' with a '}
            <span className="pao-object font-semibold">{object}</span>
            {i + 3 < numbers.length ? '. ' : '.'}
          </span>
        );
      } else if (group.length === 2) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        const action = defaultPAOData[group[1]]?.action || 'doing something';
        
        sequences.push(
          <span key={sequenceIndex}>
            <span className="pao-person font-semibold">{person}</span>
            {' is '}
            <span className="pao-action font-semibold">{action}</span>
            {i + 2 < numbers.length ? '. ' : '.'}
          </span>
        );
      } else if (group.length === 1) {
        const person = defaultPAOData[group[0]]?.person || 'Someone';
        
        sequences.push(
          <span key={sequenceIndex}>
            <span className="pao-person font-semibold">{person}</span>
            {' appears'}
            {i + 1 < numbers.length ? '. ' : '.'}
          </span>
        );
      }
    }

    return sequences;
  };

  const startSequenceChallenge = () => {
    const sequence = generateSequence(sequenceLength);
    setCurrentSequence(sequence);
    setSequencePhase('studying');
    setTimeRemaining(studyTime);
  };

  // Generate quiz questions
  const generateQuiz = (settings: QuizSettings): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const usedNumbers = new Set<number>();
    const paoTypes: PAOType[] = ['person', 'action', 'object'];
    const availableNumbers = getFilteredNumbers(settings.range);
    
    const maxQuestions = Math.min(settings.questionCount, availableNumbers.length);
    
    // Determine question types to include
    const questionTypes: ('name-to-number' | 'number-to-name')[] = [];
    if (settings.questionType === 'mixed') {
      questionTypes.push('name-to-number', 'number-to-name');
    } else {
      questionTypes.push(settings.questionType as 'name-to-number' | 'number-to-name');
    }
    
    while (questions.length < maxQuestions && usedNumbers.size < availableNumbers.length) {
      const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
      
      if (usedNumbers.has(randomNumber)) continue;
      usedNumbers.add(randomNumber);
      
      const flashcard = flashcards.find(f => f.number === randomNumber);
      if (!flashcard) continue;
      
      const randomPaoType = paoTypes[Math.floor(Math.random() * paoTypes.length)];
      const correctValue = flashcard[randomPaoType];
      
      // Select question type
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (questionType === 'name-to-number') {
        // Generate wrong number options from the filtered range
        const wrongNumbers = new Set<string>();
        while (wrongNumbers.size < 3) {
          const wrongNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          if (wrongNum !== randomNumber) {
            wrongNumbers.add(wrongNum.toString().padStart(2, '0'));
          }
        }
        
        const options = [
          randomNumber.toString().padStart(2, '0'),
          ...Array.from(wrongNumbers)
        ].sort(() => Math.random() - 0.5);
        
        questions.push({
          id: `${questionType}-${questions.length}`,
          type: questionType,
          paoType: randomPaoType,
          question: `What number corresponds to "${correctValue}"?`,
          correctAnswer: randomNumber.toString().padStart(2, '0'),
          options,
          number: randomNumber
        });
      } else {
        // Generate wrong name options from the filtered range
        const wrongNames = new Set<string>();
        while (wrongNames.size < 3) {
          const wrongNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          const wrongFlashcard = flashcards.find(f => f.number === wrongNumber);
          if (wrongFlashcard) {
            const wrongValue = wrongFlashcard[randomPaoType];
            if (wrongValue !== correctValue) {
              wrongNames.add(wrongValue);
            }
          }
        }
        
        const options = [
          correctValue,
          ...Array.from(wrongNames)
        ].sort(() => Math.random() - 0.5);
        
        questions.push({
          id: `${questionType}-${questions.length}`,
          type: questionType,
          paoType: randomPaoType,
          question: `What ${randomPaoType} corresponds to number ${randomNumber.toString().padStart(2, '0')}?`,
          correctAnswer: correctValue,
          options,
          number: randomNumber
        });
      }
    }
    
    return questions;
  };

  const startQuiz = () => {
    const quiz = generateQuiz(quizSettings);
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setQuizSetupPhase(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= currentQuiz.length) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setQuizSetupPhase(true);
  };

  const nextFlashcard = () => {
    setIsFlashcardFlipped(false);
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
  };

  const prevFlashcard = () => {
    setIsFlashcardFlipped(false);
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const renderRangeSelector = (range: NumberRange, setRange: (range: NumberRange) => void) => (
    <Card className="glass border border-white/30 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Settings size={16} />
          Practice Range
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant={range.useAll ? 'default' : 'outline'}
            onClick={() => setRange({ ...range, useAll: true })}
            className="rounded-xl h-10 px-4 text-sm"
          >
            All Numbers (00-99)
          </Button>
          <Button
            variant={!range.useAll ? 'default' : 'outline'}
            onClick={() => setRange({ ...range, useAll: false })}
            className="rounded-xl h-10 px-4 text-sm"
          >
            Custom Range
          </Button>
        </div>
        
        {!range.useAll && (
        <div className="grid grid-cols-2 gap-3 relative z-10 py-1">
          <div>
            <label className="block mb-2 text-sm">Start Number</label>
            <div className=" backdrop-blur-sm rounded-xl p-1.25 border shadow-soft relative overflow-visible transition-all duration-300 ease-out focus-within:scale-125 focus-within:z-50 focus-within:shadow-xl focus-within:border-white/40">
              <Input
                type="number"
                min={0}
                max={99}
                value={range.start}
                onChange={(e) =>
                  setRange({
                    ...range,
                    start: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)),
                  })
                }
                onFocus={(e) => e.target.select()} // select all
                className="text-center bg-white/90 border-0 rounded-lg shadow-soft backdrop-blur-sm h-10 text-base font-semibold focus:bg-white focus:text-lg transition-all duration-300 ease-out w-full"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm">End Number</label>
            <div className=" backdrop-blur-sm rounded-xl p-1.25 border shadow-soft relative overflow-visible transition-all duration-300 ease-out focus-within:scale-125 focus-within:z-50 focus-within:shadow-xl focus-within:border-white/40">
              <Input
                type="number"
                min={0}
                max={99}
                value={range.end}
                onChange={(e) =>
                  setRange({
                    ...range,
                    end: Math.max(range.start, Math.min(99, parseInt(e.target.value) || 99)),
                  })
                }
                onFocus={(e) => e.target.select()}
                className="text-center bg-white/90 border-0 rounded-lg shadow-soft backdrop-blur-sm h-10 text-base font-semibold focus:bg-white focus:text-lg transition-all duration-300 ease-out w-full"
              />
            </div>
          </div>
        </div>



        )}
        
        <div className="text-sm text-muted-foreground text-center">
          {range.useAll ? 
            'Practicing with all 100 numbers (00-99)' :
            `Practicing with ${range.end - range.start + 1} numbers (${range.start.toString().padStart(2, '0')}-${range.end.toString().padStart(2, '0')})`
          }
        </div>
      </CardContent>
    </Card>
  );

  const renderMenu = () => (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Card className="glass border border-white/30 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setCurrentMode('flashcards')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CreditCard size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold">Flashcards</div>
                <div className="text-sm text-muted-foreground font-normal">Study PAO associations</div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass border border-white/30 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setCurrentMode('speed-training')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Timer size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold">Speed Training</div>
                <div className="text-sm text-muted-foreground font-normal">Rapid recall challenges</div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass border border-white/30 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setCurrentMode('quiz-challenge')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Target size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold">Quiz Challenge</div>
                <div className="text-sm text-muted-foreground font-normal">Mixed question practice</div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass border border-white/30 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setCurrentMode('sequence-challenge')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Zap size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold">Sequence Challenge</div>
                <div className="text-sm text-muted-foreground font-normal">Remember sequences of numbers</div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="glass border border-white/30 opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Shuffle size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold">Mixed Practice</div>
                <div className="text-sm text-muted-foreground font-normal">Coming soon</div>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderQuizChallenge = () => {
    if (quizSetupPhase) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-5">
            <Button variant="ghost" onClick={() => setCurrentMode('menu')} className="rounded-xl h-10 px-3 text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🎯</div>
            <h2 className="text-lg">Quiz Challenge</h2>
            <p className="text-muted-foreground text-sm">Test your knowledge with customizable questions</p>
          </div>

          {renderRangeSelector(quizSettings.range, (range) => setQuizSettings(prev => ({ ...prev, range })))}

          <Card className="glass border border-white/30">
            <CardHeader className="py-[12px] px-[24px]">
              <CardTitle className="text-base">Configure Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Question Types</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={quizSettings.questionType === 'mixed' ? 'default' : 'outline'}
                    onClick={() => setQuizSettings(prev => ({ ...prev, questionType: 'mixed' }))}
                    className="rounded-xl h-12 text-sm justify-start"
                  >
                    <span className="mr-2">🔄</span>
                    Mixed Questions (Name ↔ Number)
                  </Button>
                  <Button
                    variant={quizSettings.questionType === 'name-to-number' ? 'default' : 'outline'}
                    onClick={() => setQuizSettings(prev => ({ ...prev, questionType: 'name-to-number' }))}
                    className="rounded-xl h-12 text-sm justify-start"
                  >
                    <span className="mr-2">📝→🔢</span>
                    Name to Number Only
                  </Button>
                  <Button
                    variant={quizSettings.questionType === 'number-to-name' ? 'default' : 'outline'}
                    onClick={() => setQuizSettings(prev => ({ ...prev, questionType: 'number-to-name' }))}
                    className="rounded-xl h-12 text-sm justify-start"
                  >
                    <span className="mr-2">🔢→📝</span>
                    Number to Name Only
                  </Button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">
                  Number of Questions: <span className="font-semibold">{quizSettings.questionCount}</span>
                </label>
                <Slider
                  value={[quizSettings.questionCount]}
                  onValueChange={(value) => setQuizSettings(prev => ({ ...prev, questionCount: value[0] }))}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 (Quick)</span>
                  <span>50 (Extended)</span>
                </div>
              </div>

              <Button onClick={startQuiz} className="w-full rounded-xl h-12 text-sm">
                Start Quiz Challenge
                <Play size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (quizCompleted) {
      return (
        <div className="space-y-4 text-center mt-10">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg">Quiz Complete!</h2>
          <div className="glass rounded-2xl p-4">
            <div className="text-3xl font-bold mb-1">{score}/{currentQuiz.length}</div>
            <p className="text-muted-foreground text-sm">
              {score === currentQuiz.length ? 'Perfect score!' : 
               score >= currentQuiz.length * 0.8 ? 'Great job!' :
               score >= currentQuiz.length * 0.6 ? 'Good effort!' : 'Keep practicing!'}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              Accuracy: {Math.round((score / currentQuiz.length) * 100)}%
            </div>
          </div>
          <div className=" gap-3 mb-8 px-5">
            <Button onClick={startQuiz} className="flex-1 rounded-xl h-12 text-sm w-full mb-4">
              <RotateCcw size={16} className="mr-2" />
              New Quiz
            </Button>
            <Button variant="outline" onClick={resetQuiz} className="flex-1 rounded-xl h-12 text-sm w-full">
              Settings
            </Button>
          </div>
        </div>
      );
    }

    const currentQuestion = currentQuiz[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" onClick={resetQuiz} className="rounded-xl h-10 px-3 text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Badge variant="outline" className="px-2 py-1 text-sm">
            {currentQuestionIndex + 1} / {currentQuiz.length}
          </Badge>
        </div>

        <div className="mb-3">
          <Progress value={(currentQuestionIndex / currentQuiz.length) * 100} className="h-2" />
        </div>

        <Card className="glass border border-white/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-base">{currentQuestion.question}</CardTitle>
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                {currentQuestion.type === 'name-to-number' ? '📝→🔢' : '🔢→📝'} {currentQuestion.paoType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full p-4 h-auto text-left justify-start rounded-xl text-sm ${
                  selectedAnswer === option
                    ? showResult
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400'
                      : 'bg-primary/10 border-primary'
                    : showResult && option === currentQuestion.correctAnswer
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400'
                      : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{option}</span>
                  {showResult && selectedAnswer === option && (
                    option === currentQuestion.correctAnswer ? 
                    <Check size={16} className="text-green-600" /> : 
                    <X size={16} className="text-red-600" />
                  )}
                  {showResult && selectedAnswer !== option && option === currentQuestion.correctAnswer && (
                    <Check size={16} className="text-green-600" />
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {showResult && (
          <div className="text-center mb-8">
            <Button onClick={nextQuestion} className="rounded-xl h-12 px-6 text-sm">
              {currentQuestionIndex + 1 >= currentQuiz.length ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderSpeedTraining = () => {
    if (speedTrainingPhase === 'setup') {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between mt-5">
            <Button variant="ghost" onClick={() => setCurrentMode('menu')} className="rounded-xl h-10 px-3 text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="text-center mb-3">
            <div className="text-3xl mb-2">⚡</div>
            <h2 className="text-lg">Speed Training</h2>
            <p className="text-muted-foreground text-sm">Rapid recall challenges to improve speed</p>
          </div>

          {renderRangeSelector(numberRange, setNumberRange)}

          <Card className="glass border border-white/30">
            <CardHeader className="py-[0px] px-[24px]">
              <CardTitle className="text-base px-[0px] py-[12px]">Configure Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block mb-2 text-sm">Training Mode</label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={speedTrainingMode === 'number-to-name' ? 'default' : 'outline'}
                    onClick={() => setSpeedTrainingMode('number-to-name')}
                    className="rounded-xl h-11 text-sm justify-start"
                  >
                    <span className="mr-2">🔢→📝</span>
                    Number to Name
                  </Button>
                  <Button
                    variant={speedTrainingMode === 'name-to-number' ? 'default' : 'outline'}
                    onClick={() => setSpeedTrainingMode('name-to-number')}
                    className="rounded-xl h-11 text-sm justify-start"
                  >
                    <span className="mr-2">📝→🔢</span>
                    Name to Number
                  </Button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">
                  Session Length: <span className="font-semibold">{speedSessionLength} questions</span>
                </label>
                <Slider
                  value={[speedSessionLength]}
                  onValueChange={(value) => setSpeedSessionLength(value[0])}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 (Quick)</span>
                  <span>50 (Marathon)</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">
                  Time Limit: <span className="font-semibold">{speedTimeLimit} seconds</span>
                </label>
                <Slider
                  value={[speedTimeLimit]}
                  onValueChange={(value) => setSpeedTimeLimit(value[0])}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1s (Lightning)</span>
                  <span>30s (Relaxed)</span>
                </div>
              </div>

              <Button onClick={startSpeedTraining} className="w-full rounded-xl h-11 text-sm">
                Start Speed Training
                <Play size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (speedTrainingPhase === 'session-complete') {
      return (
        <div className="space-y-3 text-center mt-10">
          <div className="text-4xl mb-2">🎯</div>
          <h2 className="text-lg">Session Complete!</h2>
          <div className="glass rounded-2xl p-4">
            <div className="text-3xl font-bold mb-1">{speedScore}/{speedSessionLength}</div>
            <p className="text-muted-foreground text-sm">
              {speedScore === speedSessionLength ? 'Perfect session!' : 
               speedScore >= speedSessionLength * 0.8 ? 'Excellent performance!' :
               speedScore >= speedSessionLength * 0.6 ? 'Good effort!' : 'Keep practicing!'}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              Accuracy: {Math.round((speedScore / speedSessionLength) * 100)}%
            </div>
          </div>
          <div className="gap-3 mb-8 px-5">
            <Button onClick={startSpeedTraining} className="flex-1 rounded-xl h-11 text-sm w-full mb-4">
              <RotateCcw size={16} className="mr-2" />
              New Session
            </Button>
            <Button variant="outline" onClick={resetSpeedTraining} className="flex-1 rounded-xl h-11 text-sm w-full">
              Settings
            </Button>
          </div>
        </div>
      );
    }

    if (!currentSpeedCard) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" onClick={resetSpeedTraining} className="rounded-xl h-10 px-3 text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`px-2 py-1 text-sm ${speedTimeRemaining <= 3 ? 'timer-urgent' : ''}`}>
              <Clock size={12} className="mr-1" />
              {speedTimeRemaining}s
            </Badge>
            <Badge variant="secondary" className="px-2 py-1 text-sm">
              {speedTrainingCount}/{speedSessionLength}
            </Badge>
          </div>
        </div>

        <div className="mb-2">
          <Progress value={(speedTrainingCount / speedSessionLength) * 100} className="h-2" />
        </div>

        <Card className="glass border border-white/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-base">
              {speedTrainingMode === 'number-to-name' ? 'What is the name?' : 'What is the number?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Speed Training Card Display */}
            <div className="flex justify-center mb-4">
              <div className="w-full max-w-sm">
                <div className="speed-training-card">
                  {speedTrainingMode === 'number-to-name' ? (
                    // Show number, ask for name
                    <div className="speed-training-front">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-5">
                        <div className="speed-training-number">
                          {currentSpeedCard.number.toString().padStart(2, '0')}
                        </div>
                        <div className="mt-3 px-3 py-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                          <Badge variant="secondary" className={`speed-training-badge speed-training-badge-${currentSpeedCard.paoType} backdrop-blur-md bg-white/90 dark:bg-black/90 border-0 font-semibold text-sm px-3 py-1`}>
                            {currentSpeedCard.paoType.charAt(0).toUpperCase() + currentSpeedCard.paoType.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Show name and image, ask for number
                    <div className="speed-training-back">
                      {/* Background Image */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <ImageWithFallback
                          src={currentSpeedCard.image}
                          alt={currentSpeedCard.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col justify-between h-full p-5">
                        {/* Top section - Type badge */}
                        <div className="flex justify-center">
                          <div className={`speed-training-badge speed-training-badge-${currentSpeedCard.paoType}`}>
                            <Badge variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-black/90 border-0 font-semibold text-sm px-3 py-1">
                              {currentSpeedCard.paoType.charAt(0).toUpperCase() + currentSpeedCard.paoType.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Bottom section - Content */}
                        <div className="text-center">
                          <div className="speed-training-title">
                            {currentSpeedCard.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                value={speedUserAnswer}
                onChange={(e) => setSpeedUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !speedShowResult && handleSpeedTrainingSubmit()}
                placeholder={speedTrainingMode === 'number-to-name' ? 'Enter the name...' : 'Enter the number (e.g., 07)...'}
                className="text-center rounded-xl h-11 text-base"
                disabled={speedShowResult || speedTimeRemaining === 0}
                autoFocus
              />

              {!speedShowResult && speedTimeRemaining > 0 && (
                <Button 
                  onClick={handleSpeedTrainingSubmit}
                  className="w-full rounded-xl h-11 text-sm"
                  disabled={!speedUserAnswer.trim()}
                >
                  Submit Answer
                  <Check size={16} className="ml-2" />
                </Button>
              )}

              {speedShowResult && (
                <div className="space-y-2">
                  <div className={`p-3 rounded-xl text-center ${speedIsCorrect ? 'quiz-correct' : 'quiz-incorrect'}`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {speedIsCorrect ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <X size={18} className="text-red-600" />
                      )}
                      <span className="font-semibold text-sm">
                        {speedIsCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    {!speedIsCorrect && (
                      <div className="text-xs">
                        Correct answer: {speedTrainingMode === 'number-to-name' 
                          ? currentSpeedCard.name 
                          : currentSpeedCard.number.toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  <div className="text-center text-xs text-muted-foreground">
                    {speedTrainingCount >= speedSessionLength ? 
                      'Session complete!' :
                      `Auto-advancing in ${Math.ceil(speedAutoAdvanceDelay / 1000)} seconds...`
                    }
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <Progress 
            value={speedTimeRemaining > 0 ? ((speedTimeLimit - speedTimeRemaining) / speedTimeLimit) * 100 : 100} 
            className="h-2"
          />
        </div>
      </div>
    );
  };

  const renderSequenceChallenge = () => {
    if (sequencePhase === 'setup') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-5">
            <Button variant="ghost" onClick={() => setCurrentMode('menu')} className="rounded-xl h-10 px-3 text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🧩</div>
            <h2 className="text-lg">Sequence Challenge</h2>
            <p className="text-muted-foreground text-sm">Test your memory with number sequences</p>
          </div>

          {renderRangeSelector(numberRange, setNumberRange)}

          <Card className="glass border border-white/30">
            <CardHeader className="py-[12px] px-[24px]">
              <CardTitle className="text-base">Configure Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">
                  Sequence Length: <span className="font-semibold">{sequenceLength} numbers</span>
                </label>
                <Slider
                  value={[sequenceLength]}
                  onValueChange={(value) => setSequenceLength(value[0])}
                  min={3}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3 (Easy)</span>
                  <span>20 (Expert)</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">
                  Study Time: <span className="font-semibold">{studyTime} seconds</span>
                </label>
                <Slider
                  value={[studyTime]}
                  onValueChange={(value) => setStudyTime(value[0])}
                  min={10}
                  max={120}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10s (Quick)</span>
                  <span>120s (Relaxed)</span>
                </div>
              </div>

              <Button onClick={startSequenceChallenge} className="w-full rounded-xl h-12 text-sm">
                Start Challenge
                <Zap size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!currentSequence) return null;

    if (sequencePhase === 'studying') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => {
              setSequencePhase('setup');
              setCurrentSequence(null);
            }} className="rounded-xl h-10 px-3 text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 text-sm">
              <Clock size={12} className="mr-1" />
              {timeRemaining}s
            </Badge>
          </div>

          <div className="text-center mb-4">
            <h3 className="text-lg">Study the Sequence</h3>
            <p className="text-muted-foreground text-sm">Memorize these numbers in order</p>
          </div>

          <div className="mb-4">
            <Progress value={((studyTime - timeRemaining) / studyTime) * 100} className="h-2 mb-1" />
          </div>

          <Card className="glass border border-white/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 justify-items-center">
                {currentSequence.numbers.map((number, index) => (
                  <div key={index} className="sequence-number">
                    {number.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            Time automatically advances when study time ends
          </div>
        </div>
      );
    }

    if (sequencePhase === 'recall') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-5">
            <Button variant="ghost" onClick={() => {
              setSequencePhase('setup');
              setCurrentSequence(null);
            }} className="rounded-xl h-10 px-3 text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <Badge variant="outline" className="px-2 py-1 text-sm">Recall Phase</Badge>
          </div>

          <Card className="glass border border-white/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Memory Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              {currentSequence.revealed ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-2 text-center text-base">Number Sequence</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 justify-items-center">
                        {currentSequence.numbers.map((number, index) => (
                          <div key={index} className="sequence-number sequence-reveal-animation" style={{animationDelay: `${index * 0.1}s`}}>
                            {number.toString().padStart(2, '0')}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h4 className="mb-2 text-base">PAO Story:</h4>
                      <p className="text-sm leading-relaxed">
                        {createColoredStoryElements(currentSequence.numbers)}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSequence(prev => prev ? {...prev, revealed: !prev.revealed} : null)}
                      className="rounded-xl px-6 h-12 text-sm"
                    >
                      <EyeOff size={16} className="mr-2" />
                      Hide Answer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="recall-prompt-enhanced">
                    <div className="text-center py-8 p-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-xl">
                        <Brain size={32} className="text-primary" />
                      </div>
                      <h4 className="mb-4 text-lg font-semibold">Think About It...</h4>
                      <div className="space-y-3 text-foreground max-w-md mx-auto mb-6">
                        <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <p className="text-sm text-left">Can you recall the {currentSequence.numbers.length} numbers in order?</p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        onClick={() => setCurrentSequence(prev => prev ? {...prev, revealed: !prev.revealed} : null)}
                        className="rounded-xl px-6 h-12 text-sm"
                      >
                        <Eye size={16} className="mr-2" />
                        Reveal Answer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 mb-8">
            <Button 
              onClick={() => {
                const newSequence = generateSequence(sequenceLength);
                setCurrentSequence(newSequence);
                setSequencePhase('studying');
                setTimeRemaining(studyTime);
              }}
              className="flex-1 rounded-xl h-12 text-sm"
            >
              <RotateCcw size={16} className="mr-2" />
              New Sequence
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSequencePhase('setup')}
              className="flex-1 rounded-xl h-12 text-sm"
            >
              Change Settings
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderFlashcards = () => {
    const currentCard = flashcards[currentFlashcard];
    if (!currentCard) return null;

    const currentImage = currentCard.images[flashcardType];
    const currentValue = currentCard[flashcardType];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" onClick={() => setCurrentMode('menu')} className="rounded-xl h-10 px-3 text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Menu
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-2 py-1 text-sm">{currentFlashcard + 1} / {flashcards.length}</Badge>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {(['person', 'action', 'object'] as PAOType[]).map((type) => (
            <Button
              key={type}
              variant={flashcardType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFlashcardType(type);
                setIsFlashcardFlipped(false);
              }}
              className="rounded-xl h-10 px-3 text-sm"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex justify-center px-4">
          <div 
            className="w-full max-w-md cursor-pointer perspective-1000"
            onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
          >
            <div className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d ${isFlashcardFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front of card - Number */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="flashcard-modern flashcard-front">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="flashcard-number">
                      {currentCard.number.toString().padStart(2, '0')}
                    </div>
                    <div className="mt-3 px-3 py-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground font-medium">
                        Tap to reveal {flashcardType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card - PAO Component */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="flashcard-modern flashcard-back">
                  {/* Background Image */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src={currentImage}
                      alt={currentValue}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-between h-full p-5">
                    {/* Top section - Type badge */}
                    <div className="flex justify-center">
                      <div className={`flashcard-badge flashcard-badge-${flashcardType}`}>
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-black/90 border-0 font-semibold text-sm px-2 py-1">
                          {flashcardType}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Bottom section - Content */}
                    <div className="text-center">
                      <div className="flashcard-title ">
                        {currentValue}
                      </div>
                      <div className="mt-2 px-2 py-1 bg-white/90 dark:bg-black/90 rounded-lg backdrop-blur-sm">
                        <p className="text-sm font-medium opacity-80">
                          #{currentCard.number.toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          <Button variant="outline" onClick={prevFlashcard} className="rounded-xl shadow-lg h-16 w-16 flex-shrink-0">
            <ArrowLeft size={24} />
          </Button>
          <Button variant="outline" onClick={nextFlashcard} className="rounded-xl shadow-lg h-16 w-16 flex-shrink-0">
            <ArrowRight size={24} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 px-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {currentMode === 'menu' && renderMenu()}
        {currentMode === 'flashcards' && renderFlashcards()}
        {currentMode === 'speed-training' && renderSpeedTraining()}
        {currentMode === 'quiz-challenge' && renderQuizChallenge()}
        {currentMode === 'sequence-challenge' && renderSequenceChallenge()}
      </div>
    </main>
  );
}