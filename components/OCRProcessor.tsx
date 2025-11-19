import React, { useState, useCallback } from 'react';
import { UploadCloud, FileImage, X, Copy, Check, AlertCircle, FileText, Download, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { performOCR } from '../services/geminiService';
import { AppState } from '../types';

interface OCRProcessorProps {
  credits: number;
  deductCredit: () => boolean;
  setCurrentPage: (page: AppState) => void;
}

export const OCRProcessor: React.FC<OCRProcessorProps> = ({ credits, deductCredit, setCurrentPage }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB.");
      return;
    }

    setError(null);
    setResult(null);
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!file) return;

    if (credits <= 0) {
      setCurrentPage(AppState.PRICING);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (deductCredit()) {
        const text = await performOCR(file);
        setResult(text);
      } else {
        setError("Insufficient credits.");
        setCurrentPage(AppState.PRICING);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadText = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "extracted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 container max-w-[1600px] py-6 px-4 md:px-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Title Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace</h1>
          <p className="text-muted-foreground text-sm">Upload an image to instantly extract text using AI.</p>
        </div>
        {credits < 3 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 text-yellow-600 text-xs rounded-md font-medium border border-yellow-500/20">
            <AlertCircle size={14} />
            <span>Low credits balance</span>
            <span className="underline cursor-pointer ml-1" onClick={() => setCurrentPage(AppState.PRICING)}>Top up</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 pb-6">
        
        {/* LEFT PANEL: Source */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-background/60 backdrop-blur-xl">
          <div className="p-3 px-4 border-b flex items-center justify-between bg-muted/30 shrink-0">
            <div className="flex items-center gap-2 font-medium text-sm">
              <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-600">
                <FileImage size={16} />
              </div>
              Source Image
            </div>
            {file && (
              <Button variant="ghost" size="sm" onClick={clearFile} className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <X size={14} className="mr-1.5" /> Clear
              </Button>
            )}
          </div>

          <div className="flex-1 relative p-4 bg-muted/5 flex flex-col min-h-[300px]">
            {!preview ? (
              <div 
                className="flex-1 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all duration-200 cursor-pointer group"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-8 text-center">
                  <div className="w-16 h-16 mb-6 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Click or drag image here</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Supports JPG, PNG, WEBP up to 5MB. 
                    <br/>Each scan costs <span className="font-medium text-foreground">1 Credit</span>.
                  </p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center relative rounded-lg overflow-hidden border bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-100">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain shadow-lg" 
                  style={{ maxHeight: 'calc(100vh - 300px)' }}
                />
              </div>
            )}
          </div>

          {/* Footer Action Area */}
          <div className="p-4 border-t bg-background shrink-0 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
               {file ? file.name : "No file selected"}
            </div>
            <Button 
              onClick={handleProcess} 
              isLoading={isProcessing} 
              disabled={!file || isProcessing}
              className={`w-full md:w-auto min-w-[140px] transition-all duration-300 ${!file ? 'opacity-50' : 'shadow-md hover:shadow-lg shadow-primary/20'}`}
            >
              {isProcessing ? 'Scanning...' : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract Text
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* RIGHT PANEL: Result */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-background/60 backdrop-blur-xl">
          <div className="p-3 px-4 border-b flex items-center justify-between bg-muted/30 shrink-0">
            <div className="flex items-center gap-2 font-medium text-sm">
              <div className="p-1.5 bg-green-500/10 rounded-md text-green-600">
                <FileText size={16} />
              </div>
              Extracted Result
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!result}
                className="h-8"
              >
                {copied ? <Check size={14} className="mr-1.5 text-green-600" /> : <Copy size={14} className="mr-1.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadText} 
                disabled={!result}
                className="h-8"
              >
                <Download size={14} className="mr-1.5" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex-1 relative bg-background p-0 min-h-[300px]">
            {error ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle size={24} />
                 </div>
                 <h3 className="font-medium mb-1">Processing Failed</h3>
                 <p className="text-sm opacity-90">{error}</p>
               </div>
            ) : (
              <textarea
                className="w-full h-full resize-none border-0 p-6 text-sm leading-relaxed focus-visible:ring-0 focus-visible:outline-none font-mono bg-transparent"
                placeholder={isProcessing ? "Analyzing image content..." : "Extracted text will appear here..."}
                readOnly
                value={result || ''}
              />
            )}
            
            {!result && !isProcessing && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20">
                <FileText className="w-24 h-24 mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Ready to extract</p>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                 {/* Additional visual cue for loading if needed, Button has loader already */}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t bg-muted/30 shrink-0 flex justify-end">
             <span className="text-[10px] text-muted-foreground px-2">
               {result ? `${result.length} characters` : '0 characters'}
             </span>
          </div>
        </Card>

      </div>
    </div>
  );
};