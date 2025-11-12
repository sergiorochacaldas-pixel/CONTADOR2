import React, { useState } from 'react';
import { HistoryEntry } from '../App';
import { DownloadIcon } from './icons';

interface HistoryModalProps {
  history: HistoryEntry[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose }) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrint = () => {
    if (selectedEntryId) {
      window.print();
    }
  };


  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 history-modal-wrapper"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-lg border border-slate-700 flex flex-col history-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        <div className="flex justify-between items-center mb-6 modal-header">
            <h2 id="history-modal-title" className="text-2xl font-bold text-cyan-300">Histórico de Contagem</h2>
            {history.length > 0 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        disabled={!selectedEntryId}
                        className="flex items-center gap-2 text-sm bg-green-700 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Baixar Relatório
                    </button>
                </div>
            )}
        </div>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
            {history.length > 0 ? (
                <ul className="space-y-4">
                    {history.map((entry) => (
                        <li 
                            key={entry.id} 
                            onClick={() => setSelectedEntryId(entry.id)}
                            className={`bg-slate-900 p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-cyan-400/70
                                ${selectedEntryId === entry.id 
                                ? 'border-cyan-500 ring-2 ring-cyan-500/50 selected-for-print' 
                                : 'border-slate-700'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-white">{entry.birdName}</p>
                                    <p className="text-sm text-slate-400">Estaca: {entry.stakeNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyan-300 tabular-nums">{entry.totalCount}</p>
                                    <p className="text-xs text-slate-500">Contagens</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                                <span>{entry.date}</span>
                                <span>Duração: {entry.duration}</span>
                            </div>

                            {entry.countsPerMinute && entry.countsPerMinute.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-700/50">
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Detalhes por Minuto:</h4>
                                    <ul className="text-xs text-slate-400 space-y-1 max-h-40 overflow-y-auto pr-2">
                                        {entry.countsPerMinute.map((count, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>Minuto {index + 1}:</span>
                                                <span className="font-semibold text-slate-200">{count || 0}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-slate-400">Nenhum registro encontrado.</p>
                    <p className="text-sm text-slate-500 mt-2">Complete uma sessão para ver aqui.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;