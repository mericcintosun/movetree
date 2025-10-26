import React, { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize position at center
    mousePos.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    targetPos.current = { ...mousePos.current };

    // Animation loop
    const animate = () => {
      // Smooth lerp animation
      mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.05;
      mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.05;

      // Clear canvas completely each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient blobs
      const createGradientBlob = (
        x: number,
        y: number,
        radius: number,
        color1: string,
        color2: string,
        opacity: number
      ) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.5, color2);
        gradient.addColorStop(1, 'transparent');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      };

      // Main blob following mouse (Mint) - smaller and focused
      createGradientBlob(
        mousePos.current.x,
        mousePos.current.y,
        280,
        'rgba(55, 197, 179, 0.5)', // mint-800
        'rgba(151, 240, 229, 0.25)', // mint-700
        0.65
      );

      // Secondary blob (Turquoise) - offset from mouse
      createGradientBlob(
        mousePos.current.x + 120,
        mousePos.current.y - 80,
        250,
        'rgba(8, 146, 128, 0.45)', // mint-900
        'rgba(93, 211, 198, 0.25)', // lighter mint
        0.6
      );

      // Tertiary blob (Deep Teal) - opposite side
      createGradientBlob(
        mousePos.current.x - 140,
        mousePos.current.y + 100,
        220,
        'rgba(6, 115, 102, 0.4)', // darker teal
        'rgba(93, 211, 198, 0.2)', // lighter mint
        0.55
      );

      // Static ambient blobs for depth
      const time = Date.now() * 0.0005;
      
      // Top left ambient - Mint glow
      createGradientBlob(
        canvas.width * 0.15 + Math.sin(time) * 80,
        canvas.height * 0.2 + Math.cos(time * 0.8) * 80,
        380,
        'rgba(8, 146, 128, 0.3)', // mint-900
        'rgba(55, 197, 179, 0.15)', // mint-800
        0.5
      );

      // Bottom right ambient - Cyan glow
      createGradientBlob(
        canvas.width * 0.85 + Math.sin(time * 1.2) * 80,
        canvas.height * 0.8 + Math.cos(time) * 80,
        420,
        'rgba(22, 160, 145, 0.35)', // cyan-teal
        'rgba(93, 211, 198, 0.2)', // lighter mint
        0.55
      );

      // Center subtle glow - Mint mix
      createGradientBlob(
        canvas.width * 0.5 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.5 + Math.cos(time * 0.7) * 100,
        320,
        'rgba(55, 197, 179, 0.25)', // mint-800
        'rgba(151, 240, 229, 0.15)', // mint-700
        0.45
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
        mixBlendMode: 'normal',
      }}
    />
  );
};
