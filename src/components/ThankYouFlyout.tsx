import React, { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  onClose: () => void;
  duration?: number; // ms
}

const ThankYouFlyout: React.FC<Props> = ({ name, onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
      if (elapsed >= duration) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
        }
        onClose();
      }
    }, 50);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [duration, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-transparent
      backdrop-blur-md backdrop-brightness-75
      animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-pop-in relative min-w-[320px] w-[90vw] max-w-xs">
        <h2 className="text-2xl font-bold text-teal-700 mb-2">Thank You!</h2>
        <p className="text-lg text-teal-800 mb-4 text-center">
          Thank you, <span className="font-semibold">{name}</span>, for your contribution!
        </p>
        <div className="w-full h-2 bg-teal-100 rounded overflow-hidden mb-1">
          <div
            className="h-full bg-teal-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThankYouFlyout;
