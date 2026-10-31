import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  bgColor?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color,
  bgColor = 'rgba(48, 59, 51, 0.8)',
  height = 6,
  showLabel = false,
  animated = true,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const barColor =
    color ||
    (clamped >= 100 ? '#F17E69' : clamped >= 85 ? '#F3D66B' : '#38C98A');

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[#A6B2A8]">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: `${height}px`, backgroundColor: bgColor }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${animated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
            boxShadow: clamped < 100 ? `0 0 8px ${barColor}40` : 'none',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

