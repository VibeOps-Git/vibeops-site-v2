// src/components/SpaceField.tsx
// Living space background - sparse particles with ambient drift and cursor interaction

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  phase: number;
}

export default function SpaceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      // Sparse but enough to feel alive - about 1 particle per 20000 pixels
      const count = Math.floor((canvas.width * canvas.height) / 18000);

      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.8 + 0.5,
          opacity: Math.random() * 0.35 + 0.1,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.06,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const interactionRadius = 150;

      for (const p of particlesRef.current) {
        // Ambient drift
        p.baseX += p.speedX;
        p.baseY += p.speedY;

        // Wrap around edges
        if (p.baseX < -20) p.baseX = canvas.width + 20;
        if (p.baseX > canvas.width + 20) p.baseX = -20;
        if (p.baseY < -20) p.baseY = canvas.height + 20;
        if (p.baseY > canvas.height + 20) p.baseY = -20;

        // Gentle breathing/floating motion
        const breathX = Math.sin(time + p.phase) * 8;
        const breathY = Math.cos(time * 0.7 + p.phase) * 6;

        // Target position with breathing
        let targetX = p.baseX + breathX;
        let targetY = p.baseY + breathY;

        // Cursor interaction - particles gently move away
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius && dist > 0) {
          const force = (1 - dist / interactionRadius) * 30;
          const angle = Math.atan2(dy, dx);
          targetX += Math.cos(angle) * force;
          targetY += Math.sin(angle) * force;
        }

        // Smooth interpolation to target
        p.x += (targetX - p.x) * 0.08;
        p.y += (targetY - p.y) * 0.08;

        // Calculate opacity based on cursor proximity (brighten near cursor)
        let drawOpacity = p.opacity;
        if (dist < interactionRadius * 1.5) {
          const brightnessFactor = 1 + (1 - dist / (interactionRadius * 1.5)) * 0.8;
          drawOpacity = Math.min(p.opacity * brightnessFactor, 0.7);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 204, ${drawOpacity})`;
        ctx.fill();

        // Add subtle glow for larger/brighter particles
        if (p.size > 1.2 && drawOpacity > 0.25) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 204, ${drawOpacity * 0.15})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
