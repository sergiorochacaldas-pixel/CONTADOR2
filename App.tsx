import React, { useState, useEffect, useCallback } from 'react';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { CogIcon, PauseIcon, PlayIcon, PlusIcon, ResetIcon, HistoryIcon, StopIcon } from './components/icons';

type AppState = 'configuring' | 'ready' | 'running' | 'paused' | 'finished';

interface TimerSettings {
  minutes: number;
  seconds: number;
  birdName: string;
  stakeNumber: string;
}

export interface HistoryEntry {
  id: string;
  birdName: string;
  stakeNumber: string;
  date: string;
  totalCount: number;
  duration: string;
  countsPerMinute: number[];
}

const App: React.FC = () => {
  const [totalTime, setTotalTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [appState, setAppState] = useState<AppState>('configuring');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const [birdName, setBirdName] = useState<string>('');
  const [stakeNumber, setStakeNumber] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const [countsPerMinute, setCountsPerMinute] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('countingHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const finishAndSaveSession = useCallback(() => {
    setAppState('finished');
    const elapsedDuration = totalTime - timeRemaining;

    const newHistoryEntry: HistoryEntry = {
      id: new Date().toISOString(),
      birdName,
      stakeNumber,
      date: startTime?.toLocaleString('pt-BR') || new Date().toLocaleString('pt-BR'),
      totalCount: count,
      duration: formatTime(elapsedDuration),
      countsPerMinute: countsPerMinute,
    };

    setHistory(prevHistory => {
      const updatedHistory = [newHistoryEntry, ...prevHistory];
      try {
        localStorage.setItem('countingHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return updatedHistory;
    });
  }, [birdName, stakeNumber, count, totalTime, startTime, countsPerMinute, timeRemaining]);

  // Effect for the timer interval
  useEffect(() => {
    if (appState !== 'running' || timeRemaining <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [appState, timeRemaining]);

  // Effect for handling the finished state
  useEffect(() => {
    if (timeRemaining <= 0 && appState === 'running') {
      finishAndSaveSession();
    }
  }, [timeRemaining, appState, finishAndSaveSession]);
  
  const handleConfirmSettings = useCallback((settings: TimerSettings) => {
    const { minutes, seconds, birdName, stakeNumber } = settings;
    const newTotalTime = (minutes * 60) + seconds;
    if (newTotalTime > 0) {
      setTotalTime(newTotalTime);
      setTimeRemaining(newTotalTime);
      setCount(0);
      setBirdName(birdName);
      setStakeNumber(stakeNumber);
      setStartTime(null);
      setCountsPerMinute([]);
      setAppState('ready');
      setIsSettingsOpen(false);
    }
  }, []);

  const handleStartCountdown = useCallback(() => {
    if (appState === 'ready') {
      setStartTime(new Date());
      setAppState('running');
    }
  }, [appState]);

  const handleTogglePause = useCallback(() => {
    if (appState === 'running') {
      setAppState('paused');
    } else if (appState === 'paused') {
      setAppState('running');
    }
  }, [appState]);
  
  const handleStop = useCallback(() => {
    if (appState === 'running' || appState === 'paused') {
      finishAndSaveSession();
    }
  }, [appState, finishAndSaveSession]);

  const handleIncrementCount = useCallback(() => {
    if (appState === 'running') {
      setCount(prev => prev + 1);

      const elapsedTime = totalTime - timeRemaining;
      const currentMinute = Math.floor(elapsedTime / 60);

      setCountsPerMinute(prevCounts => {
        const newCounts = [...prevCounts];
        newCounts[currentMinute] = (newCounts[currentMinute] || 0) + 1;
        return newCounts;
      });
    }
  }, [appState, totalTime, timeRemaining]);

  const handleReset = useCallback(() => {
    setAppState('configuring');
    setIsSettingsOpen(true);
    setCount(0);
    setBirdName('');
    setStakeNumber('');
    setStartTime(null);
    setCountsPerMinute([]);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleOpenHistory = useCallback(() => {
    setIsHistoryOpen(true);
  }, []);

  const getControlButton = () => {
    if (appState === 'configuring') return null;
    if (appState === 'finished') {
      return (
        <button
          disabled
          className="flex-1 flex justify-center items-center py-2 rounded-full bg-gray-600 opacity-50 cursor-not-allowed"
          aria-label="Timer Finished"
        >
          <PauseIcon className="w-6 h-6" />
        </button>
      );
    }

    const isPlayButton = appState === 'ready' || appState === 'paused';
    const handler = appState === 'ready' ? handleStartCountdown : handleTogglePause;
    const label = appState === 'ready' ? "Start Timer" : appState === 'paused' ? "Resume Timer" : "Pause Timer";
    
    return (
      <button
        onClick={handler}
        className={`flex-1 flex justify-center items-center py-2 rounded-full transition-colors duration-300
          ${isPlayButton ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}
        `}
        aria-label={label}
      >
        {isPlayButton ? <PlayIcon className="w-6 h-6" /> : <PauseIcon className="w-6 h-6" />}
      </button>
    );
  };
  
  const elapsedTimeInSeconds = totalTime - timeRemaining;
  const countsPerMinuteCPM = elapsedTimeInSeconds > 0 ? (count / elapsedTimeInSeconds) * 60 : 0;
  const projectedTotal = totalTime > 0 ? Math.round(countsPerMinuteCPM * (totalTime / 60)) : 0;

  const CountsPerMinuteList = ({ counts }: { counts: number[] }) => {
    const displayEntries = counts
      .map((count, index) => ({ count, index }))
      .slice(-20) // Get the last 20 entries
      .reverse(); // Show the newest first

    if (displayEntries.length === 0) return null;

    return (
      <>
        <h3 className="font-bold text-slate-300 mb-2 text-sm">Contagem/Minuto</h3>
        <ul className="space-y-1 max-h-[calc(20*1.5rem)] overflow-y-auto pr-2">
          {displayEntries.map(({ count, index }) => (
            <li key={index} className="flex justify-between gap-4">
              <span>Min {index + 1}:</span>
              <span className="font-bold text-slate-200 tabular-nums">{count || 0}</span>
            </li>
          ))}
        </ul>
      </>
    );
  };


  return (
    <div className="relative min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 font-mono antialiased overflow-hidden">
      
      {appState !== 'configuring' && appState !== 'ready' && (
        <div className="absolute top-4 left-4 text-left z-10">
          <p className="font-bold text-3xl text-slate-200">{birdName}</p>
          <p className="font-bold text-3xl text-slate-200">Estaca: {stakeNumber}</p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {(appState === 'running' || appState === 'paused') && (
            <button
              onClick={handleStop}
              className="p-3 bg-red-700/60 hover:bg-red-600/80 rounded-full transition-colors duration-300"
              aria-label="Stop Session"
            >
              <StopIcon className="w-6 h-6" />
            </button>
        )}
        <button
          onClick={handleOpenHistory}
          className="p-3 bg-slate-700/50 hover:bg-slate-600/70 rounded-full transition-colors duration-300"
          aria-label="View History"
        >
          <HistoryIcon className="w-6 h-6" />
        </button>
      </div>

      {appState !== 'configuring' && appState !== 'ready' && (
        <div className="absolute top-1/2 -translate-y-1/2 left-4 text-left text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm z-10 hidden lg:block">
          <CountsPerMinuteList counts={countsPerMinute} />
        </div>
      )}

      <header className="w-full text-center pt-24 sm:pt-28 pb-4 sm:pb-6">
        <div 
          className="text-8xl md:text-9xl font-bold tabular-nums tracking-wider text-cyan-300 transition-opacity duration-500"
          style={{ textShadow: '0 0 15px rgba(56, 229, 255, 0.4)'}}
        >
          {formatTime(timeRemaining)}
        </div>
        <div className="text-9xl font-semibold mt-4 text-slate-100 transition-opacity duration-500">
          {count}
        </div>
        <div className="h-10 mt-2">
            {(appState === 'running' || appState === 'paused') && elapsedTimeInSeconds > 0 && (
                <div className="text-slate-400 text-lg" aria-live="polite">
                    Projected Total: <span className="font-bold text-slate-200 text-xl tabular-nums">{projectedTotal}</span>
                </div>
            )}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center flex-grow w-full max-w-md">
        
        {appState !== 'configuring' && appState !== 'ready' && (
            <div className="lg:hidden w-full max-w-xs text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm mb-6">
                <CountsPerMinuteList counts={countsPerMinute} />
            </div>
        )}
        
        <div className="my-6">
            <button
              onClick={handleIncrementCount}
              disabled={appState !== 'running'}
              className="w-56 h-20 bg-cyan-500 hover:bg-cyan-600 rounded-2xl transition-all duration-300 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-cyan-500/30 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Increment Count"
            >
              <span className="text-3xl font-bold tracking-wider text-slate-900">CONTAR</span>
            </button>
        </div>
        
        {appState === 'finished' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <h2 className="text-4xl font-bold mb-2 text-green-400">TEMPO FINALIZADO</h2>
              <p className="text-xl text-slate-300 mb-4">RESULTADO FINAL: <span className="font-bold text-2xl text-white">{count}</span></p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-transform transform hover:scale-105"
              >
                <ResetIcon />
                TELA INICIAL
              </button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/50 backdrop-blur-sm p-4 z-10">
          <div className="max-w-md mx-auto flex items-center justify-center gap-4 text-white">
            <button
              onClick={handleOpenSettings}
              disabled={appState === 'running' || appState === 'paused'}
              className="flex-1 flex justify-center items-center bg-slate-700 hover:bg-slate-600 py-2 rounded-full transition-colors duration-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
              aria-label="Configure Timer"
            >
              <CogIcon className="w-6 h-6" />
            </button>
            {getControlButton()}
          </div>
      </footer>

      {isSettingsOpen && (
        <SettingsModal
          onConfirm={handleConfirmSettings}
          onClose={() => {
            setIsSettingsOpen(false);
            if (totalTime <= 0) {
              setAppState('configuring');
            }
          }}
          onOpenHistory={handleOpenHistory}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal 
            history={history}
            onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
};

export default App;