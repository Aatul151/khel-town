import { useEffect, useState } from "react";

interface CountdownProps {
  onComplete: () => void;
  onStart?: () => void;
}

export function Countdown({ onComplete, onStart }: CountdownProps) {
  const [count, setCount] = useState<number | null>(null);
  const [showReady, setShowReady] = useState(true);

  useEffect(() => {
    if (onStart) {
      onStart();
    }

    // Show "Ready" for 0.5 seconds
    const readyTimer = setTimeout(() => {
      setShowReady(false);
      setCount(3);
    }, 500);

    return () => clearTimeout(readyTimer);
  }, [onStart]);

  useEffect(() => {
    if (count === null || showReady) return;

    if (count === 0) {
      // Show "Start!" for a brief moment
      const startTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(startTimer);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, showReady, onComplete]);

  if (showReady) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white animate-pulse">
            Ready...
          </div>
        </div>
      </div>
    );
  }

  if (count === null) return null;

  if (count === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-bounce">
            Start!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center">
        <div className="text-8xl sm:text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-pulse">
          {count}
        </div>
      </div>
    </div>
  );
}
