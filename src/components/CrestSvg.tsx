import React from 'react';

export const AldervaneCrest: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke="#C9A96A" strokeWidth="1.5" fill="none" opacity="0.9" />
      <circle cx="50" cy="50" r="42" stroke="#C9A96A" strokeWidth="0.6" fill="none" opacity="0.5" />

      {/* Inner shield */}
      <path
        d="M50 18 L72 28 L72 52 C72 68 62 80 50 86 C38 80 28 68 28 52 L28 28 Z"
        fill="#14202B"
        stroke="#C9A96A"
        strokeWidth="1.2"
      />

      {/* Stylized A */}
      <path
        d="M50 32 L62 62 H55.5 L53 55 H47 L44.5 62 H38 L50 32 Z M48.5 49 H51.5 L50 44.5 L48.5 49 Z"
        fill="#C9A96A"
      />

      {/* Laurel left */}
      <path
        d="M22 55 Q18 48 20 40 Q22 35 26 38 Q24 44 26 50 Q24 54 22 55"
        stroke="#C9A96A"
        strokeWidth="1.1"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M24 42 Q22 38 25 36"
        stroke="#C9A96A"
        strokeWidth="0.9"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M25 48 Q23 45 26 43"
        stroke="#C9A96A"
        strokeWidth="0.9"
        fill="none"
        opacity="0.7"
      />

      {/* Laurel right */}
      <path
        d="M78 55 Q82 48 80 40 Q78 35 74 38 Q76 44 74 50 Q76 54 78 55"
        stroke="#C9A96A"
        strokeWidth="1.1"
        fill="none"
        opacity="0.85"
      />
      <path
        d="M76 42 Q78 38 75 36"
        stroke="#C9A96A"
        strokeWidth="0.9"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M75 48 Q77 45 74 43"
        stroke="#C9A96A"
        strokeWidth="0.9"
        fill="none"
        opacity="0.7"
      />

      {/* Year ribbon */}
      <path
        d="M32 72 Q50 78 68 72"
        stroke="#C9A96A"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fill="#C9A96A"
        fontSize="7"
        fontFamily="Georgia, serif"
        letterSpacing="1.5"
        opacity="0.9"
      >
        1794
      </text>
    </svg>
  );
};

export default AldervaneCrest;
