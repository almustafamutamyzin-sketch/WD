import React, { useEffect, useRef } from 'react';
import { anthemEngine } from '../services/audioSynth';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dataArray = new Uint8Array(32);

    const render = () => {
      animId = requestAnimationFrame(render);
      anthemEngine.getVisualizerData(dataArray);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 24;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      for (let i = 0; i < barCount; i++) {
        // Simulated idle wave if paused, real data if playing
        let value = dataArray[i] || 0;
        if (!isPlaying) {
          value = Math.sin(Date.now() * 0.003 + i * 0.3) * 6 + 10;
        }

        const percent = Math.min(1, Math.max(0.1, value / 220));
        const barHeight = percent * height;
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Gradient from burgundy (#9f1239) to gold (#fbbf24) to emerald
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, 'rgba(159, 18, 57, 0.9)'); // Burgundy
        grad.addColorStop(0.6, 'rgba(244, 63, 94, 0.9)'); // Rose
        grad.addColorStop(1, 'rgba(251, 191, 36, 1)'); // Gold

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={180}
        height={36}
        className="h-9 w-44 rounded-lg bg-black/20 backdrop-blur-xs px-2"
      />
    </div>
  );
};
