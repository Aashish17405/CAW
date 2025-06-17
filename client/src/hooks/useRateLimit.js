import { useState, useCallback } from "react";

export default function useRateLimit(delayMs = 1000) {
  const [lastCallTime, setLastCallTime] = useState(0);
  const [isLimited, setIsLimited] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall < delayMs) {
      setIsLimited(true);
      return false;
    }

    setLastCallTime(now);
    setIsLimited(false);
    return true;
  }, [delayMs, lastCallTime]);

  return { isLimited, checkRateLimit };
}
