"use client";

import { useEffect } from "react";

export default function ClientProtector({ children }) {
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();

    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("selectstart", preventDefault);
    document.addEventListener("dragstart", preventDefault);

    const handleTouch = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener("touchstart", handleTouch, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return <>{children}</>;
}
