
import React from 'react';

// Base props for all icons to share
const baseIconProps: React.SVGProps<SVGSVGElement> = {
  strokeWidth: "2",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

// Define a type for our icon components
type IconComponent = React.FC<{ className?: string }>;

export const PlayIcon: IconComponent = ({ className = "w-8 h-8" }) => (
  <svg {...baseIconProps} className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export const PauseIcon: IconComponent = ({ className = "w-8 h-8" }) => (
  <svg {...baseIconProps} className={className}>
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export const CogIcon: IconComponent = ({ className = "w-8 h-8" }) => (
  <svg {...baseIconProps} className={className}>
    <path d="M19.14 12.94a2 2 0 0 0 0-1.88l-1.42-1.42a2 2 0 0 1-.59-1.41v-2a2 2 0 0 0-2-2h-2a2 2 0 0 1-1.41-.59l-1.42-1.42a2 2 0 0 0-1.88 0l-1.42 1.42A2 2 0 0 1 6.2 4.1h-2a2 2 0 0 0-2 2v2c0 .52-.21 1.02-.59 1.41L1.19 11.06a2 2 0 0 0 0 1.88l1.42 1.42c.38.38.59.89.59 1.41v2a2 2 0 0 0 2 2h2a2 2 0 0 1 1.41.59l1.42 1.42a2 2 0 0 0 1.88 0l1.42-1.42a2 2 0 0 1 1.41-.59h2a2 2 0 0 0 2-2v-2c0-.52.21-1.02.59-1.41l1.42-1.42zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);

export const PlusIcon: IconComponent = ({ className = "w-8 h-8" }) => (
  <svg {...baseIconProps} className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const HistoryIcon: IconComponent = ({ className = "w-8 h-8" }) => (
  <svg {...baseIconProps} className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// ResetIcon has a different default size
export const ResetIcon: IconComponent = ({ className = "w-6 h-6" }) => (
  <svg {...baseIconProps} className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <path d="M21 3v6h-6" />
  </svg>
);

export const StopIcon: IconComponent = ({ className = "w-6 h-6" }) => (
    <svg {...baseIconProps} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    </svg>
);

export const DownloadIcon: IconComponent = ({ className = "w-5 h-5" }) => (
    <svg {...baseIconProps} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);
