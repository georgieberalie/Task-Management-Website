import React from 'react';

export const PatternedBackground: React.FC = () => (
  <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden select-none">
    <svg className="h-full w-full opacity-60 dark:opacity-35 transition-opacity duration-300">
      <pattern
        id="kanbn-dots"
        x="10"
        y="10"
        width="14.423223834988539"
        height="14.423223834988539"
        patternUnits="userSpaceOnUse"
        patternTransform="translate(-0.45072574484339184,-0.45072574484339184)"
      >
        <circle
          cx="0.45072574484339184"
          cy="0.45072574484339184"
          r="0.45072574484339184"
          fill="currentColor"
          className="text-neutral-400 dark:text-neutral-500"
        />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#kanbn-dots)" />
    </svg>
  </div>
);

export default PatternedBackground;
