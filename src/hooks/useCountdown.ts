import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function compute(target: number): Countdown {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

export function useCountdown(target: string | Date): Countdown {
  const targetMs = new Date(target).getTime();
  const [state, setState] = useState<Countdown>(() => compute(targetMs));

  useEffect(() => {
    setState(compute(targetMs));
    const id = setInterval(() => setState(compute(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return state;
}
