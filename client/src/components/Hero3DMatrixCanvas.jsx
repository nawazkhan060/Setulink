import React, { useEffect, useRef, useState } from 'react';

export const Hero3DMatrixCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Mouse move 3D tilt effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: +(y / 35).toFixed(2),
      y: +(-x / 35).toFixed(2)
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initColumns();
    };

    window.addEventListener('resize', handleResize);

    // Matrix tokens: Binary, Hex, Indian GovTech terms, and Devanagari numerals
    const matrixTokens = [
      '0', '1', '1', '0',
      'JSON', 'XML', 'CSV', 'DPDP', 'mTLS', 'SHA',
      'SETU', 'LINK', '14ms', 'AUTH', 'API', 'REST',
      '०', '१', '२', '३', '४', '५', '६', '७', '८', '९',
      'स', 'त', 'ु', 'ल', 'ि', 'ं', 'क'
    ];

    const fontSize = 13;
    let columns = Math.floor(width / (fontSize * 1.6));
    let drops = [];
    let speeds = [];
    let opacities = [];

    const initColumns = () => {
      columns = Math.floor(width / (fontSize * 1.6));
      drops = [];
      speeds = [];
      opacities = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -50);
        speeds[i] = 0.6 + Math.random() * 0.9;
        opacities[i] = 0.35 + Math.random() * 0.45;
      }
    };

    initColumns();

    let lastDraw = 0;
    const draw = (time) => {
      animationFrameId = requestAnimationFrame(draw);
      // Throttle to ~35 fps for smooth lightweight rendering
      if (time - lastDraw < 28) return;
      lastDraw = time;

      // Soft white wash for elegant light trail
      ctx.fillStyle = 'rgba(248, 250, 252, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `600 ${fontSize}px "JetBrains Mono", Menlo, Consolas, monospace`;

      for (let i = 0; i < columns; i++) {
        const text = matrixTokens[Math.floor(Math.random() * matrixTokens.length)];
        const x = i * fontSize * 1.6;
        const y = drops[i] * fontSize;

        // Head character glowing teal / cyan
        ctx.fillStyle = '#0284c7';
        ctx.shadowColor = 'rgba(2, 132, 199, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fillText(text, x, y);

        // Body character with tailored cyan/indigo opacity in white theme
        ctx.fillStyle = `rgba(14, 116, 144, ${opacities[i]})`;
        ctx.shadowBlur = 0;
        ctx.fillText(text, x, y - fontSize);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.6 + Math.random() * 0.9;
        }

        drops[i] += speeds[i];
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white/70 backdrop-blur-md transition-all duration-300"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Tilted Matrix Plane */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
        />

        {/* Ambient Top & Bottom Light Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/95 pointer-events-none" />

        {/* Central 3D Floating Hologram Node */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-gov-300/80 shadow-lg text-gov-700 text-xs font-mono font-bold backdrop-blur-md mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>3D LIVE MATRIX STREAM: SETULINK ZERO-COPY</span>
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Deterministic Data Harmonization Matrix
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mt-1 font-sans">
            Continuous cryptographic ingress streaming through <strong>Health JSON</strong>, <strong>Transport XML</strong>, and <strong>Municipal CSV</strong> silos.
          </p>

          {/* Floating Micro-Telemetry Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-xl bg-white/95 border border-slate-200 text-gov-700 shadow-sm font-semibold">
              Packet Rate: 1,840 tx/s
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/95 border border-slate-200 text-emerald-700 shadow-sm font-semibold">
              Resolution: 14.2ms
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/95 border border-slate-200 text-indigo-700 shadow-sm font-semibold">
              Levenshtein: &ge; 0.90
            </span>
          </div>
        </div>

        {/* Interactive Tilt Hint */}
        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200 pointer-events-none">
          3D Parallax Tilt Active
        </div>
      </div>
    </div>
  );
};
