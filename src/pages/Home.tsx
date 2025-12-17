import { useState, useEffect, useRef } from 'react';
import { Play, Square, Send } from 'lucide-react';

interface Log {
  time: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Home() {
  const [address, setAddress] = useState('');
  const [isAutoClaiming, setIsAutoClaiming] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setLogs(prev => [{
      time: new Date().toLocaleTimeString(),
      message,
      type
    }, ...prev].slice(0, 100));
  };

  const claim = async () => {
    if (!address) {
      addLog('Address is required', 'error');
      if (isAutoClaiming) setIsAutoClaiming(false);
      return;
    }

    try {
      addLog(`Claiming for ${address}...`, 'info');
      const res = await fetch('/api/faucet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await res.json();
      
      if (data.success) {
        addLog(`Claim success! Tx: ${data.result}`, 'success');
      } else {
        addLog(`Claim failed: ${data.error}`, 'error');
      }
    } catch (err) {
      addLog(`Network error: ${err}`, 'error');
    }
  };

  useEffect(() => {
    if (isAutoClaiming) {
      const run = async () => {
        await claim();
      };
      run(); // immediate first run
      intervalRef.current = setInterval(run, 10000); // every 10 seconds
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoClaiming]); // Removed address from deps to avoid reset on type

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-400">Tempo Testnet Faucet Auto-Claimer</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..." 
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={claim}
              disabled={isAutoClaiming}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
              Claim Once
            </button>
            
            <button 
              onClick={() => setIsAutoClaiming(!isAutoClaiming)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                isAutoClaiming 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAutoClaiming ? <Square size={18} /> : <Play size={18} />}
              {isAutoClaiming ? 'Stop Auto Claim' : 'Start Auto Claim (10s)'}
            </button>
          </div>
        </div>

        <div className="bg-black p-4 rounded-lg h-96 overflow-y-auto border border-gray-800">
          <div className="text-gray-500 text-sm mb-2 sticky top-0 bg-black pb-2 border-b border-gray-800 flex justify-between">
            <span>Logs</span>
            <button onClick={() => setLogs([])} className="text-xs hover:text-white">Clear</button>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={`text-sm ${
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'error' ? 'text-red-400' : 'text-gray-300'
              }`}>
                <span className="text-gray-600">[{log.time}]</span> {log.message}
              </div>
            ))}
            {logs.length === 0 && <div className="text-gray-600 italic">Ready to claim...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
