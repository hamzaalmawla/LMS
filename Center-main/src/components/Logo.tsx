export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle - represents unity */}
      <circle cx="50" cy="50" r="45" fill="url(#gradient1)" />
      
      {/* Book pages */}
      <rect x="30" y="35" width="18" height="30" fill="white" opacity="0.9" rx="2" />
      <rect x="52" y="35" width="18" height="30" fill="white" opacity="0.9" rx="2" />
      
      {/* Book spine */}
      <rect x="48" y="35" width="4" height="30" fill="#2c5282" />
      
      {/* Center dot - symbolizing knowledge hub */}
      <circle cx="50" cy="50" r="8" fill="#ffd700" />
      <circle cx="50" cy="50" r="4" fill="#2c5282" />
      
      {/* Page lines */}
      <line x1="35" y1="42" x2="43" y2="42" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      <line x1="35" y1="47" x2="43" y2="47" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      <line x1="35" y1="52" x2="43" y2="52" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      
      <line x1="57" y1="42" x2="65" y2="42" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      <line x1="57" y1="47" x2="65" y2="47" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      <line x1="57" y1="52" x2="65" y2="52" stroke="#2c5282" strokeWidth="1.5" opacity="0.6" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4299e1" />
          <stop offset="100%" stopColor="#2b6cb0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
