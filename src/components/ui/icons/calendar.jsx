export default function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /> {/* Calendar body */}
      <line x1="16" y1="2" x2="16" y2="6" /> {/* Right hook */}
      <line x1="8" y1="2" x2="8" y2="6" /> {/* Left hook */}
      <line x1="2" y1="10" x2="22" y2="10" /> {/* Header bottom line */}
      {/* Optional: Add small lines to represent the days */}
      <line x1="6" y1="14" x2="6" y2="14.01" />
      <line x1="10" y1="14" x2="10" y2="14.01" />
      <line x1="14" y1="14" x2="14" y2="14.01" />
      <line x1="18" y1="14" x2="18" y2="14.01" />
      <line x1="6" y1="18" x2="6" y2="18.01" />
      <line x1="10" y1="18" x2="10" y2="18.01" />
      <line x1="14" y1="18" x2="14" y2="18.01" />
      <line x1="18" y1="18" x2="18" y2="18.01" />
    </svg>
  );
};
