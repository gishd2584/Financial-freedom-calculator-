import { useState, useMemo, useEffect, useRef } from "react";

const formatCurrency = (n) => {
  if (n >= 1e8) return `¥${(n / 1e8).toFixed(2)}亿`;
  if (n >= 1e4) return `¥${(n / 1e4).toFixed(2)}万`;
  return `¥${n.toFixed(2)}`;
};

const Slider = ({ label, value, onChange, min, max, step = 1, unit = "", format }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: "#8a8f98", letterSpacing: 0.5, fontFamily: "'Noto Sans SC', sans-serif" }}>{label}</span>
        <span style={{
          fontSize: 20, fontWeight: 700, color: "#e8c872",
          fontFamily: "'Playfair Display', serif", letterSpacing: 1
        }}>
          {format ? format(value) : value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 6, appearance: "none", background: `linear-gradient(to right, #e8c872 0%, #e8c872 ${pct}%, #2a2d35 ${pct}%, #2a2d35 100%)`,
          borderRadius: 3, outline: "none", cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: "#555" }}>
        <span>{format ? format(min) : min}{unit}</span>
        <span>{format ? format(max) : max}{unit}</span>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e2028 0%, #16181e 100%)",
      border: "1px solid #2a2d35", borderRadius: 16, padding: "22px 20px",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.5s cubic-bezier(.22,1,.36,1)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: "radial-gradient(circle, rgba(232,200,114,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#6b7080", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#f0f0f0", fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#e8c872", marginTop: 6, fontFamily: "'Noto Sans SC', sans-serif" }}>{sub}</div>}
    </div>
  );
};

const MilestoneBar = ({ milestones }) => (
  <div style={{ margin: "0 0 10px", padding: "18px 0" }}>
    <div style={{ position: "relative", height: 6, background: "#2a2d35", borderRadius: 3 }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 3, width: "100%",
        background: "linear-gradient(90deg, #e8c872 0%, #d4a84b 50%, #c49030 100%)",
      }} />
      {milestones.map((m, i) => (
        <div key={i} style={{ position: "absolute", left: `${m.pct}%`, top: -6, transform: "translateX(-50%)" }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%", background: "#1a1c22",
            border: "2px solid #e8c872", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, color: "#e8c872",
          }}>✦</div>
          <div style={{ fontSize: 10, color: "#8a8f98", textAlign: "center", marginTop: 4, whiteSpace: "nowrap", fontFamily: "'Noto Sans SC', sans-serif" }}>{m.label}</div>
          <div style={{ fontSize: 11, color: "#e8c872", textAlign: "center", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const GrowthChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.total));
  const h = 180;
  const w = 100;
  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} style={{ width: "100%", height: 220 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c872" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e8c872" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c49030" />
          <stop offset="100%" stopColor="#e8c872" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
        <g key={i}>
          <line x1="0" y1={h - r * h} x2={w} y2={h - r * h} stroke="#2a2d35" strokeWidth="0.3" />
          <text x="-1" y={h - r * h + 1.5} fontSize="3.5" fill="#555" textAnchor="end">{formatCurrency(maxVal * r)}</text>
        </g>
      ))}
      <path
        d={data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - (d.total / maxVal) * h;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(" ") + `L${w},${h}L0,${h}Z`}
        fill="url(#areaGrad)"
      />
      <path
        d={data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - (d.total / maxVal) * h;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(" ")}
        fill="none" stroke="url(#lineGrad)" strokeWidth="0.8"
      />
      {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0 || i === data.length - 1).map((d, idx) => {
        const i = data.indexOf(d);
        const x = (i / (data.length - 1)) * w;
        return (
          <text key={idx} x={x} y={h + 10} fontSize="3" fill="#6b7080" textAnchor="middle">
            {d.year}岁
          </text>
        );
      })}
    </svg>
  );
};

export default function FinancialFreedomCalc() {
  const [targetWealth, setTargetWealth] = useState(1000);
  const [currentAge, setCurrentAge] = useState(28);
  const [retireAge, setRetireAge] = useState(45);
  const [currentSavings, setCurrentSavings] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(7);

  const results = useMemo(() => {
    const target = targetWealth * 10000;
    const savings = currentSavings * 10000;
    const years = retireAge - currentAge;
    if (years <= 0) return null;

    const r = annualReturn / 100;

    // FV of current savings
    const fvSavings = savings * Math.pow(1 + r, years);

    // How much more is needed via annual contributions
    const gap = Math.max(0, target - fvSavings);

    // Annual contribution needed (future value of annuity)
    let annualNeeded = 0;
    if (r > 0) {
      const fvAnnuity = (Math.pow(1 + r, years) - 1) / r;
      annualNeeded = gap / fvAnnuity;
    } else {
      annualNeeded = gap / years;
    }

    const monthlyNeeded = annualNeeded / 12;
    const dailyNeeded = annualNeeded / 365;
    const hourlyNeeded = dailyNeeded / 8; // 8 working hours

    // Growth chart data
    const chartData = [];
    let accumulated = savings;
    for (let y = 0; y <= years; y++) {
      chartData.push({ year: currentAge + y, total: accumulated });
      accumulated = accumulated * (1 + r) + annualNeeded;
    }

    // Milestones
    const milestones = [];
    const checkpoints = [0.25, 0.5, 0.75, 1.0];
    for (const cp of checkpoints) {
      const cpTarget = target * cp;
      const found = chartData.find(d => d.total >= cpTarget);
      if (found) {
        milestones.push({
          pct: cp * 100,
          label: `${(cp * 100).toFixed(0)}%`,
          value: `${found.year}岁`,
        });
      }
    }

    // Compound interest breakdown at retirement
    const totalContributed = savings + annualNeeded * years;
    const interestEarned = target - totalContributed;

    // Passive income: 4% rule
    const passiveMonthly = (target * 0.04) / 12;

    return {
      annualNeeded, monthlyNeeded, dailyNeeded, hourlyNeeded,
      years, target, fvSavings, totalContributed, interestEarned,
      chartData, milestones, passiveMonthly, gap,
    };
  }, [targetWealth, currentAge, retireAge, currentSavings, annualReturn]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f1014 0%, #14161c 40%, #1a1c24 100%)",
      color: "#f0f0f0",
      fontFamily: "'Noto Sans SC', 'Playfair Display', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #f0d98c, #c49030); cursor: pointer;
          box-shadow: 0 0 10px rgba(232,200,114,0.4); border: 2px solid #1a1c22;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #f0d98c, #c49030); cursor: pointer;
          box-shadow: 0 0 10px rgba(232,200,114,0.4); border: 2px solid #1a1c22;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #14161c; }
        ::-webkit-scrollbar-thumb { background: #2a2d35; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center", padding: "48px 20px 20px",
        animation: "fadeUp 0.8s ease-out",
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#e8c872", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>
          ✦ Financial Freedom Planner ✦
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: 0, lineHeight: 1.2,
          fontFamily: "'Playfair Display', serif",
          background: "linear-gradient(135deg, #f5e6b8, #e8c872, #c49030)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          自由计算器
        </h1>
        <p style={{ fontSize: 14, color: "#6b7080", marginTop: 8, fontWeight: 300 }}>
          规划你的财富自由之路 · 让每一小时都有意义
        </p>
      </div>

      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "0 20px 60px",
        animation: "fadeUp 1s ease-out 0.2s both",
      }}>
        {/* Input Panel */}
        <div style={{
          background: "linear-gradient(135deg, #1a1c24 0%, #16181e 100%)",
          border: "1px solid #2a2d35", borderRadius: 20, padding: "32px 28px", marginBottom: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <span style={{ fontSize: 18 }}>⚙</span>
            <span style={{ fontSize: 13, color: "#8a8f98", letterSpacing: 2, textTransform: "uppercase" }}>参数设定</span>
          </div>

          <Slider label="🎯 财富自由目标" value={targetWealth} onChange={setTargetWealth}
            min={100} max={5000} step={50} unit="" format={v => `${v}万`} />
          <Slider label="👤 当前年龄" value={currentAge} onChange={setCurrentAge}
            min={18} max={60} unit="岁" />
          <Slider label="🏖 目标退休年龄" value={retireAge} onChange={setRetireAge}
            min={Math.max(currentAge + 1, 25)} max={70} unit="岁" />
          <Slider label="💰 当前存款" value={currentSavings} onChange={setCurrentSavings}
            min={0} max={2000} step={10} unit="" format={v => `${v}万`} />
          <Slider label="📈 预期年化收益率" value={annualReturn} onChange={setAnnualReturn}
            min={1} max={15} step={0.5} unit="%" />
        </div>

        {results && (
          <>
            {/* Key Metrics */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12, marginBottom: 24,
            }}>
              <StatCard icon="📅" label="每年需存" value={formatCurrency(results.annualNeeded)} sub={`共需${results.years}年`} delay={100} />
              <StatCard icon="📆" label="每月需存" value={formatCurrency(results.monthlyNeeded)} sub="工资中定投" delay={200} />
              <StatCard icon="☀️" label="每天需赚" value={formatCurrency(results.dailyNeeded)} sub="含周末节假日" delay={300} />
              <StatCard icon="⏰" label="每小时需赚" value={formatCurrency(results.hourlyNeeded)} sub="按8小时工作" delay={400} />
            </div>

            {/* Chart */}
            <div style={{
              background: "linear-gradient(135deg, #1a1c24 0%, #16181e 100%)",
              border: "1px solid #2a2d35", borderRadius: 20, padding: "28px 24px", marginBottom: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 18 }}>📊</span>
                <span style={{ fontSize: 13, color: "#8a8f98", letterSpacing: 2, textTransform: "uppercase" }}>财富增长曲线</span>
              </div>
              <GrowthChart data={results.chartData} />
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 12, color: "#6b7080", marginBottom: 12, letterSpacing: 1 }}>里程碑节点</div>
                <MilestoneBar milestones={results.milestones} />
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div style={{
              background: "linear-gradient(135deg, #1a1c24 0%, #16181e 100%)",
              border: "1px solid #2a2d35", borderRadius: 20, padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                <span style={{ fontSize: 18 }}>💎</span>
                <span style={{ fontSize: 13, color: "#8a8f98", letterSpacing: 2, textTransform: "uppercase" }}>详细分析</span>
              </div>

              {[
                { label: "目标财富", val: formatCurrency(results.target), accent: true },
                { label: "现有存款终值（复利）", val: formatCurrency(results.fvSavings) },
                { label: "还需额外积累", val: formatCurrency(results.gap) },
                { label: "总计投入本金", val: formatCurrency(results.totalContributed) },
                { label: "复利收益", val: formatCurrency(results.interestEarned), accent: true },
                { label: `复利占比`, val: `${((results.interestEarned / results.target) * 100).toFixed(1)}%` },
                { label: "退休后被动月收入（4%法则）", val: formatCurrency(results.passiveMonthly), accent: true },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < 6 ? "1px solid #222430" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#8a8f98", fontFamily: "'Noto Sans SC', sans-serif" }}>{item.label}</span>
                  <span style={{
                    fontSize: 16, fontWeight: 700, fontFamily: "'Playfair Display', serif",
                    color: item.accent ? "#e8c872" : "#d0d0d0",
                  }}>{item.val}</span>
                </div>
              ))}

              {/* Insight box */}
              <div style={{
                marginTop: 24, padding: "18px 20px", borderRadius: 12,
                background: "linear-gradient(135deg, rgba(232,200,114,0.08) 0%, rgba(196,144,48,0.04) 100%)",
                border: "1px solid rgba(232,200,114,0.15)",
              }}>
                <div style={{ fontSize: 12, color: "#e8c872", fontWeight: 600, marginBottom: 8 }}>💡 复利洞察</div>
                <div style={{ fontSize: 13, color: "#9a9faa", lineHeight: 1.7, fontFamily: "'Noto Sans SC', sans-serif" }}>
                  {results.interestEarned > results.totalContributed
                    ? `恭喜！在${annualReturn}%的年化收益下，复利收益将超过你的本金投入。时间是你最好的朋友——越早开始，复利效应越强大。`
                    : results.interestEarned > 0
                      ? `在${annualReturn}%的年化收益下，复利将为你额外创造 ${formatCurrency(results.interestEarned)} 的财富。考虑提高投资收益率或延长投资期限来增强复利效应。`
                      : `当前参数下复利效应有限，建议拉长投资周期或提升年化收益率。`
                  }
                  {` 退休后按4%法则提取，每月可获得 ${formatCurrency(results.passiveMonthly)} 被动收入。`}
                </div>
              </div>
            </div>

            {/* Footer disclaimer */}
            <div style={{
              textAlign: "center", marginTop: 32, fontSize: 11, color: "#444",
              lineHeight: 1.6, fontFamily: "'Noto Sans SC', sans-serif",
            }}>
              <span style={{ color: "#e8c87244" }}>✦</span> 本计算器仅供参考，实际投资收益受市场波动影响 <span style={{ color: "#e8c87244" }}>✦</span>
              <br />年化收益率建议：货币基金 2-3% · 债券基金 4-6% · 指数基金 7-10% · 股票组合 10-15%
            </div>
          </>
        )}
      </div>
    </div>
  );
}
