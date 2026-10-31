import React, { useId } from 'react';

// Marka işareti "yörünge": açık bir halka içinde tek çizgi "e"; halka noktaya yaklaştıkça
// belirginleşip zümrüde döner, nokta halkanın açıklığına oturur.
// public/logo-mark.svg aynı çizimin kutulu (favicon) hâlidir; favicon ve ikonlar ondan üretilir.
export const LogoMark = ({ className = 'w-8 h-8' }) => {
  // Her örnek kendi gradient id'sini kullanır: aynı id gizli (display:none) bir menüdeki
  // kopyaya çözülürse Chrome dolguyu çizmez.
  const id = useId().replace(/:/g, '');
  const orbit = `logo-orbit-${id}`;
  const dot = `logo-dot-${id}`;
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={orbit} x1="6" y1="28" x2="28" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FAFAFA" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#A1A1AA" stopOpacity="0.6" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
        <radialGradient id={dot} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#86EFAC" />
          <stop offset="0.55" stopColor="#22C55E" />
          <stop offset="1" stopColor="#15803D" />
        </radialGradient>
      </defs>
      <path d="M27.2 22.9 A13.4 13.4 0 1 1 29.3 13.2" fill="none" stroke={`url(#${orbit})`} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.6 16.4 H21.4 A5.9 5.9 0 1 0 19.7 20.6" fill="none" stroke="#FAFAFA" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28.6" cy="18" r="2.3" fill={`url(#${dot})`} />
    </svg>
  );
};

const Logo = ({ size = 'md' }) => {
  const mark = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const text = size === 'sm' ? 'text-[17px]' : 'text-lg';
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Erkan Turgut">
      <LogoMark className={`${mark} shrink-0`} />
      <span className={`font-display font-semibold tracking-tight leading-none text-white whitespace-nowrap ${text}`}>
        Erkan Turgut
      </span>
    </span>
  );
};

export default Logo;
