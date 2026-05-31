import React, { useRef, useEffect } from "react";

export default function NetworkCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    // Fixed array of network nodes
    const maxNodes = 40;
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    // Initialize nodes
    const initializePos = (w: number, h: number) => {
      nodes.length = 0;
      for (let i = 0; i < maxNodes; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1,
        });
      }
    };

    // Keep resize observer on parent container as instructed
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        width = entryWidth || window.innerWidth;
        height = entryHeight || window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;

        // Reset positions
        initializePos(width, height);
      }
    });

    resizeObserver.observe(container);

    // Frame loops drawing connecting routing cables
    const draw = () => {
      if (!ctx || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.06)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if sufficiently close
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Move & Draw individual nodes
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Advance vector position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce borders bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-parent-container"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
