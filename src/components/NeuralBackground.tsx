import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
  isActive?: boolean;
  isSurge?: boolean;
}

const NeuralBackground: React.FC<NeuralBackgroundProps> = React.memo(({ isActive, isSurge }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: disable alpha if possible, but here we need it for overlay
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * (isSurge ? 2 : 0.5);
        this.speedY = (Math.random() - 0.5) * (isSurge ? 2 : 0.5);
        this.color = isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      // Limit particles for performance
      const numberOfParticles = Math.min(150, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = isActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      
      const connectionDistance = 150;
      const particleCount = particles.length;

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          
          // Quick distance check before sqrt
          if (Math.abs(dx) < connectionDistance && Math.abs(dy) < connectionDistance) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        p1.update();
        p1.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSurge]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 bg-[#020617]"
    />
  );
});

export default NeuralBackground;
