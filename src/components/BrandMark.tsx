import React from 'react';

interface BrandMarkProps {
  size?: number;
  darkBg?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({size = 36, darkBg = false}) => {
  const navyColor = darkBg ? '#FFFFFF' : '#0A2A66';
  const dividerColor = darkBg ? 'rgba(255,255,255,0.45)' : '#0A2A66';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* E spine & top arm */}
      <path
        d="M8 15C8 10.5817 11.5817 7 16 7H41V16C41 19.866 37.866 23 34 23H20V53H14C10.6863 53 8 50.3137 8 47V15Z"
        fill={navyColor}
      />
      {/* Middle orange arm */}
      <path
        d="M24 27H40C42.2091 27 44 28.7909 44 31V32C44 35.866 40.866 39 37 39H24V27Z"
        fill="#F58220"
      />
      {/* Bottom orange arm */}
      <path
        d="M24 43H43C45.2091 43 47 44.7909 47 47V48C47 50.7614 44.7614 53 42 53H24V43Z"
        fill="#F58220"
      />
      {/* Digital pixels */}
      <rect x="44" y="6" width="6" height="6" rx="1" fill="#F2B705" />
      <rect x="44" y="14" width="6" height="6" rx="1" fill="#F58220" />
      {/* Vertical divider line matching official logo */}
      <line x1="57" y1="7" x2="57" y2="55" stroke={dividerColor} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
