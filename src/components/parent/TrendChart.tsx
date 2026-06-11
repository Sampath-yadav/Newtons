"use client";

interface Point {
  name: string;
  percentage: number;
}

// Lightweight responsive line chart — no chart library (React 19 safe).
// Plots exam percentages (0–100) across time with an area fill and dots.
export function TrendChart({ data }: { data: Point[] }) {
  const W = 640;
  const H = 240;
  const padX = 36;
  const padTop = 20;
  const padBottom = 36;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;

  const yFor = (pct: number) => padTop + plotH - (Math.max(0, Math.min(100, pct)) / 100) * plotH;
  const xFor = (i: number) =>
    data.length === 1 ? padX + plotW / 2 : padX + (i / (data.length - 1)) * plotW;

  const pts = data.map((d, i) => ({ x: xFor(i), y: yFor(d.percentage), ...d }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    pts.length > 0
      ? `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`
      : "";

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Performance trend across exams">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060C8B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#060C8B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid + labels */}
      {gridLines.map((g) => (
        <g key={g}>
          <line x1={padX} y1={yFor(g)} x2={W - padX} y2={yFor(g)} stroke="#eef1f6" strokeWidth="1" />
          <text x={padX - 8} y={yFor(g) + 3} textAnchor="end" className="fill-slate-400" fontSize="10">
            {g}
          </text>
        </g>
      ))}

      {/* Area + line */}
      {areaPath && <path d={areaPath} fill="url(#trendFill)" />}
      {pts.length > 1 && <path d={linePath} fill="none" stroke="#060C8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

      {/* Dots + value labels + x labels */}
      {pts.map((p) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#F39200" strokeWidth="2.5" />
          <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-[#1F2A66]" fontSize="11" fontWeight="700">
            {p.percentage}%
          </text>
          <text x={p.x} y={H - 12} textAnchor="middle" className="fill-slate-500" fontSize="11">
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
