'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export function ScrambleText({
  text,
  className,
  duration = 0.6,
  trigger = 'inView',
}: {
  text: string;
  className?: string;
  duration?: number;
  trigger?: 'inView' | 'mount';
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // ✅ Start EMPTY so real text never flashes
  const [display, setDisplay] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  // Trigger logic
  useEffect(() => {
    if (trigger === 'mount') {
      setHasStarted(true);
    } else if (trigger === 'inView' && isInView) {
      setHasStarted(true);
    }
  }, [isInView, trigger]);

  useEffect(() => {
    if (!hasStarted) return;

    let frame = 0;
    const totalFrames = Math.floor(duration * 60);
    const length = text.length;

    const randomChar = () =>
      chars[Math.floor(Math.random() * chars.length)];

    // ✅ Immediately start fully scrambled
    setDisplay(
      text
        .split('')
        .map((char) => (char === ' ' ? ' ' : randomChar()))
        .join('')
    );

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * length);

      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealCount) return text[i];
          return randomChar();
        })
        .join('');

      setDisplay(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(text); // final clean state
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [hasStarted, text, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}