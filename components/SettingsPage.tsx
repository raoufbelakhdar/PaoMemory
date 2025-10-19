import { useState, useRef } from 'react';
import { Moon, Sun, Download, Upload, FileText, AlertCircle, CheckCircle, Settings, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import type { CustomPAOItem } from '../App';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  customPAOData: CustomPAOItem[];
  onImportPAOData: (data: CustomPAOItem[]) => void;
  onShowOnboarding: () => void; // NEW
}

export function SettingsPage({ theme, onThemeChange, customPAOData, onImportPAOData, onShowOnboarding }: SettingsPageProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- CSV Export ----------------
  const handleExportCSV = () => {
    if (customPAOData.length === 0) {
      setImportStatus('error');
      setImportMessage('No custom PAO data to export.');
      setTimeout(() => setImportStatus('idle'), 3000);
      return;
    }

    const headers = ['Number', 'Type', 'Title', 'Image URL'];
    const csvRows = [
      headers.join(','),
      ...customPAOData.map(item => [
        item.number,
        item.type,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.imageUrl.replace(/"/g, '""')}"`
      ].join(','))
    ];
    const csvContent = csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `pao-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setImportStatus('success');
    setImportMessage(`Successfully exported ${customPAOData.length} PAO items.`);
    setTimeout(() => setImportStatus('idle'), 3000);
  };

  // ---------------- CSV Import ----------------
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('CSV must have headers and at least one row.');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const numberIndex = headers.findIndex(h => h.includes('number'));
        const typeIndex = headers.findIndex(h => h.includes('type'));
        const titleIndex = headers.findIndex(h => h.includes('title'));
        const imageIndex = headers.findIndex(h => h.includes('image') || h.includes('url'));

        const importedData: CustomPAOItem[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const row = lines[i].split(',').map(cell => {
              let val = cell.trim();
              if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
              return val;
            });

            if (row.length < 4) { errors.push(`Row ${i + 1}: Insufficient columns`); continue; }

            const number = parseInt(row[numberIndex]);
            const type = row[typeIndex].toLowerCase() as 'person' | 'action' | 'object';
            const title = row[titleIndex];
            const imageUrl = row[imageIndex];

            if (isNaN(number) || number < 0 || number > 99) { errors.push(`Row ${i + 1}: Invalid number`); continue; }
            if (!['person', 'action', 'object'].includes(type)) { errors.push(`Row ${i + 1}: Invalid type`); continue; }
            if (!title.trim()) { errors.push(`Row ${i + 1}: Title cannot be empty`); continue; }
            if (!imageUrl.trim()) { errors.push(`Row ${i + 1}: Image URL cannot be empty`); continue; }

            importedData.push({
              id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              number,
              type,
              title: title.trim(),
              imageUrl: imageUrl.trim()
            });
          } catch (rowError) {
            errors.push(`Row ${i + 1}: ${rowError instanceof Error ? rowError.message : 'Parse error'}`);
          }
        }

        if (errors.length > 0 && importedData.length === 0) throw new Error(`Import failed:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...and ${errors.length - 5} more` : ''}`);

        onImportPAOData(importedData);
        setImportStatus('success');
        let message = `Successfully imported ${importedData.length} PAO items.`;
        if (errors.length > 0) message += ` ${errors.length} rows skipped due to errors.`;
        setImportMessage(message);

      } catch (error) {
        setImportStatus('error');
        setImportMessage(error instanceof Error ? error.message : 'Failed to parse CSV.');
      }
    };

    reader.onerror = () => {
      setImportStatus('error');
      setImportMessage('Failed to read file.');
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setImportStatus('idle'), 5000);
  };

  return (
    <div className="flex-1 px-6 pb-24 pt-6">
      {/* --- NEW: Setup Guide --- */}
      <div className="mb-6">
        <Button
          onClick={onShowOnboarding}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          View Setup Guide
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Watch tutorials on importing or creating your PAO system
        </p>
      </div>

      {/* --- Theme Settings --- */}
      <Card className="glass border border-white/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Theme</Label>
              <p className="text-sm text-muted-foreground">Choose between light and dark themes</p>
            </div>
            <div className="flex items-center gap-3">
              <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-primary"
              />
              <Moon size={16} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Data Management --- */}
      <Card className="glass border border-white/30 mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText size={20} />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Export */}
          <div className="space-y-3">
            <div>
              <Label className="text-base">Export PAO Data</Label>
              <p className="text-sm text-muted-foreground">
                Download your custom PAO data as a CSV file
              </p>
            </div>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="w-full rounded-xl h-12"
              disabled={customPAOData.length === 0}
            >
              <Download size={16} className="mr-2" />
              Export to CSV ({customPAOData.length} items)
            </Button>
          </div>

          {/* Import */}
          <div className="space-y-3">
            <div>
              <Label className="text-base">Import PAO Data</Label>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with your PAO data (Number, Type, Title, Image URL)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full rounded-xl h-12"
            >
              <Upload size={16} className="mr-2" />
              Import from CSV
            </Button>
          </div>

          {/* Status Messages */}
          {importStatus !== 'idle' && (
            <Alert className={`${importStatus === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'}`}>
              {importStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className={`${importStatus === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {importMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* CSV Format Help */}
          <div className="p-4 bg-muted/50 rounded-xl">
            <h4 className="text-sm font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Headers: Number, Type, Title, Image URL</li>
              <li>• Number: 0-99</li>
              <li>• Type: person, action, or object</li>
              <li>• Title: Name of the PAO element</li>
              <li>• Image URL: Link to the image</li>
            </ul>
          </div>

        </CardContent>
      </Card>

      {/* --- About --- */}
      <Card className="glass border border-white/30 mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings size={20} />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Custom PAO Items</Label>
              <p className="text-muted-foreground">{customPAOData.length}</p>
            </div>
            <div>
              <Label>Current Theme</Label>
              <p className="text-muted-foreground capitalize">{theme}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              PAO Memory System • Built with React & Tailwind CSS
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
