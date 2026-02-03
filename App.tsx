
import React, { useState } from 'react';
import { Sparkles, Globe, Settings2, RefreshCw, AlertCircle, QrCode } from 'lucide-react';
import { analyzeURL } from './services/geminiService';
import { QRSettings, AppStatus } from './types';
import QRCodeDisplay from './components/QRCodeDisplay';

const App: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [settings, setSettings] = useState<QRSettings>({
    url: '',
    label: 'Min QR-kode',
    primaryColor: '#1C2C5B',
    secondaryColor: '#ffffff',
    description: 'Skriv inn tekst eller en URL for å generere en AI-forbedret QR-kode.',
    errorCorrectionLevel: 'M',
    margin: 4,
  });

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      alert("Vennligst skriv inn tekst eller en URL.");
      return;
    }

    setStatus(AppStatus.ANALYZING);
    try {
      const analysis = await analyzeURL(urlInput);
      setSettings(prev => ({
        ...prev,
        url: urlInput,
        label: analysis.label,
        primaryColor: analysis.primaryColor,
        secondaryColor: analysis.secondaryColor,
        description: analysis.description,
      }));
      setStatus(AppStatus.READY);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setUrlInput('');
    setStatus(AppStatus.IDLE);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B0F19]">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Input & Controls */}
        <div className="space-y-8 py-8 px-4 lg:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles size={12} />
              AI-FORBEDRET GENERATOR
            </div>
            <h1 className="text-6xl font-extrabold text-white tracking-tight">
              QR Gen <span className="text-blue-500">Studio.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              Lag vakre, merkevare-tilpassede QR-koder på sekunder. Vår AI analyserer lenken din for å foreslå perfekt styling og etiketter.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-6 max-w-md">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Globe size={20} />
              </div>
              <input
                type="text"
                placeholder="https://dinnettside.no"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-xl"
              />
            </div>

            <button
              type="submit"
              disabled={status === AppStatus.ANALYZING || !urlInput.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl ${
                status === AppStatus.ANALYZING 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-500/30'
              }`}
            >
              {status === AppStatus.ANALYZING ? (
                <>
                  <RefreshCw className="animate-spin" size={22} />
                  AI tenker...
                </>
              ) : (
                <>
                  <QrCode size={22} />
                  Generer Magisk QR
                </>
              )}
            </button>
          </form>

          {status === AppStatus.READY && (
            <div className="space-y-6 pt-8 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-500 max-w-md">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <Settings2 size={18} className="text-blue-400" />
                  Tilpasning
                </h2>
                <button 
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  Start på nytt
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primærfarge</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <input 
                      type="color" 
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-slate-300 uppercase">{settings.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bakgrunn</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5">
                    <input 
                      type="color" 
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-xs font-mono text-slate-300 uppercase">{settings.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Etikett-tekst</label>
                <input
                  type="text"
                  value={settings.label}
                  onChange={(e) => setSettings({...settings, label: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/40 border border-white/5 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm shadow-inner"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview Area */}
        <div className="flex flex-col items-center justify-center py-8">
          {status === AppStatus.IDLE && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-20">
              <div className="w-64 h-64 rounded-[40px] border-4 border-dashed border-slate-700 flex items-center justify-center">
                <QrCode size={80} className="text-slate-700" />
              </div>
              <p className="text-slate-500 font-medium">Forhåndsvisning vises her</p>
            </div>
          )}

          {status === AppStatus.ANALYZING && (
            <div className="flex flex-col items-center space-y-10">
              <div className="relative">
                <div className="w-64 h-64 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={64} className="text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-white text-xl font-semibold">Gemini analyserer innhold...</p>
                <p className="text-slate-500 text-sm italic">"Identifiserer estetiske egenskaper..."</p>
              </div>
            </div>
          )}

          {status === AppStatus.READY && (
            <div className="w-full flex justify-center">
               <QRCodeDisplay settings={settings} />
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="bg-red-500/5 border border-red-500/10 p-12 rounded-[40px] text-center space-y-6 max-w-sm backdrop-blur-md">
              <AlertCircle size={56} className="text-red-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-red-400">Analyse mislyktes</h3>
                <p className="text-red-200/50 text-sm leading-relaxed">Vi kunne ikke analysere innholdet automatisk, men du kan fortsatt generere koden manuelt.</p>
              </div>
              <button 
                onClick={() => setStatus(AppStatus.READY)}
                className="w-full text-white bg-red-600/80 hover:bg-red-600 px-6 py-4 rounded-2xl text-sm font-bold transition-colors"
              >
                Fortsett likevel
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-slate-700 text-xs relative z-10 flex items-center gap-6">
        <span>© 2024 QR Gen Studio</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full" />
        <span>Drevet av Gemini 3</span>
      </footer>
    </div>
  );
};

export default App;
