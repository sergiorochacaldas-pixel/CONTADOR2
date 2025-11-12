import React, { useState } from 'react';
import { HistoryIcon } from './icons';

interface TimerSettings {
  minutes: number;
  seconds: number;
  birdName: string;
  stakeNumber: string;
}

interface SettingsModalProps {
  onConfirm: (settings: TimerSettings) => void;
  onClose: () => void;
  onOpenHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onConfirm, onClose, onOpenHistory }) => {
  const [selectedTime, setSelectedTime] = useState<number>(5);
  const [birdName, setBirdName] = useState<string>('');
  const [stakeNumber, setStakeNumber] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ minutes: selectedTime, seconds: 0, birdName, stakeNumber });
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-sm border border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="modal-title" className="text-2xl font-bold text-cyan-300">Configurar Contador</h2>
            <button
                onClick={onOpenHistory}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/70 rounded-full transition-colors duration-300"
                aria-label="View History"
            >
                <HistoryIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="birdName" className="block text-sm font-medium text-slate-400 mb-2">Nome da Ave</label>
              <input
                id="birdName"
                type="text"
                value={birdName}
                onChange={(e) => setBirdName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="stakeNumber" className="block text-sm font-medium text-slate-400 mb-2">Número da Estaca</label>
              <input
                id="stakeNumber"
                type="text"
                value={stakeNumber}
                onChange={(e) => setStakeNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Duração</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`w-full p-3 rounded-lg transition-colors text-center font-semibold ${
                    selectedTime === time
                      ? 'bg-cyan-500 text-slate-900 ring-2 ring-cyan-300'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {time} min
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
          >
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;