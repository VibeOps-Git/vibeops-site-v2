'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function ScrambleText({
  text,
  className,
  duration = 0.5,
  trigger: _trigger = 'inView', // kept for API compat, no longer drives animation
}: {
  text: string;
  className?: string;
  duration?: number;
  trigger?: 'inView' | 'mount';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text); // always start with real text visible
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runScramble = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    let frame = 0;
    const totalFrames = Math.floor(duration * 60);
    timerRef.current = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * text.length);
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealCount) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('')
      );
      if (frame >= totalFrames) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setDisplay(text);
      }
    }, 1000 / 60);
  }, [text, duration]);

  // Cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <span ref={ref} className={className} onMouseEnter={runScramble}>
      {display}
    </span>
  );
}