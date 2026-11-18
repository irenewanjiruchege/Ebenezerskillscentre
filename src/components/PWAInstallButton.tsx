import React, {useState} from 'react';
import {Download, WifiOff, X} from 'lucide-react';
import {useOnlineStatus, usePWAInstall} from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{compact?: boolean}> = ({compact = false}) => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#0A2A66]/20 bg-white text-[#0A2A66] font-medium hover:bg-[#0A2A66] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
        }`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Install Offline App</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuide(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#0A2A66]/20 bg-white text-[#0A2A66] font-medium hover:bg-[#0A2A66]/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
        }`}
      >
        <Download className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{isIOS ? 'Install on iPhone' : 'Save Offline App'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Install Ebenezer App"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-[#0A2A66]/10">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-[#0A2A66]">Save Ebenezer for Offline Use</h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install instructions"
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Install this web app on your phone so course fees, contact info, and admission forms load quickly even on weak mobile data in Ngama &amp; Kajiado.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-slate-700 list-decimal list-inside">
              {isIOS ? (
                <>
                  <li>Tap the <strong>Share</strong> icon in Safari at the bottom of your screen.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> to keep Ebenezer one tap away.</li>
                </>
              ) : (
                <>
                  <li>Open your browser menu (three dots in Chrome/Edge).</li>
                  <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</li>
                  <li>Confirm to open Ebenezer offline anytime.</li>
                </>
              )}
            </ol>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-lg bg-[#0A2A66] py-2.5 text-sm font-semibold text-white hover:bg-[#071E4B] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-lg bg-[#0A2A66] px-3.5 py-2 text-xs font-medium text-white shadow-lg border border-[#F58220]/40"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#F2B705]" aria-hidden="true" />
      <span>Offline Mode · Saved Ebenezer data is active</span>
    </div>
  );
};
