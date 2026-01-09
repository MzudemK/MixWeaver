import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", fullScreen = false }) => {
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    // Only update message if it's the default "Loading..." or a specific loading message
    // We don't want to override custom context-specific messages unless intended
    const timer1 = setTimeout(() => {
      setDisplayMessage(prev => prev === message ? "Still connecting..." : prev);
    }, 3000);

    const timer2 = setTimeout(() => {
        // Only show this message if we are likely hitting a cold start (waiting > 8s)
      setDisplayMessage(prev => prev === "Still connecting..." || prev === message ? "Waking up the server (this may take up to 50s on the free plan)..." : prev);
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [message]);

  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner with Brand Colors */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-obsidian-muted rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-amber-brand border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        {/* Inner glow/dot for extra effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-amber-glow rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
      </div>
      <p className="text-platinum font-display tracking-wider uppercase text-sm animate-pulse text-center max-w-xs">{displayMessage}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="w-full flex items-center justify-center min-h-[200px]">{content}</div>;
};
