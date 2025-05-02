import { useEffect, useState } from "react";

export function useResendCountdown(expiryTime = 60, storageKey = 'resendExpireAt') {
  const [seconds, setSeconds] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    const expireAt = parseInt(localStorage.getItem(storageKey)) || 0;
    const now = Date.now();
    const remaining = Math.ceil((expireAt - now) / 1000);

    if (remaining > 0) {
      setSeconds(remaining);
      setCanResend(false);
    }
  }, [storageKey]);

  useEffect(() => {
    let timer;
    if (!canResend && seconds > 0) {
      timer = setTimeout(() => {
        setSeconds(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setCanResend(true);
            localStorage.removeItem(storageKey);
          }
          return next;
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [seconds, canResend, storageKey]);

  const start = () => {
    const expireAt = Date.now() + expiryTime * 1000;
    localStorage.setItem(storageKey, String(expireAt));
    setSeconds(expiryTime);
    setCanResend(false);
  };

  return { seconds, canResend, start };
}
