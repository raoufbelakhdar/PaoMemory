import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CustomPAOItem } from '../src/App';

interface CreatePageProps {
  customPAOData: CustomPAOItem[];
  onAddCustomPAO: (item: Omit<CustomPAOItem, 'id'>) => void;
  onEditCustomPAO: (id: string, item: Omit<CustomPAOItem, 'id'>) => void;
  onDeleteCustomPAO: (id: string) => void;
}

interface FormProps {
  type: 'person' | 'action' | 'object';
  number: string;
  title: string;
  imageUrl: string;
  editingId: string | null;
  onNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isValid: boolean;
}

const PAOForm: React.FC<FormProps> = ({
  type,
  number,
  title,
  imageUrl,
  editingId,
  onNumberChange,
  onTitleChange,
  onImageUrlChange,
  onSubmit,
  onCancel,
  isValid
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const borderColor = type === 'person' ? 'border-rose-200 dark:border-rose-800' :
                     type === 'action' ? 'border-amber-200 dark:border-amber-800' :
                     'border-emerald-200 dark:border-emerald-800';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onImageUrlChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className={`bg-white/95 dark:bg-slate-800/95 border-2 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {editingId ? <Edit size={20} /> : <Plus size={20} />}
            {editingId ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`${type}-number`}>Number (00-99)</Label>
            <Input
              id={`${type}-number`}
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="00-99"
              maxLength={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-title`}>{type.charAt(0).toUpperCase() + type.slice(1)} Name</Label>
            <Input
              id={`${type}-title`}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={`Enter ${type} name`}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Image</Label>
            <div className="mt-1 space-y-3">
              <Input
                id={`${type}-image-url`}
                value={imageUrl}
                onChange={(e) => onImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">or</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Local Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          {imageUrl && (
            <div>
              <Label>Preview</Label>
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/30 mt-1">
                <ImageWithFallback
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={!isValid}>
              <Save size={16} className="mr-2" />
              {editingId ? 'Update' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Inline edit form component for individual items
const InlineEditForm: React.FC<{
  item: CustomPAOItem;
  number: string;
  title: string;
  imageUrl: string;
  onNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isValid: boolean;
}> = ({ item, number, title, imageUrl, onNumberChange, onTitleChange, onImageUrlChange, onSubmit, onCancel, isValid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onImageUrlChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const borderColor = item.type === 'person' ? 'border-rose-200 dark:border-rose-800' :
                     item.type === 'action' ? 'border-amber-200 dark:border-amber-800' :
                     'border-emerald-200 dark:border-emerald-800';

  return (
    <div className={`bg-white/95 dark:bg-slate-800/95 border-2 ${borderColor} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="flex items-center gap-2 font-semibold">
          <Edit size={18} />
          Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </h4>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`edit-number-${item.id}`}>Number (00-99)</Label>
            <Input
              id={`edit-number-${item.id}`}
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="00-99"
              maxLength={2}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`edit-title-${item.id}`}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)} Name</Label>
            <Input
              id={`edit-title-${item.id}`}
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={`Enter ${item.type} name`}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label>Image</Label>
          <div className="mt-1 space-y-3">
            <Input
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">or</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Local Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {imageUrl && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/30">
                  <ImageWithFallback
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-muted-foreground">Preview</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={!isValid}>
            <Save size={16} className="mr-2" />
            Update {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export function CreatePage({ 
  customPAOData, 
  onAddCustomPAO, 
  onEditCustomPAO, 
  onDeleteCustomPAO 
}: CreatePageProps) {
  const [activeTab, setActiveTab] = useState<'person' | 'action' | 'object'>('person');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form data for adding
  const [addNumber, setAddNumber] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addImageUrl, setAddImageUrl] = useState('');

  // Form data for editing
  const [editNumber, setEditNumber] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const resetAddForm = () => {
    setAddNumber('');
    setAddTitle('');
    setAddImageUrl('');
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditNumber('');
    setEditTitle('');
    setEditImageUrl('');
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addNumber || !addTitle) return;
    
    const finalNumber = addNumber === '00' ? 0 : parseInt(addNumber);
    if (isNaN(finalNumber) || finalNumber < 0 || finalNumber > 99) return;
    
    const isDuplicate = customPAOData.some(item => 
      item.type === activeTab && 
      item.number === finalNumber
    );
    if (isDuplicate) return;

    const item = {
      number: finalNumber,
      title: addTitle.trim(),
      imageUrl: addImageUrl.trim() || 'https://images.unsplash.com/photo-1534126416832-7d5a5b8cf1e3?w=400&h=400&fit=crop',
      type: activeTab
    };

    onAddCustomPAO(item);
    resetAddForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId || !editNumber || !editTitle) return;
    
    const finalNumber = editNumber === '00' ? 0 : parseInt(editNumber);
    if (isNaN(finalNumber) || finalNumber < 0 || finalNumber > 99) return;
    
    const isDuplicate = customPAOData.some(item => 
      item.type === activeTab && 
      item.number === finalNumber && 
      item.id !== editingId
    );
    if (isDuplicate) return;

    const item = {
      number: finalNumber,
      title: editTitle.trim(),
      imageUrl: editImageUrl.trim() || 'https://images.unsplash.com/photo-1534126416832-7d5a5b8cf1e3?w=400&h=400&fit=crop',
      type: activeTab
    };

    onEditCustomPAO(editingId, item);
    resetEditForm();
  };

  const handleEdit = (item: CustomPAOItem) => {
    setEditNumber(item.number === 0 ? '00' : item.number.toString());
    setEditTitle(item.title);
    setEditImageUrl(item.imageUrl);
    setEditingId(item.id);
    setShowAddForm(false); // Hide add form when editing
  };

  const handleAddNew = () => {
    resetAddForm();
    resetEditForm(); // Clear any editing state
    setShowAddForm(true);
  };

  const getItemsForTab = (type: 'person' | 'action' | 'object') => {
    return customPAOData
      .filter(item => item.type === type)
      .sort((a, b) => a.number - b.number);
  };

  const formatNumber = (num: number) => {
    return num === 0 ? '00' : num.toString().padStart(2, '0');
  };

  const isAddFormValid = () => {
    if (!addNumber || !addTitle) return false;
    const finalNumber = addNumber === '00' ? 0 : parseInt(addNumber);
    if (isNaN(finalNumber) || finalNumber < 0 || finalNumber > 99) return false;
    const isDuplicate = customPAOData.some(item => 
      item.type === activeTab && 
      item.number === finalNumber
    );
    return !isDuplicate;
  };

  const isEditFormValid = () => {
    if (!editNumber || !editTitle) return false;
    const finalNumber = editNumber === '00' ? 0 : parseInt(editNumber);
    if (isNaN(finalNumber) || finalNumber < 0 || finalNumber > 99) return false;
    const isDuplicate = customPAOData.some(item => 
      item.type === activeTab && 
      item.number === finalNumber && 
      item.id !== editingId
    );
    return !isDuplicate;
  };

  const getTabIcon = (type: 'person' | 'action' | 'object') => {
    return type === 'person' ? '🧑' : type === 'action' ? '🏃' : '📦';
  };

  const getTabColor = (type: 'person' | 'action' | 'object') => {
    return type === 'person' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
           type === 'action' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
           'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
  };

  const renderTabContent = () => {
    const items = getItemsForTab(activeTab);
    
    return (
      <div className="space-y-4">
        {!showAddForm && (
          <Button
            onClick={handleAddNew}
            className="w-full glass border border-white/30 rounded-2xl p-6 h-auto flex items-center gap-4 hover:scale-[1.02] transition-all"
            variant="ghost"
          >
            <div className={`p-3 rounded-xl ${getTabColor(activeTab)}`}>
              <Plus size={24} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
              <div className="text-sm text-muted-foreground">Create a custom {activeTab}</div>
            </div>
          </Button>
        )}

        {showAddForm && (
          <PAOForm
            type={activeTab}
            number={addNumber}
            title={addTitle}
            imageUrl={addImageUrl}
            editingId={null}
            onNumberChange={setAddNumber}
            onTitleChange={setAddTitle}
            onImageUrlChange={setAddImageUrl}
            onSubmit={handleAddSubmit}
            onCancel={resetAddForm}
            isValid={isAddFormValid()}
          />
        )}

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">{getTabIcon(activeTab)}</div>
              <p className="text-muted-foreground">No custom {activeTab}s yet. Add your first one above!</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-700/50 shadow-soft">
                <CardContent className="p-[0px]">
                  {editingId === item.id ? (
                    <div className="p-4">
                      <InlineEditForm
                        item={item}
                        number={editNumber}
                        title={editTitle}
                        imageUrl={editImageUrl}
                        onNumberChange={setEditNumber}
                        onTitleChange={setEditTitle}
                        onImageUrlChange={setEditImageUrl}
                        onSubmit={handleEditSubmit}
                        onCancel={resetEditForm}
                        isValid={isEditFormValid()}
                      />
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/30 flex-shrink-0">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{formatNumber(item.number)}</Badge>
                            <Badge className={`pao-${item.type}`}>{item.type}</Badge>
                          </div>
                          <h3 className="font-semibold">{item.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="rounded-xl hover:bg-primary/10"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteCustomPAO(item.id)}
                            className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 px-6 pb-24 mt-2">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {(['person', 'action', 'object'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveTab(type);
                setShowAddForm(false);
                resetAddForm();
                resetEditForm();
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === type
                  ? `bg-white dark:bg-slate-700 shadow-sm ${
                      type === 'person' ? 'text-rose-600 dark:text-rose-400' :
                      type === 'action' ? 'text-amber-600 dark:text-amber-400' :
                      'text-emerald-600 dark:text-emerald-400'
                    }`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              
              {getTabIcon(type)} <div className="font-semibold">{getItemsForTab(type).length}</div>{type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </main>
  );
}