import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animation = 0;
    const pointer = { x: 0.5, y: 0.5 };
    const particles: Particle[] = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(105, Math.max(42, Math.floor((width * height) / 15000)));
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, size: Math.random() * 1.7 + 0.45, alpha: Math.random() * 0.55 + 0.2 });
      }
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / Math.max(window.innerWidth, 1);
      pointer.y = event.clientY / Math.max(window.innerHeight, 1);
    };
    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(width * pointer.x, height * pointer.y, 0, width * pointer.x, height * pointer.y, Math.max(width, height) * 0.45);
      glow.addColorStop(0, "rgba(0, 217, 255, 0.07)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx + (pointer.x - 0.5) * 0.035;
        particle.y += particle.vy + (pointer.y - 0.5) * 0.035;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;
        const pulse = 0.72 + Math.sin(frame * 0.018 + index) * 0.28;
        context.beginPath();
        context.fillStyle = `rgba(0, 217, 255, ${particle.alpha * pulse})`;
        context.shadowBlur = 8;
        context.shadowColor = "rgba(0, 217, 255, 0.8)";
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      });
      animation = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="particle-field absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}
