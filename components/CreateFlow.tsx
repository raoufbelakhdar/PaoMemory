import { useState } from 'react';
import { ChevronLeft, Copy, Check, Upload, AlertCircle, CheckCircle2, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import type { CustomPAOItem } from '../src/App';

interface CreateFlowProps {
  onComplete: (data: CustomPAOItem[]) => void;
  onBack: () => void;
}

export function CreateFlow({ onComplete, onBack }: CreateFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [importedData, setImportedData] = useState<CustomPAOItem[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const generatePrompt = `Create a complete PAO (Person-Action-Object) memory system for numbers 00-99 in JSON format.

Requirements:
- Each number (00-99) needs exactly 3 entries: person, action, and object
- Person: A memorable character/celebrity (capitalized name)
- Action: A distinctive verb/action (lowercase)
- Object: A concrete noun/item (lowercase)
- Make associations vivid and easy to visualize
- Use diverse, interesting characters and items

Format as a JSON array:
[
  {
    "number": 0,
    "type": "person",
    "title": "Neo",
    "imageUrl": ""
  },
  {
    "number": 0,
    "type": "action",
    "title": "dodging",
    "imageUrl": ""
  },
  {
    "number": 0,
    "type": "object",
    "title": "sunglasses",
    "imageUrl": ""
  },
  {
    "number": 1,
    "type": "person",
    "title": "Einstein",
    "imageUrl": ""
  },
  {
    "number": 1,
    "type": "action",
    "title": "calculating",
    "imageUrl": ""
  },
  {
    "number": 1,
    "type": "object",
    "title": "chalkboard",
    "imageUrl": ""
  }
  // ... continue for all numbers 00-99
]

Please generate the complete system now (all 300 entries).`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleParseJSON = () => {
    setError('');
    
    // PROTOTYPE MODE: Show preview even with invalid JSON
    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsed)) {
        // Still show preview in prototype mode with mock data
        setError('Invalid format: Expected a JSON array');
        setImportedData(createMockData());
        setCurrentStep(3);
        return;
      }

      const validatedData: CustomPAOItem[] = parsed.map((item: any, index: number) => {
        if (typeof item.number !== 'number' || !item.type || !item.title) {
          throw new Error(`Invalid item at index ${index}`);
        }
        
        if (!['person', 'action', 'object'].includes(item.type)) {
          throw new Error(`Invalid type at index ${index}: ${item.type}`);
        }

        return {
          id: `create_${Date.now()}_${index}`,
          number: item.number,
          type: item.type as 'person' | 'action' | 'object',
          title: item.title,
          imageUrl: item.imageUrl || '',
        };
      });

      setImportedData(validatedData);
      setCurrentStep(3);
    } catch (err: any) {
      // PROTOTYPE MODE: Show preview anyway with mock data
      setError(err.message || 'Invalid JSON format');
      setImportedData(createMockData());
      setCurrentStep(3);
    }
  };

  // Create mock data for prototype
  const createMockData = (): CustomPAOItem[] => {
    const mockItems: CustomPAOItem[] = [];
    for (let i = 0; i < 15; i++) {
      mockItems.push(
        { id: `mock_${i}_p`, number: i, type: 'person', title: 'Sample Person', imageUrl: '' },
        { id: `mock_${i}_a`, number: i, type: 'action', title: 'sample action', imageUrl: '' },
        { id: `mock_${i}_o`, number: i, type: 'object', title: 'sample object', imageUrl: '' }
      );
    }
    return mockItems;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const steps = [
    // Step 0: Welcome
    {
      title: 'Welcome',
      render: () => (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex flex-col relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-chart-1/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Header */}
          <div className="relative px-5 py-5 flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-xl glass backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === 0 ? 'w-8 bg-primary shadow-sm shadow-primary/50' : 'w-1 bg-muted/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-1 flex flex-col px-5 pb-6 justify-center">
            <div className="max-w-md mx-auto w-full text-center space-y-8">
              {/* Icon */}
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-1 rounded-[2rem] shadow-2xl shadow-primary/30 flex items-center justify-center">
                  <Wand2 className="w-14 h-14 text-white" strokeWidth={2} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-[2rem] blur-xl -z-10" />
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-[2.5rem] leading-tight tracking-tight">
                  Create your PAO
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Let AI generate a complete memory system for you from scratch
                </p>
              </div>

              {/* Features */}
              <div className="glass-strong backdrop-blur-2xl rounded-3xl p-6 text-left space-y-4 shadow-xl border border-white/10">
                {[
                  '300 unique PAO items (00-99)',
                  'Memorable characters & vivid associations',
                  'Ready in minutes',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2.5} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative px-5 pb-6">
            <Button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-white rounded-2xl h-14 text-base shadow-2xl shadow-primary/20 border-0"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      ),
    },
    // Step 1: Explain
    {
      title: 'Explain',
      render: () => (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex flex-col relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-16 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Header */}
          <div className="relative px-5 py-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(0)}
              className="w-11 h-11 rounded-xl glass backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === 1 ? 'w-8 bg-primary shadow-sm shadow-primary/50' : i < 1 ? 'w-1 bg-primary/50' : 'w-1 bg-muted/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-1 flex flex-col px-5 pb-6">
            <div className="mb-6">
              <h1 className="text-3xl mb-2 tracking-tight">
                Simple steps ahead
              </h1>
              <p className="text-muted-foreground">
                Here's how we'll create your PAO system
              </p>
            </div>

            {/* Steps */}
            <div className="flex-1 space-y-3">
              {[
                {
                  number: '1',
                  title: 'Copy our AI prompt',
                  description: 'Get the specialized ChatGPT prompt',
                  color: 'from-primary to-chart-1',
                },
                {
                  number: '2',
                  title: 'Generate with ChatGPT',
                  description: 'Let AI create your complete PAO system',
                  color: 'from-chart-2 to-emerald-500',
                },
                {
                  number: '3',
                  title: 'Import the result',
                  description: 'Paste the JSON output and you are done',
                  color: 'from-chart-5 to-purple-500',
                },
              ].map((step, i) => (
                <div key={i} className="glass-strong backdrop-blur-2xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-white/10">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <span className="text-white">{step.number}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Info box */}
              <div className="glass backdrop-blur-xl rounded-2xl p-4 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  ⏱️ <span className="text-foreground">Note:</span> ChatGPT may take 30-60 seconds to generate all 300 items. Be patient!
                </p>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-white rounded-2xl h-14 text-base shadow-2xl shadow-primary/20 border-0 mt-6"
            >
              Let's do it
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      ),
    },
    // Step 2: Instruction
    {
      title: 'Instruction',
      render: () => (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="px-5 py-5 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="w-11 h-11 rounded-xl glass backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === 2 ? 'w-8 bg-primary shadow-sm shadow-primary/50' : i < 2 ? 'w-1 bg-primary/50' : 'w-1 bg-muted/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-5 pb-6">
            <div className="mb-5">
              <h1 className="text-3xl mb-2 tracking-tight">
                Copy this prompt
              </h1>
              <p className="text-muted-foreground">
                Use it with ChatGPT to generate your complete PAO
              </p>
            </div>

            {/* Prompt card - More compact for mobile */}
            <div className="flex-1 glass-strong backdrop-blur-2xl rounded-3xl overflow-hidden shadow-xl flex flex-col border border-white/10 min-h-0">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">Generator Prompt</span>
                </div>
                <Button
                  size="sm"
                  variant={copiedPrompt ? "default" : "ghost"}
                  className={`h-9 px-3 rounded-lg transition-all ${copiedPrompt ? 'bg-primary hover:bg-primary/90 shadow-lg' : ''}`}
                  onClick={handleCopyPrompt}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="flex-1 px-4 py-4 overflow-y-auto bg-muted/20 min-h-0">
                <pre className="text-xs whitespace-pre-wrap break-words font-mono text-muted-foreground leading-relaxed">
                  {generatePrompt}
                </pre>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => setCurrentStep(3)}
              className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-white rounded-2xl h-14 text-base shadow-2xl shadow-primary/20 border-0 mt-5"
            >
              I generated my list
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      ),
    },
    // Step 3: Import/Preview
    {
      title: 'Import',
      render: () => (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex flex-col relative overflow-hidden">
          {/* Header */}
          <div className="px-5 py-5 flex items-center justify-between">
            <button
              onClick={() => {
                if (importedData.length > 0) {
                  setImportedData([]);
                  setJsonInput('');
                  setError('');
                } else {
                  setCurrentStep(2);
                }
              }}
              className="w-11 h-11 rounded-xl glass backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === 3 ? 'w-8 bg-primary shadow-sm shadow-primary/50' : i < 3 ? 'w-1 bg-primary/50' : 'w-1 bg-muted/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-5 pb-6 min-h-0">
            {importedData.length === 0 ? (
              // Import view
              <>
                <div className="mb-5 flex-shrink-0">
                  <h1 className="text-3xl mb-2 tracking-tight">
                    Paste your JSON
                  </h1>
                  <p className="text-muted-foreground">
                    Import the generated PAO system
                  </p>
                </div>

                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  {/* Textarea - More compact */}
                  <div className="flex-1 min-h-0">
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='[{"number": 0, "type": "person", "title": "Neo", "imageUrl": ""}...]'
                      className="w-full h-full p-4 rounded-2xl glass-strong backdrop-blur-2xl border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono text-sm shadow-xl transition-all"
                    />
                  </div>

                  {/* Divider */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-3 glass backdrop-blur-xl rounded-full py-1.5 shadow-sm">Or</span>
                    </div>
                  </div>

                  {/* File upload - More compact */}
                  <label htmlFor="file-upload" className="block flex-shrink-0">
                    <div className="glass-strong backdrop-blur-2xl rounded-2xl p-5 border-2 border-dashed border-border/50 hover:border-primary cursor-pointer transition-all text-center shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]">
                      <Upload className="w-9 h-9 mx-auto mb-2.5 text-primary" />
                      <p className="text-sm mb-0.5">Upload JSON file</p>
                      <p className="text-xs text-muted-foreground">Click to browse</p>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Error - if any */}
                  {error && importedData.length === 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl glass-strong backdrop-blur-2xl border border-destructive/50 shadow-lg flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-destructive mb-2">{error}</p>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-xs text-primary underline underline-offset-2"
                        >
                          View instructions again
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  onClick={handleParseJSON}
                  disabled={!jsonInput.trim()}
                  className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-white rounded-2xl h-14 text-base shadow-2xl shadow-primary/20 border-0 disabled:opacity-50 disabled:cursor-not-allowed mt-5 flex-shrink-0"
                >
                  Import & Preview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            ) : (
              // Preview view
              <>
                <div className="mb-5 flex-shrink-0">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl tracking-tight">Looking great!</h1>
                  </div>
                  <p className="text-muted-foreground">
                    {importedData.length} PAO items ready to import
                  </p>
                  {error && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Note: Using sample data for preview (prototype mode)
                    </p>
                  )}
                </div>

                {/* Preview list */}
                <div className="flex-1 glass-strong backdrop-blur-2xl rounded-3xl p-4 overflow-hidden flex flex-col shadow-xl border border-white/10 mb-5 min-h-0">
                  <h3 className="text-sm text-muted-foreground mb-3 px-1 flex-shrink-0">Preview</h3>
                  <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-2 min-h-0">
                    {importedData.slice(0, 20).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="w-8 text-sm text-muted-foreground font-mono">
                          {String(item.number).padStart(2, '0')}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-lg flex-shrink-0 ${
                          item.type === 'person' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                          item.type === 'action' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-sm flex-1 truncate">{item.title}</span>
                      </div>
                    ))}
                    {importedData.length > 20 && (
                      <p className="text-xs text-muted-foreground text-center py-3">
                        +{importedData.length - 20} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => onComplete(importedData)}
                  className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-white rounded-2xl h-14 text-base shadow-2xl shadow-primary/20 border-0 flex-shrink-0"
                >
                  Looks good! Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}
          </div>
        </div>
      ),
    },
  ];

  return steps[currentStep].render();
}
