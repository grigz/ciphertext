import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play, Pause, RefreshCw, Github, ExternalLink } from 'lucide-react';

const App = () => {
  const [blocks, setBlocks] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [speed, setSpeed] = useState(100);
  const scrollRef = useRef(null);

  // Generates a simulated RSA-2048 Base64 block (344 chars)
  const generateRSABlock = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = 'MII'; // Common prefix for RSA keys/messages in DER encoding
    for (let i = 0; i < 339; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '=='; // Base64 padding
  };

  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        setBlocks(prev => {
          const newBlocks = [...prev, { id: Date.now(), content: generateRSABlock() }];
          // Keep only the last 20 blocks to prevent memory issues
          return newBlocks.slice(-20);
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isStreaming, speed]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks]);

  const clearStream = () => setBlocks([]);

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-emerald-900 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-widest uppercase">RSA-2048 Cipher-Stream</h1>
              <p className="text-xs text-emerald-700">Protocol: Asymmetric / Encoding: Base64</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase ml-1">Speed (ms)</span>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="50"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="accent-emerald-500 w-32"
              />
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <button 
              onClick={() => setIsStreaming(!isStreaming)}
              className={`p-2 rounded-lg transition-all ${isStreaming ? 'text-orange-500 hover:bg-orange-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
            >
              {isStreaming ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              onClick={clearStream}
              className="p-2 text-zinc-400 hover:text-white transition-all"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Terminal Area */}
        <div 
          ref={scrollRef}
          className="flex-grow bg-zinc-950 border border-emerald-900/30 rounded-lg overflow-y-auto p-4 relative shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)] custom-scrollbar"
        >
          <div className="space-y-4">
            {blocks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-emerald-900 py-20">
                <Terminal size={48} className="mb-4 opacity-20" />
                <p>Waiting for data stream...</p>
              </div>
            )}
            {blocks.map((block) => (
              <div key={block.id} className="group relative">
                <div className="absolute -left-2 top-0 h-full w-0.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between text-[10px] text-emerald-900/60 uppercase tracking-tighter">
                    <span>Block ID: {block.id.toString(16).toUpperCase()}</span>
                    <span>Entropy: 0.9982</span>
                  </div>
                  <div className="text-sm md:text-base leading-relaxed break-all font-medium opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-wrap">
                    {block.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Scanning Line Effect */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-20 w-full animate-scan"></div>
        </div>

        {/* Footer / Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] text-emerald-800 uppercase tracking-widest">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Uplink: Active</span>
          </div>
          <div className="text-center">Encryption Standard: PKCS #1 v2.1</div>
          <div className="text-right">Bit Depth: 2048</div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
