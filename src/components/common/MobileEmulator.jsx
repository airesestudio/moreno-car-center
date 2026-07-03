import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  RotateCcw, 
  RefreshCw, 
  X, 
  Wifi, 
  Battery, 
  Globe,
  Lock,
  Share2
} from 'lucide-react';

const DEVICES = [
  { id: 'generic', name: 'Smartphone Flagship Genérico', width: 390, height: 844, notch: 'punch-hole' },
  { id: 'iphone', name: 'iPhone 15 Pro', width: 393, height: 852, notch: 'dynamic-island' },
  { id: 'galaxy', name: 'Samsung Galaxy S24 Ultra', width: 412, height: 915, notch: 'punch-hole' },
  { id: 'tablet', name: 'Tablet Mini', width: 768, height: 1024, notch: 'none' },
];

export default function MobileEmulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(0.85);
  const [iframeKey, setIframeKey] = useState(0);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [inIframe, setInIframe] = useState(false);
  const [showBrowserBar, setShowBrowserBar] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setInIframe(true);
    }

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const targetHeight = isLandscape ? selectedDevice.width : selectedDevice.height;
        const availableHeight = window.innerHeight - 130;
        if (targetHeight > availableHeight) {
          setScale(Math.max(0.45, Math.min(0.9, (availableHeight / targetHeight).toFixed(2))));
        } else {
          setScale(0.88);
        }
      }
    };
    if (isOpen) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, selectedDevice, isLandscape]);

  if (inIframe) return null;

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const activeWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const activeHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  const getIframeUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('in_emulator', 'true');
    return url.toString();
  };

  return (
    <>
      {/* Floating Action Button to Trigger Emulator (Hidden on Mobile screens) */}
      {!isOpen && typeof window !== 'undefined' && window.innerWidth >= 768 && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white shadow-2xl hover:bg-[#DC1B46] dark:hover:bg-[#DC1B46] transition-all duration-300 border border-white/20 group active:scale-95 cursor-pointer"
          title="Abrir emulador de smartphone"
        >
          <Smartphone className="w-5 h-5 text-[#DC1B46] group-hover:text-white transition-colors" />
          <span className="font-medium text-sm tracking-wide">Modo Móvil</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Emulator Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden select-none">
          
          {/* Top Control Toolbar */}
          <div className="w-full max-w-5xl px-4 py-2.5 mt-2 mx-auto flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md text-slate-200">
            
            {/* Device Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#DC1B46]" /> Dispositivo:
              </span>
              <select
                value={selectedDevice.id}
                onChange={(e) => {
                  const dev = DEVICES.find(d => d.id === e.target.value);
                  if (dev) setSelectedDevice(dev);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#DC1B46] cursor-pointer"
              >
                {DEVICES.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.width}×{d.height})
                  </option>
                ))}
              </select>
            </div>

            {/* Controls Center */}
            <div className="flex items-center gap-1.5 bg-slate-800/70 p-1 rounded-xl border border-white/5">
              
              {/* Rotate Orientation */}
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLandscape ? 'bg-[#DC1B46] text-white' : 'hover:bg-slate-700 text-slate-300'
                }`}
                title="Girar orientación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isLandscape ? 'Horizontal' : 'Vertical'}</span>
              </button>

              {/* Toggle Safari/Chrome Browser Bar */}
              <button
                onClick={() => setShowBrowserBar(!showBrowserBar)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showBrowserBar ? 'bg-slate-700 text-white font-bold' : 'hover:bg-slate-700 text-slate-400'
                }`}
                title="Mostrar/ocultar barra del navegador"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Barra Web</span>
              </button>

              {/* Refresh Iframe */}
              <button
                onClick={handleRefresh}
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                title="Recargar vista móvil"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recargar</span>
              </button>

              {/* Zoom Scale */}
              <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                <button
                  onClick={() => setScale(s => Math.max(0.4, s - 0.05))}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 text-sm font-bold cursor-pointer"
                  title="Reducir zoom"
                >
                  -
                </button>
                <span className="text-xs font-mono w-11 text-center text-slate-300">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => setScale(s => Math.min(1.1, s + 0.05))}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-700 text-slate-300 text-sm font-bold cursor-pointer"
                  title="Aumentar zoom"
                >
                  +
                </button>
              </div>
            </div>

            {/* Exit Emulator */}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-semibold text-xs transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Salir del Modo Móvil</span>
            </button>
          </div>

          {/* Smartphone Hardware Frame Area */}
          <div className="flex-1 flex items-center justify-center w-full overflow-hidden p-2">
            
            <div
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative origin-center flex items-center justify-center"
            >
              {/* Hardware Side Buttons */}
              {/* Volume Buttons (Left) */}
              <div className="absolute -left-[16px] top-28 w-[5px] h-11 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l-md border-y border-l border-slate-600 shadow-md"></div>
              <div className="absolute -left-[16px] top-44 w-[5px] h-11 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l-md border-y border-l border-slate-600 shadow-md"></div>
              {/* Action/Mute Button (Left Top) */}
              <div className="absolute -left-[16px] top-14 w-[5px] h-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-l-md border-y border-l border-orange-400 shadow-md"></div>
              {/* Power Button (Right) */}
              <div className="absolute -right-[16px] top-32 w-[5px] h-14 bg-gradient-to-l from-slate-700 to-slate-800 rounded-r-md border-y border-r border-slate-600 shadow-md"></div>

              {/* Chassis Outer Bezel */}
              <div
                style={{
                  width: activeWidth + 26,
                  height: activeHeight + 26,
                }}
                className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[54px] p-[13px] shadow-[0_35px_100px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18)] ring-4 ring-slate-800/90 flex flex-col items-center justify-center overflow-hidden"
              >
                {/* Earpiece Speaker Slot at Top Bezel */}
                <div className="absolute top-2 inset-x-0 flex justify-center z-40 pointer-events-none">
                  <div className="w-14 h-1 bg-slate-950 rounded-full border border-white/10 shadow-inner"></div>
                </div>

                {/* Inner Bezel Border Reflection */}
                <div className="absolute inset-2 rounded-[44px] border border-white/10 pointer-events-none z-40"></div>

                {/* Smartphone Screen Container */}
                <div
                  style={{
                    width: activeWidth,
                    height: activeHeight,
                  }}
                  className="relative bg-white dark:bg-[#090D16] rounded-[41px] overflow-hidden flex flex-col shadow-inner border border-black/40"
                >
                  {/* Dedicated Top Hardware Status Bar (Safe Area) */}
                  <div className="h-10 shrink-0 bg-white dark:bg-[#090D16] border-b border-slate-100 dark:border-slate-900 flex items-center justify-between px-6 text-slate-900 dark:text-white text-[12px] font-bold select-none z-30">
                    {/* Clock */}
                    <div className="w-12 tracking-tight">{currentTime}</div>

                    {/* Notch / Dynamic Island / Camera */}
                    {selectedDevice.notch === 'dynamic-island' && !isLandscape && (
                      <div className="h-[24px] w-[94px] bg-black rounded-full flex items-center justify-end px-3 shadow-md border border-white/15">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/10 relative">
                          <div className="absolute inset-0.5 rounded-full bg-blue-900/50"></div>
                        </div>
                      </div>
                    )}
                    {selectedDevice.notch === 'punch-hole' && !isLandscape && (
                      <div className="h-[20px] w-[20px] bg-black rounded-full flex items-center justify-center shadow-md border border-white/15">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#141414] border border-blue-900/40"></div>
                      </div>
                    )}

                    {/* Icons */}
                    <div className="flex items-center gap-1.5 opacity-90">
                      <span className="text-[10px] font-extrabold tracking-tighter">5G</span>
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  {/* Simulated Mobile Safari / Chrome Address Bar (Toggleable) */}
                  {showBrowserBar && (
                    <div className="h-11 shrink-0 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-3 flex items-center justify-between gap-2 z-20">
                      <div className="flex-1 h-8 bg-white dark:bg-slate-800/90 rounded-lg px-3 flex items-center justify-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                        <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate text-[11px]">moreno-car-center.app</span>
                      </div>
                      <button 
                        onClick={handleRefresh}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Recargar página"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Iframe Viewport (Takes remaining height cleanly) */}
                  <div className="flex-1 w-full overflow-hidden bg-slate-50 dark:bg-[#090D16]">
                    <iframe
                      key={iframeKey}
                      src={getIframeUrl()}
                      title="Vista móvil nativa de Moreno Car Center"
                      className="w-full h-full border-none block"
                    />
                  </div>

                  {/* Dedicated Bottom Safe Area & Home Indicator */}
                  <div className="h-5 shrink-0 bg-white dark:bg-[#090D16] border-t border-slate-100 dark:border-slate-900 flex items-center justify-center z-30">
                    <div className="w-32 h-1 bg-slate-900 dark:bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="py-2 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
            <span>💡 Emulación aislada sin colisión de barras (<span className="text-white font-mono">{activeWidth}px × {activeHeight}px</span>).</span>
          </div>

        </div>
      )}
    </>
  );
}
