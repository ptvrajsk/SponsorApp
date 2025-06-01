import React from "react";

interface ProgressBarProps {
  percent: number;
}

const getColor = (percent: number) => {
  if (percent >= 100) return "bg-teal-400";
  if (percent > 40) return "bg-yellow-200"; // pastel yellow
  return "bg-red-200"; // pastel red
};

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <div className="w-full h-4 bg-gray-100 rounded-lg overflow-hidden shadow-inner transition-all">
    <div
      className={`h-full ${getColor(percent)} transition-all duration-700`}
      style={{
        width: `${Math.min(percent, 100)}%`,
      }}
    />
  </div>
);

export default ProgressBar;
