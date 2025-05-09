'use client';

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

export default function CaptureLayout({ children }) {
  useEffect(() => {
    // Add viewport meta tag for fullscreen
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);

    // Add meta tags for hiding navigation bars
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    const appleStatusBar = document.createElement('meta');
    appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusBar.content = 'black-translucent';
    document.head.appendChild(appleStatusBar);

    return () => {
      // Cleanup meta tags on unmount
      document.head.removeChild(meta);
      document.head.removeChild(appleMeta);
      document.head.removeChild(appleStatusBar);
    };
  }, []);

  return (
    <div className="h-[100vh] max-h-[100vh] overflow-hidden bg-black">
      {children}
      <Toaster position="bottom-center" />  
    </div>
  );
} 