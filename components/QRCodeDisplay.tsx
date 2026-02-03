
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRSettings } from '../types';
import { Download, Copy, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  settings: QRSettings;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (canvasRef.current && settings.url) {
      QRCode.toCanvas(canvasRef.current, settings.url, {
        width: 1024,
        margin: settings.margin,
        color: {
          dark: settings.primaryColor,
          light: settings.secondaryColor,
        },
        errorCorrectionLevel: settings.errorCorrectionLevel,
      }, (error) => {
        if (error) console.error(error);
      });
    }
  }, [settings]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qr-kode-${settings.label.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>(resolve => canvasRef.current?.toBlob(resolve));
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Kunne ikke kopiere bilde', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500 w-full max-w-md h-fit">
      <div className="relative group w-full aspect-square flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <p className="text-white font-medium">Klar til nedlasting</p>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900">{settings.label}</h3>
        <p className="text-slate-500 text-sm max-w-[300px] leading-relaxed italic">
          "{settings.description}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Download size={18} />
          Last ned
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold active:scale-95"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
          {copied ? 'Kopiert!' : 'Kopier bilde'}
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
