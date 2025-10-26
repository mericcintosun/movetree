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

      // Clear canvas
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
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      // Main blob following mouse (Mint)
      createGradientBlob(
        mousePos.current.x,
        mousePos.current.y,
        400,
        'rgba(55, 197, 179, 0.4)', // mint-800
        'rgba(151, 240, 229, 0.2)', // mint-700
        0.6
      );

      // Secondary blob (Grape) - offset from mouse
      createGradientBlob(
        mousePos.current.x + 150,
        mousePos.current.y - 100,
        350,
        'rgba(197, 132, 246, 0.4)', // grape-700
        'rgba(165, 143, 241, 0.2)', // grape-800
        0.5
      );

      // Tertiary blob (Mint-Grape mix) - opposite side
      createGradientBlob(
        mousePos.current.x - 200,
        mousePos.current.y + 150,
        300,
        'rgba(151, 240, 229, 0.3)',
        'rgba(216, 173, 250, 0.2)', // grape-600
        0.4
      );

      // Static ambient blobs for depth
      const time = Date.now() * 0.0005;
      
      // Top left ambient
      createGradientBlob(
        canvas.width * 0.2 + Math.sin(time) * 50,
        canvas.height * 0.15 + Math.cos(time * 0.8) * 50,
        300,
        'rgba(55, 197, 179, 0.2)',
        'rgba(151, 240, 229, 0.1)',
        0.3
      );

      // Bottom right ambient
      createGradientBlob(
        canvas.width * 0.8 + Math.sin(time * 1.2) * 50,
        canvas.height * 0.85 + Math.cos(time) * 50,
        350,
        'rgba(197, 132, 246, 0.2)',
        'rgba(165, 143, 241, 0.1)',
        0.3
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
        opacity: 0.8,
        mixBlendMode: 'screen',
      }}
    />
  );
};
