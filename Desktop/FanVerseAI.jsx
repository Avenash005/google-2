import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// ═══════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060912; }
  button, input { font-family: 'Rajdhani', sans-serif; }

  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseGlow  { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes fireShake  { 0%{transform:scale(1) rotate(-4deg)} 50%{transform:scale(1.15) rotate(4deg)} 100%{transform:scale(1) rotate(-4deg)} }
  @keyframes slideUp    { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes slideLeft  { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes orbit      { from{transform:rotate(0deg) translateX(80px) rotate(0deg)} to{transform:rotate(360deg) translateX(80px) rotate(-360deg)} }
  @keyframes hexPulse   { 0%,100%{opacity:0.04} 50%{opacity:0.09} }
  @keyframes neonFlash  { 0%,100%{text-shadow:0 0 10px #00d4ff,0 0 20px #00d4ff,0 0 40px #00d4ff} 50%{text-shadow:0 0 5px #00d4ff} }
  @keyframes progressFill { from{width:0} to{width:var(--target)} }
  @keyframes rankUp     { 0%{color:#10b981;transform:translateY(-4px)} 100%{color:inherit;transform:none} }
  @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ripple     { to{transform:scale(2);opacity:0} }
  @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes countUp    { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }

  .page-enter { animation: slideUp 0.35s ease forwards; }
  .fire-icon  { animation: fireShake 0.9s ease-in-out infinite; display:inline-block; }
  .float-anim { animation: float 5s ease-in-out infinite; }
  .pulse-dot  { animation: pulseGlow 1.4s ease-in-out infinite; }

  .glass {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    backdrop-filter: blur(12px);
  }
  .glass-bright {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    backdrop-filter: blur(12px);
  }
  .neon-border-cyan  { border-color: rgba(0,212,255,0.35) !important; box-shadow: 0 0 16px rgba(0,212,255,0.15); }
  .neon-border-purple { border-color: rgba(139,92,246,0.35) !important; box-shadow: 0 0 16px rgba(139,92,246,0.15); }
  .neon-border-gold  { border-color: rgba(251,191,36,0.35) !important; box-shadow: 0 0 16px rgba(251,191,36,0.15); }
  .neon-border-red   { border-color: rgba(239,68,68,0.35) !important; box-shadow: 0 0 16px rgba(239,68,68,0.15); }

  .nav-link { transition: all 0.18s ease; cursor: pointer; border-left: 2px solid transparent; }
  .nav-link:hover  { background: rgba(0,212,255,0.07); border-left-color: rgba(0,212,255,0.4); color: rgba(255,255,255,0.85); }
  .nav-link.active { background: rgba(0,212,255,0.1);  border-left-color: #00d4ff; color: #00d4ff; }

  .card-hover { transition: transform 0.2s ease, border-color 0.2s ease; }
  .card-hover:hover { transform: translateY(-2px); border-color: rgba(0,212,255,0.25) !important; }

  .predict-btn { transition: all 0.2s ease; cursor: pointer; }
  .predict-btn:hover { transform: translateY(-2px); }
  .predict-btn:active { transform: scale(0.98); }

  .lb-row { transition: all 0.15s ease; cursor: pointer; }
  .lb-row:hover { background: rgba(0,212,255,0.05); padding-left: 26px; }

  .shimmer-text {
    background: linear-gradient(90deg, #00d4ff 0%, #8b5cf6 30%, #ec4899 60%, #00d4ff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .gradient-cyan { background: linear-gradient(135deg, #00d4ff, #0080ff); }
  .gradient-purple { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
  .gradient-gold { background: linear-gradient(135deg, #fbbf24, #f97316); }

  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
  ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.25); border-radius: 2px; }

  .battle-meter { transition: width 1.2s cubic-bezier(0.34,1.56,0.64,1); }
  .xp-fill { animation: progressFill 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  .orb { font-family: 'Orbitron', sans-serif; }
  .raj { font-family: 'Rajdhani', sans-serif; }

  .live-dot::before { content:''; display:inline-block; width:7px; height:7px; border-radius:50%; background:#ef4444; margin-right:5px; animation:pulseGlow 1s ease-in-out infinite; }

  .tooltip-recharts { background: #0d1428 !important; border: 1px solid rgba(0,212,255,0.2) !important; border-radius: 8px !important; }
`;

// ═══════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════
const USER = {
  name: "AvePlayz", level: 42, xp: 7240, xpMax: 10000,
  streak: 14, rank: 7, clan: "CSK Ultras", persona: "The Oracle",
  totalPredictions: 234, accuracy: 74, questsDone: 89, clanWars: 12,
  badges: [
    { id:1, name:"Prediction Master", icon:"🎯", rarity:"legendary", earned:true },
    { id:2, name:"Fire Streak",       icon:"🔥", rarity:"epic",      earned:true },
    { id:3, name:"Clan Champion",     icon:"⚔️", rarity:"epic",      earned:true },
    { id:4, name:"Night Owl",         icon:"🦉", rarity:"rare",      earned:true },
    { id:5, name:"Cricket God",       icon:"🏏", rarity:"legendary", earned:false },
    { id:6, name:"100 Wins",          icon:"💯", rarity:"epic",      earned:false },
    { id:7, name:"Trivia King",       icon:"🧠", rarity:"rare",      earned:true },
    { id:8, name:"Flash Hero",        icon:"⚡", rarity:"rare",      earned:false },
  ]
};

const MATCHES = [
  {
    id:1, tournament:"IPL 2025", round:"Match 34", status:"LIVE",
    team1:{ name:"CSK", emoji:"🦁", color:"#fbbf24", score:"187/4", overs:"18.2" },
    team2:{ name:"MI",  emoji:"🔵", color:"#3b82f6", score:"142/6", overs:"15.0" },
    momentum:72, odds:[1.4, 2.8],
    commentary:["Dhoni hits a massive six over mid-wicket! 🏏💥","MI need 46 off 28 balls — pressure mounting","CSK's powerplay bowlers coming back into attack"]
  },
  {
    id:2, tournament:"IPL 2025", round:"Match 33", status:"KKR WIN",
    team1:{ name:"RCB", emoji:"🔴", color:"#ef4444", score:"156/8", overs:"20.0" },
    team2:{ name:"KKR", emoji:"💜", color:"#8b5cf6", score:"159/4", overs:"18.4" },
    momentum:85, odds:null,
    commentary:["KKR win by 6 wickets with 8 balls to spare","Russell's 42 off 18 was the turning point","RCB's bowling attack couldn't defend the total"]
  }
];

const LEADERBOARD = [
  { rank:1, name:"CricketKing99", level:67, xp:94230, clan:"MI Paltan",   streak:22, acc:81, change:"up" },
  { rank:2, name:"PredictorX",   level:61, xp:87420, clan:"CSK Ultras",  streak:19, acc:79, change:"same" },
  { rank:3, name:"FanMania",     level:58, xp:82100, clan:"RCB Royals",  streak:15, acc:77, change:"up" },
  { rank:4, name:"IPLGuru",      level:55, xp:78300, clan:"KKR Kings",   streak:11, acc:76, change:"down" },
  { rank:5, name:"StrikerX",     level:53, xp:71200, clan:"MI Paltan",   streak:9,  acc:74, change:"up" },
  { rank:6, name:"CricFan247",   level:50, xp:68900, clan:"CSK Ultras",  streak:8,  acc:73, change:"same" },
  { rank:7, name:"AvePlayz",     level:42, xp:52400, clan:"CSK Ultras",  streak:14, acc:74, change:"up", isUser:true },
  { rank:8, name:"ThunderBolt",  level:40, xp:48700, clan:"RCB Royals",  streak:7,  acc:71, change:"down" },
  { rank:9, name:"ClanGod",      level:38, xp:45200, clan:"KKR Kings",   streak:5,  acc:69, change:"up" },
  { rank:10,name:"FlashFan",     level:35, xp:41800, clan:"MI Paltan",   streak:4,  acc:68, change:"same" },
];

const QUESTS = [
  { id:1, icon:"🏏", title:"Predict Match Winner", desc:"Correctly predict today's CSK vs MI winner", xp:250, progress:0, total:1, rarity:"rare",   type:"Prediction" },
  { id:2, icon:"🧠", title:"Trivia Sprint",        desc:"Answer 5 cricket trivia without a wrong answer", xp:150, progress:3, total:5, rarity:"common", type:"Trivia" },
  { id:3, icon:"⚔️", title:"Clan War Hero",        desc:"Help CSK Ultras win today's clan battle vs RCB", xp:500, progress:0, total:1, rarity:"epic",   type:"Clan" },
  { id:4, icon:"⚡", title:"Flash Champion",       desc:"Win the powerplay flash challenge", xp:350, progress:1, total:1, rarity:"rare", type:"Flash", done:true },
];

const AI_QUESTS = [
  { id:"a1", icon:"🔮", title:"The Oracle Challenge", difficulty:"Hard", timeLeft:"2h 15m",
    desc:"Based on your 87% powerplay prediction accuracy, AI has crafted a special challenge: predict the exact run total in the first 6 overs of CSK's next match.",
    reward:"750 XP + Rare Badge", tag:"Based on your powerplay stats" },
  { id:"a2", icon:"🔥", title:"Streak Defender",     difficulty:"Medium", timeLeft:"18h 30m",
    desc:"You're on a 14-day streak! Complete 3 predictions today to protect your legendary status and earn the exclusive Eternal Flame badge.",
    reward:"500 XP + Streak Shield", tag:"Your 14-day streak is at risk" },
  { id:"a3", icon:"👑", title:"Clan War Champion",   difficulty:"Epic", timeLeft:"8h 24m",
    desc:"CSK Ultras are 630 points ahead but RCB is rallying. AI detects you're needed NOW. Make 5 correct predictions to secure the clan victory.",
    reward:"1000 XP + Clan Honor", tag:"Clan battle ending soon!" },
];

const ACTIVITY = [
  { day:"Mon", xp:320, preds:4 },{ day:"Tue", xp:580, preds:7 },{ day:"Wed", xp:240, preds:3 },
  { day:"Thu", xp:720, preds:9 },{ day:"Fri", xp:450, preds:5 },{ day:"Sat", xp:890, preds:11 },
  { day:"Sun", xp:620, preds:8 },
];

const RADAR_DATA = [
  { skill:"Predictions", A:74 },{ skill:"Streaks", A:85 },{ skill:"Trivia", A:62 },
  { skill:"Clan", A:78 },{ skill:"Flash", A:91 },{ skill:"Social", A:55 },
];

const PASS_TIERS = [
  { tier:1, icon:"🎯", name:"Prediction Badge", done:true },
  { tier:2, icon:"💰", name:"500 Coins", done:true },
  { tier:3, icon:"🔥", name:"Streak Shield", done:true },
  { tier:4, icon:"🤖", name:"AI Quest", done:true },
  { tier:5, icon:"👑", name:"Crown Title", current:true },
  { tier:6, icon:"💎", name:"Diamond Frame", done:false },
  { tier:7, icon:"🌟", name:"Star Emote", done:false },
  { tier:8, icon:"🏆", name:"Trophy FX", done:false },
  { tier:9, icon:"🚀", name:"Rocket FX", done:false },
  { tier:10,icon:"🤖", name:"AI Companion", done:false },
];

// ═══════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════
function Badge({ color="#00d4ff", children, size="sm" }) {
  const pad = size === "sm" ? "2px 9px" : "4px 14px";
  const fs = size === "sm" ? 10 : 12;
  return (
    <span style={{
      background: `${color}18`, border: `1px solid ${color}50`, color,
      padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
      fontFamily: "'Rajdhani', sans-serif"
    }}>{children}</span>
  );
}

function XPBar({ pct = 72, height = 8, glow = true }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:100, height, overflow:"hidden" }}>
      <div style={{
        width:`${pct}%`, height:"100%", borderRadius:100,
        background:"linear-gradient(90deg, #00d4ff, #8b5cf6)",
        boxShadow: glow ? "0 0 12px rgba(0,212,255,0.7)" : "none",
        transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)"
      }} />
    </div>
  );
}

function MiniBar({ pct, color = "#00d4ff" }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:100, height:5, overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:100, transition:"width 0.8s ease" }} />
    </div>
  );
}

function StatTile({ icon, label, value, color = "#00d4ff", sub }) {
  return (
    <div className="glass card-hover" style={{ padding:"18px 16px", textAlign:"center", cursor:"default" }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:26, fontWeight:800, color, fontFamily:"'Orbitron', sans-serif", letterSpacing:"-0.5px" }}>{value}</div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:3, fontFamily:"'Rajdhani', sans-serif" }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:`${color}80`, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub, right }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:18 }}>
      <div>
        <h2 style={{ fontSize:22, fontWeight:800, fontFamily:"'Orbitron', sans-serif", letterSpacing:"-0.5px" }}>{title}</h2>
        {sub && <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:3 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function LivePill() {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px 3px 8px",
      background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:20,
      fontSize:11, fontWeight:700, color:"#ef4444", fontFamily:"'Orbitron', sans-serif" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:"#ef4444", animation:"pulseGlow 1s infinite", display:"inline-block" }} />
      LIVE
    </span>
  );
}

function RarityColor(r) {
  return r === "legendary" ? "#fbbf24" : r === "epic" ? "#8b5cf6" : r === "rare" ? "#00d4ff" : "rgba(255,255,255,0.35)";
}

// ═══════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════
function Sidebar({ page, setPage }) {
  const nav = [
    { id:"dashboard",   label:"Dashboard",    icon:"📊" },
    { id:"arena",       label:"Live Arena",   icon:"🎯" },
    { id:"leaderboard", label:"Leaderboard",  icon:"🏆" },
    { id:"clans",       label:"Clan Battles", icon:"⚔️" },
    { id:"quests",      label:"Quest Center", icon:"🔮" },
    { id:"profile",     label:"My Profile",   icon:"👤" },
  ];
  return (
    <div style={{
      position:"fixed", inset:"0 auto 0 0", width:216, zIndex:200,
      background:"rgba(6,9,18,0.97)", borderRight:"1px solid rgba(0,212,255,0.08)",
      display:"flex", flexDirection:"column", backdropFilter:"blur(20px)"
    }}>
      {/* Logo */}
      <div style={{ padding:"22px 20px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="orb" style={{ fontSize:18, fontWeight:900, letterSpacing:"1px" }}>
          <span style={{ background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            FAN<span style={{ color:"#ec4899" }}>VERSE</span>
          </span>
          <span style={{ display:"block", fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:"3px", marginTop:2, fontWeight:400 }}>AI PLATFORM</span>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
          <div style={{
            width:38, height:38, borderRadius:"50%", flexShrink:0,
            background:"linear-gradient(135deg,#00d4ff,#8b5cf6)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:15, fontWeight:800, boxShadow:"0 0 14px rgba(0,212,255,0.4)"
          }}>A</div>
          <div style={{ minWidth:0 }}>
            <div className="raj" style={{ fontSize:13, fontWeight:700, color:"white", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{USER.name}</div>
            <div style={{ display:"flex", gap:6, marginTop:2 }}>
              <span style={{ fontSize:10, color:"#fbbf24" }}>⚡ Lv.{USER.level}</span>
              <span style={{ fontSize:10, color:"#f97316" }}>🔥 {USER.streak}d</span>
            </div>
          </div>
        </div>
        <XPBar pct={Math.round((USER.xp / USER.xpMax) * 100)} height={5} />
        <div className="raj" style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginTop:4, textAlign:"right" }}>
          {USER.xp.toLocaleString()} / {USER.xpMax.toLocaleString()} XP
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 10px", overflowY:"auto" }}>
        {nav.map(item => (
          <div key={item.id} className={`nav-link${page === item.id ? " active" : ""}`}
            onClick={() => setPage(item.id)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:10, marginBottom:2, fontSize:13, fontWeight: page===item.id ? 700 : 500,
              color: page===item.id ? "#00d4ff" : "rgba(255,255,255,0.5)",
              fontFamily:"'Rajdhani', sans-serif" }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* AI Badge */}
      <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px",
          background:"rgba(139,92,246,0.1)", borderRadius:8, border:"1px solid rgba(139,92,246,0.2)" }}>
          <span style={{ fontSize:12 }}>🤖</span>
          <span className="raj" style={{ fontSize:11, color:"rgba(139,92,246,0.9)", fontWeight:600 }}>AI Engine Active</span>
          <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#10b981", animation:"pulseGlow 1.2s infinite" }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════
function LandingPage({ onEnter }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c < 3 ? c+1 : c), 600);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon:"🎯", title:"Live Predictions",    desc:"AI-powered real-time match predictions with dynamic odds and confidence scores.", color:"#00d4ff" },
    { icon:"🔮", title:"AI Quest Engine",     desc:"Personalized daily challenges generated by AI based on your unique fan behavior.", color:"#8b5cf6" },
    { icon:"⚔️", title:"Clan Battles",        desc:"Lead your clan to glory in epic real-time fan wars with thousands of supporters.", color:"#ef4444" },
    { icon:"🏆", title:"Global Leaderboard",  desc:"Compete with millions of fans worldwide and climb to the top of the rankings.", color:"#fbbf24" },
    { icon:"🔥", title:"Streak System",       desc:"Build legendary streaks across months and unlock exclusive cosmetic rewards.", color:"#f97316" },
    { icon:"🤖", title:"AI Fan Persona",      desc:"Get your AI-generated fan personality and unique commentator voice.", color:"#10b981" },
  ];

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Rajdhani', sans-serif", overflowX:"hidden" }}>
      {/* Hero */}
      <div style={{ minHeight:"100vh", position:"relative", display:"flex", alignItems:"center", justifyContent:"center",
        flexDirection:"column", textAlign:"center", padding:"80px 24px",
        background:"radial-gradient(ellipse 120% 80% at 50% 0%, rgba(0,80,150,0.12) 0%, transparent 60%), #060912" }}>

        {/* Animated orbs */}
        {[
          { size:280, top:"12%", left:"8%",  color:"rgba(0,212,255,0.04)",  delay:"0s" },
          { size:200, top:"60%", right:"6%", color:"rgba(139,92,246,0.06)", delay:"2s" },
          { size:140, top:"30%", right:"20%",color:"rgba(236,72,153,0.04)", delay:"1s" },
        ].map((o,i) => (
          <div key={i} className="float-anim" style={{
            position:"absolute", width:o.size, height:o.size, borderRadius:"50%",
            background:o.color, border:`1px solid ${o.color.replace("0.04","0.15").replace("0.06","0.15")}`,
            top:o.top, left:o.left, right:o.right, animationDelay:o.delay, pointerEvents:"none"
          }} />
        ))}

        {/* Scanline effect */}
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", opacity:0.04 }}>
          <div style={{ position:"absolute", width:"100%", height:2, background:"#00d4ff", animation:"scanline 4s linear infinite" }} />
        </div>

        <div className="glass" style={{ display:"inline-block", padding:"5px 16px", borderRadius:20, marginBottom:24, border:"1px solid rgba(0,212,255,0.25)" }}>
          <LivePill /> <span style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginLeft:8 }}>IPL 2025 Season · Match 34 in progress</span>
        </div>

        <h1 className="orb" style={{ fontSize:"clamp(36px,7vw,76px)", fontWeight:900, lineHeight:1.05, marginBottom:20, letterSpacing:"-2px" }}>
          <span style={{ color:"white" }}>THE FUTURE</span><br/>
          <span className="shimmer-text">OF FAN CULTURE</span>
        </h1>

        <p style={{ fontSize:17, color:"rgba(255,255,255,0.55)", maxWidth:580, lineHeight:1.65, marginBottom:40 }}>
          AI-powered predictions, clan wars, live quests, and a battle pass system built for the next generation of cricket and esports fans.
        </p>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:60 }}>
          <button onClick={onEnter} style={{
            padding:"15px 44px", borderRadius:100, fontSize:16, fontWeight:700,
            background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", border:"none",
            color:"white", cursor:"pointer", fontFamily:"'Orbitron', sans-serif",
            boxShadow:"0 0 40px rgba(0,212,255,0.35)", letterSpacing:"0.5px",
            transition:"all 0.3s ease"
          }}>ENTER FANVERSE</button>
          <button style={{
            padding:"15px 44px", borderRadius:100, fontSize:15, fontWeight:600,
            background:"transparent", border:"1px solid rgba(255,255,255,0.2)",
            color:"rgba(255,255,255,0.7)", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif"
          }}>Watch Demo ▶</button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:56, flexWrap:"wrap", justifyContent:"center" }}>
          {[["2.4M+","Active Fans"],["450K+","Daily Predictions"],["12K+","Active Clans"],["99.8%","Platform Uptime"]].map(([v,l],i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div className="orb" style={{ fontSize:30, fontWeight:900,
                background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:"80px 40px", background:"#080c18" }}>
        <div style={{ textAlign:"center", marginBottom:50 }}>
          <h2 className="orb" style={{ fontSize:32, fontWeight:900, letterSpacing:"-1px" }}>BUILT DIFFERENT</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", marginTop:8, fontSize:15 }}>Not a fantasy app. Not a quiz app. Something entirely new.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, maxWidth:1200, margin:"0 auto" }}>
          {features.map((f,i) => (
            <div key={i} className="glass card-hover" style={{ padding:"24px 22px", cursor:"default" }}>
              <div style={{ fontSize:30, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontSize:16, fontWeight:700, color:f.color, marginBottom:8, fontFamily:"'Orbitron', sans-serif", fontSize:14 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Pass Preview */}
      <div style={{ padding:"80px 40px", background:"#060912" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <Badge color="#fbbf24" size="md">⚡ SEASON PASS · SEASON 1</Badge>
          <h2 className="orb" style={{ fontSize:28, fontWeight:900, margin:"16px 0 8px" }}>BATTLE PASS PROGRESSION</h2>
          <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:40, fontSize:14 }}>Unlock exclusive rewards as you engage throughout the season</p>

          <div style={{ display:"flex", gap:4, justifyContent:"center", flexWrap:"wrap" }}>
            {PASS_TIERS.map((t,i) => (
              <div key={i} style={{ textAlign:"center", width:80 }}>
                <div style={{
                  width:56, height:56, borderRadius:12, margin:"0 auto 6px",
                  background: t.done ? "rgba(0,212,255,0.12)" : t.current ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${t.done ? "rgba(0,212,255,0.35)" : t.current ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.07)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                  boxShadow: t.current ? "0 0 20px rgba(251,191,36,0.25)" : "none"
                }}>{t.done ? t.icon : t.current ? t.icon : "🔒"}</div>
                <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase",
                  color: t.done ? "#00d4ff" : t.current ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                  {t.done ? "✓" : t.current ? "NEXT" : `T${t.tier}`}
                </div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{t.name}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20, height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ width:"40%", height:"100%", background:"linear-gradient(90deg,#00d4ff,#8b5cf6)", borderRadius:2 }} />
          </div>
          <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:6 }}>Tier 4 / 10 Complete</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"80px 24px", textAlign:"center", background:"#080c18",
        borderTop:"1px solid rgba(0,212,255,0.08)" }}>
        <h2 className="orb" style={{ fontSize:36, fontWeight:900, marginBottom:16 }}>
          <span className="shimmer-text">READY TO PLAY?</span>
        </h2>
        <p style={{ color:"rgba(255,255,255,0.45)", marginBottom:32, fontSize:15 }}>Join 2.4 million fans. Your clan needs you.</p>
        <button onClick={onEnter} style={{
          padding:"16px 56px", borderRadius:100, fontSize:16, fontWeight:700,
          background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", border:"none",
          color:"white", cursor:"pointer", fontFamily:"'Orbitron', sans-serif",
          boxShadow:"0 0 50px rgba(0,212,255,0.4)", letterSpacing:"1px"
        }}>JOIN FANVERSE NOW</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({ setPage }) {
  const xpPct = Math.round((USER.xp / USER.xpMax) * 100);

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, fontFamily:"'Orbitron', sans-serif" }}>
            GM, <span style={{ background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AvePlayz</span> 👋
          </h1>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginTop:4 }}>IPL 2025 · Match 34 is LIVE right now</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <Badge color="#f97316">🔥 14-Day Streak</Badge>
          <Badge color="#8b5cf6">⚡ Level 42</Badge>
          <Badge color="#fbbf24">🏆 Rank #7</Badge>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatTile icon="🏆" label="Global Rank" value="#7" color="#fbbf24" sub="↑ 2 this week" />
        <StatTile icon="🎯" label="Predictions" value="234" color="#00d4ff" sub="74% accuracy" />
        <StatTile icon="🧠" label="Accuracy" value="74%" color="#10b981" sub="Top 8% globally" />
        <StatTile icon="⚔️" label="Clan Wars" value="12" color="#8b5cf6" sub="9W 3L record" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Level Card */}
        <div className="glass" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Level Progress</div>
              <div className="orb" style={{ fontSize:28, fontWeight:900, marginTop:2 }}>Level 42</div>
            </div>
            <div style={{
              width:68, height:68, borderRadius:"50%",
              background:"rgba(0,212,255,0.1)", border:"2px solid #00d4ff",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, fontWeight:900, color:"#00d4ff",
              boxShadow:"0 0 24px rgba(0,212,255,0.3)", fontFamily:"'Orbitron', sans-serif"
            }}>42</div>
          </div>
          <XPBar pct={xpPct} />
          <div className="raj" style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:11, color:"rgba(255,255,255,0.35)" }}>
            <span>{USER.xp.toLocaleString()} XP</span>
            <span>{(USER.xpMax - USER.xp).toLocaleString()} to Lv.43</span>
          </div>

          <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(249,115,22,0.08)", borderRadius:10, border:"1px solid rgba(249,115,22,0.2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span className="fire-icon" style={{ fontSize:22 }}>🔥</span>
              <div>
                <div className="raj" style={{ fontSize:14, fontWeight:700, color:"#f97316" }}>{USER.streak}-Day Streak!</div>
                <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>You're on fire — keep predicting daily</div>
              </div>
              <Badge color="#f97316" size="sm">EPIC</Badge>
            </div>
          </div>
        </div>

        {/* Live Match */}
        <div className="glass neon-border-red" style={{ padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div className="raj" style={{ fontSize:14, fontWeight:700 }}>🔴 Live Now</div>
            <LivePill />
          </div>
          {(() => {
            const m = MATCHES[0];
            return (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"center", marginBottom:16 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36 }}>{m.team1.emoji}</div>
                    <div style={{ fontWeight:800, fontSize:16, color:m.team1.color, fontFamily:"'Orbitron', sans-serif", fontSize:14 }}>{m.team1.name}</div>
                    <div style={{ fontSize:22, fontWeight:900, marginTop:2 }}>{m.team1.score}</div>
                    <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{m.team1.overs} ov</div>
                  </div>
                  <div className="raj" style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.3)", fontWeight:700 }}>VS</div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36 }}>{m.team2.emoji}</div>
                    <div style={{ fontWeight:800, color:m.team2.color, fontFamily:"'Orbitron', sans-serif", fontSize:14 }}>{m.team2.name}</div>
                    <div style={{ fontSize:22, fontWeight:900, marginTop:2 }}>{m.team2.score}</div>
                    <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{m.team2.overs} ov</div>
                  </div>
                </div>
                <div>
                  <div className="raj" style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:5 }}>
                    <span style={{ color:m.team1.color }}>{m.team1.name}</span>
                    <span style={{ fontWeight:600 }}>⚡ Momentum</span>
                    <span style={{ color:m.team2.color }}>{m.team2.name}</span>
                  </div>
                  <div style={{ height:10, background:"rgba(255,255,255,0.05)", borderRadius:5, overflow:"hidden" }}>
                    <div style={{ width:`${m.momentum}%`, height:"100%", background:`linear-gradient(90deg,${m.team1.color},${m.team2.color})`, borderRadius:5 }} />
                  </div>
                </div>
                <button onClick={() => setPage("arena")} style={{
                  width:"100%", marginTop:14, padding:"10px", borderRadius:10, fontSize:13, fontWeight:700,
                  background:"linear-gradient(135deg,rgba(0,212,255,0.15),rgba(139,92,246,0.15))",
                  border:"1px solid rgba(0,212,255,0.25)", color:"#00d4ff", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif"
                }}>🎯 Go to Prediction Arena →</button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Quests */}
      <div className="glass" style={{ padding:22, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="raj" style={{ fontSize:16, fontWeight:700 }}>⚡ Active Quests</div>
          <span onClick={() => setPage("quests")} style={{ fontSize:12, color:"#00d4ff", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif" }}>View All →</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {QUESTS.map(q => (
            <div key={q.id} style={{
              padding:14, borderRadius:12,
              background: q.done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${q.done ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
              opacity: q.done ? 0.85 : 1, transition:"all 0.2s"
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:18 }}>{q.icon}</span>
                  <div>
                    <div className="raj" style={{ fontSize:12, fontWeight:700 }}>{q.title}</div>
                    <Badge color={RarityColor(q.rarity)}>{q.rarity}</Badge>
                  </div>
                </div>
                <div className="raj" style={{ fontSize:11, color:"#fbbf24", fontWeight:700 }}>+{q.xp} XP</div>
              </div>
              <MiniBar pct={q.done ? 100 : Math.round((q.progress/q.total)*100)} color={q.done ? "#10b981" : "#00d4ff"} />
              <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:3, textAlign:"right" }}>
                {q.done ? "✅ Complete!" : `${q.progress}/${q.total}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="glass" style={{ padding:22 }}>
        <div className="raj" style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📈 Weekly XP Activity</div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={ACTIVITY} margin={{ top:5, right:5, bottom:0, left:-20 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="rgba(255,255,255,0)" tick={{ fill:"rgba(255,255,255,0.35)", fontSize:11, fontFamily:"Rajdhani" }} />
            <YAxis stroke="rgba(255,255,255,0)" tick={{ fill:"rgba(255,255,255,0.25)", fontSize:10 }} />
            <Tooltip contentStyle={{ background:"#0d1428", border:"1px solid rgba(0,212,255,0.2)", borderRadius:8, color:"white", fontSize:12, fontFamily:"Rajdhani" }} />
            <Area type="monotone" dataKey="xp" stroke="#00d4ff" fill="url(#g1)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  PREDICTION ARENA
// ═══════════════════════════════════════════
function PredictionArena() {
  const [picks, setPicks] = useState({});
  const [locked, setLocked] = useState({});
  const [trivIdx, setTrivIdx] = useState(0);
  const [trivAns, setTrivAns] = useState(null);

  const trivia = [
    { q:"How many runs did Sachin Tendulkar score in his ODI career?", opts:["18,426","15,921","20,100","17,300"], ans:0 },
    { q:"Which team won IPL 2024?", opts:["CSK","MI","KKR","RCB"], ans:2 },
    { q:"Who holds the record for the fastest T20I century?", opts:["AB de Villiers","Chris Gayle","Rohit Sharma","David Miller"], ans:0 },
  ];
  const tq = trivia[trivIdx % trivia.length];

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      <SectionHeader title="🎯 LIVE ARENA" sub="Real-time predictions powered by AI. Every call matters."
        right={<LivePill />} />

      {MATCHES.map(m => (
        <div key={m.id} className="glass card-hover" style={{ padding:24, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontWeight:600, letterSpacing:"1px" }}>{m.tournament} · {m.round}</div>
            {m.status === "LIVE" ? <LivePill /> : (
              <Badge color="#10b981" size="md">✅ {m.status}</Badge>
            )}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:24, alignItems:"center", marginBottom:24 }}>
            {[m.team1, m.team2].map((team, ti) => (
              <div key={ti} style={{ textAlign: ti===0 ? "left" : "right" }}>
                <div style={{ fontSize:48 }}>{team.emoji}</div>
                <div className="orb" style={{ fontSize:18, fontWeight:900, color:team.color }}>{team.name}</div>
                <div style={{ fontSize:28, fontWeight:900, margin:"4px 0" }}>{team.score}</div>
                <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{team.overs} overs</div>
                {m.odds && <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Odds: {m.odds[ti]}x</div>}
              </div>
            ))}
            <div style={{ textAlign:"center" }}>
              <div className="orb" style={{ fontSize:14, color:"rgba(255,255,255,0.25)", fontWeight:700 }}>VS</div>
            </div>
          </div>

          {/* Momentum Meter */}
          <div style={{ marginBottom:20 }}>
            <div className="raj" style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:5 }}>
              <span style={{ color:m.team1.color }}>↑ {m.team1.name}</span>
              <span style={{ fontWeight:600, color:"rgba(255,255,255,0.6)" }}>⚡ Match Momentum</span>
              <span style={{ color:m.team2.color }}>{m.team2.name} ↑</span>
            </div>
            <div style={{ height:12, background:"rgba(255,255,255,0.05)", borderRadius:6, overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${m.momentum}%`,
                background:`linear-gradient(90deg,${m.team1.color},${m.team2.color})`, borderRadius:6 }} />
              <div style={{ position:"absolute", left:`${m.momentum - 0.5}%`, top:-2, bottom:-2, width:3, background:"white", borderRadius:2 }} />
            </div>
            <div className="raj" style={{ textAlign:"center", fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:3 }}>
              {m.team1.name} {m.momentum}% — {m.team2.name} {100-m.momentum}%
            </div>
          </div>

          {/* Commentary */}
          <div style={{ marginBottom:20, padding:"10px 14px", background:"rgba(255,255,255,0.02)", borderRadius:10, borderLeft:"2px solid rgba(0,212,255,0.3)" }}>
            <div className="raj" style={{ fontSize:11, color:"#00d4ff", fontWeight:700, marginBottom:4 }}>🎙 LIVE COMMENTARY</div>
            {m.commentary.map((c,i) => (
              <div key={i} className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.55)", marginTop:i>0?3:0 }}>• {c}</div>
            ))}
          </div>

          {/* AI tip */}
          {m.status === "LIVE" && !locked[m.id] && (
            <div style={{ marginBottom:14, padding:"10px 14px", background:"rgba(139,92,246,0.08)", borderRadius:10, border:"1px solid rgba(139,92,246,0.2)" }}>
              <span className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>
                🤖 AI Insight: <strong style={{ color:"#fbbf24" }}>CSK to win</strong> — 68% confidence based on current run rate and bowling attack history
              </span>
            </div>
          )}

          {/* Prediction */}
          {m.status === "LIVE" && !locked[m.id] && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                {[m.team1, m.team2].map((team, ti) => (
                  <button key={ti} className="predict-btn" onClick={() => setPicks(p => ({...p,[m.id]:team.name}))}
                    style={{
                      padding:"14px", borderRadius:12, fontSize:14, fontWeight:700,
                      background: picks[m.id]===team.name ? `${team.color}20` : "rgba(255,255,255,0.03)",
                      border: `2px solid ${picks[m.id]===team.name ? team.color : "rgba(255,255,255,0.08)"}`,
                      color: picks[m.id]===team.name ? team.color : "rgba(255,255,255,0.6)",
                      boxShadow: picks[m.id]===team.name ? `0 0 20px ${team.color}35` : "none",
                      fontFamily:"'Rajdhani', sans-serif"
                    }}>
                    {team.emoji} {team.name} Wins
                  </button>
                ))}
              </div>
              {picks[m.id] && (
                <button onClick={() => setLocked(l => ({...l,[m.id]:picks[m.id]}))}
                  style={{
                    width:"100%", padding:14, borderRadius:12, fontSize:14, fontWeight:700,
                    background:"linear-gradient(135deg,#00d4ff,#8b5cf6)", border:"none",
                    color:"white", cursor:"pointer", fontFamily:"'Orbitron', sans-serif",
                    boxShadow:"0 0 24px rgba(0,212,255,0.3)", letterSpacing:"0.5px"
                  }}>🎯 LOCK IN: {picks[m.id].toUpperCase()} WINS (+250 XP)</button>
              )}
            </div>
          )}

          {locked[m.id] && (
            <div style={{ padding:16, background:"rgba(16,185,129,0.08)", borderRadius:12, border:"1px solid rgba(16,185,129,0.25)", textAlign:"center" }}>
              <div style={{ fontSize:24, marginBottom:4 }}>✅</div>
              <div className="orb" style={{ fontWeight:700, color:"#10b981", fontSize:14 }}>PREDICTION LOCKED</div>
              <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:4 }}>You picked: {locked[m.id]} · Results after match</div>
            </div>
          )}

          {m.status !== "LIVE" && (
            <div style={{ padding:16, background:"rgba(16,185,129,0.06)", borderRadius:12, border:"1px solid rgba(16,185,129,0.2)", textAlign:"center" }}>
              <div className="raj" style={{ color:"#10b981", fontWeight:700, fontSize:14 }}>✅ Match Ended · {m.status}</div>
              <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>Your prediction earned: <strong style={{ color:"#fbbf24" }}>+375 XP 🎉</strong></div>
            </div>
          )}
        </div>
      ))}

      {/* Trivia Battle */}
      <div className="glass" style={{ padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="raj" style={{ fontSize:16, fontWeight:700 }}>🧠 Trivia Battle</div>
          <Badge color="#00d4ff">+150 XP per correct</Badge>
        </div>
        <div className="raj" style={{ fontSize:16, fontWeight:600, marginBottom:16, color:"rgba(255,255,255,0.85)" }}>{tq.q}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {tq.opts.map((opt,i) => (
            <button key={i} onClick={() => setTrivAns(i)}
              style={{
                padding:"12px", borderRadius:10, fontSize:14, fontWeight:600,
                background: trivAns===null ? "rgba(255,255,255,0.03)" : i===tq.ans ? "rgba(16,185,129,0.15)" : trivAns===i ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${trivAns===null ? "rgba(255,255,255,0.08)" : i===tq.ans ? "rgba(16,185,129,0.4)" : trivAns===i ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.04)"}`,
                color: trivAns===null ? "rgba(255,255,255,0.7)" : i===tq.ans ? "#10b981" : trivAns===i ? "#ef4444" : "rgba(255,255,255,0.35)",
                cursor:"pointer", fontFamily:"'Rajdhani', sans-serif", transition:"all 0.2s"
              }}>{opt}</button>
          ))}
        </div>
        {trivAns !== null && (
          <button onClick={() => { setTrivIdx(n => n+1); setTrivAns(null); }}
            style={{ marginTop:14, padding:"10px 24px", borderRadius:10, fontSize:13, fontWeight:700,
              background:"linear-gradient(135deg,#00d4ff20,#8b5cf620)", border:"1px solid rgba(0,212,255,0.3)",
              color:"#00d4ff", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif" }}>
            Next Question →
          </button>
        )}
      </div>

      {/* Flash Challenge */}
      <div className="glass neon-border-gold" style={{ padding:20, background:"rgba(251,191,36,0.03)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
          <div>
            <Badge color="#fbbf24" size="md">⚡ FLASH CHALLENGE · 4m 32s</Badge>
            <div className="orb" style={{ fontSize:17, fontWeight:900, marginTop:10 }}>HOW MANY RUNS IN NEXT OVER?</div>
            <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginTop:4 }}>First 50 correct answers win 500 XP each · 23 spots left</div>
          </div>
          <button style={{
            padding:"13px 28px", background:"linear-gradient(135deg,#fbbf24,#f97316)",
            border:"none", borderRadius:12, color:"white", fontWeight:700,
            cursor:"pointer", fontSize:14, fontFamily:"'Orbitron', sans-serif",
            boxShadow:"0 0 24px rgba(251,191,36,0.4)", letterSpacing:"0.5px"
          }}>ENTER NOW!</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════
function Leaderboard() {
  const [filter, setFilter] = useState("global");
  const top3 = LEADERBOARD.slice(0,3);
  const changeIcon = { up:"↑", down:"↓", same:"—" };
  const changeColor = { up:"#10b981", down:"#ef4444", same:"rgba(255,255,255,0.3)" };

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      <SectionHeader title="🏆 LEADERBOARD" sub="IPL 2025 Season Rankings · Updated every 60 seconds"
        right={
          <div style={{ display:"flex", gap:8 }}>
            {["global","clan","weekly"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:"6px 16px", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)",
                background: filter===f ? "linear-gradient(135deg,#00d4ff,#8b5cf6)" : "transparent",
                color:"white", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Rajdhani', sans-serif",
                textTransform:"capitalize"
              }}>{f}</button>
            ))}
          </div>
        } />

      {/* Podium */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr 1fr", gap:12, marginBottom:24 }}>
        {[top3[1], top3[0], top3[2]].map((u, vi) => {
          const r = [2,1,3][vi];
          const col = ["#9ca3af","#fbbf24","#f97316"][r-1];
          const podEmoji = ["🥇","🥈","🥉"][r-1];
          return (
            <div key={vi} className="glass" style={{ padding:20, textAlign:"center", border:`1px solid ${col}25`,
              transform: r===1 ? "none" : "translateY(8px)" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{podEmoji}</div>
              <div style={{ width:48, height:48, borderRadius:"50%", margin:"0 auto 10px",
                background:`${col}20`, border:`2px solid ${col}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, fontWeight:800, color:col, fontFamily:"'Orbitron', sans-serif",
                boxShadow:`0 0 16px ${col}40` }}>{u?.name?.[0]}</div>
              <div className="raj" style={{ fontSize:13, fontWeight:700 }}>{u?.name}</div>
              <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:6 }}>{u?.clan}</div>
              <div className="orb" style={{ fontSize:18, fontWeight:900, color:col }}>{u?.xp?.toLocaleString()}</div>
              <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Lv.{u?.level} · {u?.acc}% acc</div>
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="glass" style={{ overflow:"hidden" }}>
        <div className="raj" style={{
          display:"grid", gridTemplateColumns:"44px 1fr 90px 80px 60px 36px",
          gap:8, padding:"10px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)",
          fontSize:10, color:"rgba(255,255,255,0.3)", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase"
        }}>
          <span>#</span><span>Player</span><span style={{ textAlign:"right" }}>XP</span>
          <span style={{ textAlign:"right" }}>Accuracy</span><span style={{ textAlign:"right" }}>Streak</span><span />
        </div>

        {LEADERBOARD.map((u,i) => (
          <div key={i} className="lb-row" style={{
            display:"grid", gridTemplateColumns:"44px 1fr 90px 80px 60px 36px",
            gap:8, padding:"13px 20px", alignItems:"center",
            background: u.isUser ? "rgba(0,212,255,0.04)" : "transparent",
            borderBottom:"1px solid rgba(255,255,255,0.03)"
          }}>
            <span className="orb" style={{ fontSize:13, fontWeight:700,
              color: u.rank===1?"#fbbf24":u.rank===2?"#9ca3af":u.rank===3?"#f97316":"rgba(255,255,255,0.35)" }}>
              {u.rank<=3 ? ["🥇","🥈","🥉"][u.rank-1] : `#${u.rank}`}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                background: u.isUser ? "linear-gradient(135deg,#00d4ff,#8b5cf6)" : "rgba(255,255,255,0.08)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:800, color:"white",
                border: u.isUser ? "2px solid #00d4ff" : "none",
                boxShadow: u.isUser ? "0 0 12px rgba(0,212,255,0.4)" : "none" }}>{u.name[0]}</div>
              <div>
                <div className="raj" style={{ fontSize:13, fontWeight:700, color: u.isUser ? "#00d4ff" : "white" }}>
                  {u.name}{u.isUser && " (You)"}
                </div>
                <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Lv.{u.level} · {u.clan}</div>
              </div>
            </div>
            <div className="orb" style={{ textAlign:"right", fontSize:12, fontWeight:700, color:"#fbbf24" }}>
              {u.xp.toLocaleString()}
            </div>
            <div style={{ textAlign:"right" }}>
              <span className="raj" style={{ fontSize:12, padding:"2px 8px", borderRadius:20,
                background: u.acc>=75 ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                color: u.acc>=75 ? "#10b981" : "rgba(255,255,255,0.5)" }}>{u.acc}%</span>
            </div>
            <div className="raj" style={{ textAlign:"right", fontSize:12, color:"#f97316" }}>🔥 {u.streak}d</div>
            <div className="raj" style={{ textAlign:"right", fontSize:13, color: changeColor[u.change], fontWeight:700 }}>
              {changeIcon[u.change]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  CLAN BATTLES
// ═══════════════════════════════════════════
function ClanBattles() {
  const c1 = { name:"CSK Ultras", emoji:"🦁", color:"#fbbf24", score:2840, members:47, level:15 };
  const c2 = { name:"RCB Royals", emoji:"🔴", color:"#ef4444", score:2210, members:43, level:14 };
  const total = c1.score + c2.score;
  const pct1 = Math.round((c1.score / total) * 100);

  const feed1 = [
    { user:"AvePlayz",  action:"Correct prediction", pts:"+120", time:"2m" },
    { user:"CricFan247",action:"Trivia streak ×5",   pts:"+250", time:"5m" },
    { user:"StrikerX",  action:"Flash challenge",    pts:"+500", time:"12m" },
    { user:"PredictorX",action:"Match winner call",  pts:"+200", time:"18m" },
    { user:"IPLGuru",   action:"Daily quest done",   pts:"+350", time:"25m" },
  ];
  const feed2 = [
    { user:"FanMania",  action:"Trivia ×3 correct",  pts:"+90",  time:"1m" },
    { user:"ThunderBolt",action:"Prediction win",    pts:"+150", time:"8m" },
    { user:"RCBFan1",  action:"Flash challenge",     pts:"+350", time:"15m" },
    { user:"ViratX",   action:"Clan quest done",     pts:"+400", time:"20m" },
    { user:"KingKohli",action:"Trivia streak ×4",   pts:"+200", time:"30m" },
  ];

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      <SectionHeader title="⚔️ CLAN BATTLES" sub={`Active war: ${c1.name} vs ${c2.name} · Ends in 8h 24m`} />

      {/* War Card */}
      <div className="glass" style={{ padding:28, marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 80% at 25% 50%, ${c1.color}08 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 75% 50%, ${c2.color}08 0%, transparent 60%)`, pointerEvents:"none" }} />

        <div style={{ position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <Badge color="#fbbf24" size="md">⏱ BATTLE ENDS: 8H 24M</Badge>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center", marginBottom:24 }}>
            {[c1, c2].map((c,ci) => (
              <div key={ci} style={{ textAlign:"center" }}>
                <div style={{ fontSize:52 }}>{c.emoji}</div>
                <div className="orb" style={{ fontSize:18, fontWeight:900, color:c.color, marginTop:4 }}>{c.name}</div>
                <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"4px 0 10px" }}>
                  Lv.{c.level} · {c.members} members
                </div>
                <div className="orb" style={{ fontSize:42, fontWeight:900, color:c.color }}>
                  {c.score.toLocaleString()}
                </div>
                <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Battle Points</div>
                {ci === 0 && <Badge color="#10b981" size="md">🏆 LEADING</Badge>}
              </div>
            ))}
            <div style={{ textAlign:"center", fontSize:40 }}>⚔️</div>
          </div>

          {/* Battle Bar */}
          <div style={{ marginBottom:20 }}>
            <div className="raj" style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:6 }}>
              <span style={{ color:c1.color }}>{pct1}%</span>
              <span>Total: {total.toLocaleString()} pts</span>
              <span style={{ color:c2.color }}>{100-pct1}%</span>
            </div>
            <div style={{ height:18, background:"rgba(255,255,255,0.05)", borderRadius:9, overflow:"hidden", display:"flex" }}>
              <div style={{ width:`${pct1}%`, background:`linear-gradient(90deg,${c1.color},${c1.color}bb)`, borderRadius:"9px 0 0 9px", transition:"width 1.2s ease" }} />
              <div style={{ flex:1, background:`linear-gradient(90deg,${c2.color}bb,${c2.color})`, borderRadius:"0 9px 9px 0" }} />
            </div>
          </div>

          <div style={{ padding:"12px 16px", background:"rgba(139,92,246,0.08)", borderRadius:10, border:"1px solid rgba(139,92,246,0.2)", marginBottom:16 }}>
            <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>
              🤖 AI War Forecast: <strong style={{ color:"#fbbf24" }}>CSK Ultras projected to win</strong> with 71% probability. RCB needs 630 pts in 8h — achievable but requires full clan mobilization.
            </div>
          </div>

          <button style={{
            width:"100%", padding:14, background:"linear-gradient(135deg,#fbbf24,#f97316)",
            border:"none", borderRadius:12, color:"white", fontWeight:800,
            cursor:"pointer", fontSize:15, fontFamily:"'Orbitron', sans-serif",
            boxShadow:"0 0 24px rgba(251,191,36,0.35)", letterSpacing:"0.5px"
          }}>⚔️ CONTRIBUTE TO BATTLE (+50 PTS)</button>
        </div>
      </div>

      {/* Feeds */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {[[c1,feed1],[c2,feed2]].map(([clan,feed],ci) => (
          <div key={ci} className="glass" style={{ padding:20 }}>
            <div className="raj" style={{ fontSize:14, fontWeight:700, color:clan.color, marginBottom:14 }}>
              {clan.emoji} {clan.name} Feed
            </div>
            {feed.map((e,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="raj" style={{ fontSize:12, fontWeight:700 }}>{e.user}</div>
                  <div className="raj" style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{e.action}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="raj" style={{ fontSize:12, color:"#10b981", fontWeight:700 }}>{e.pts}</div>
                  <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>{e.time} ago</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Available Clans */}
      <div className="glass" style={{ padding:20 }}>
        <div className="raj" style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>🌍 Find a Clan</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:12 }}>
          {[
            { name:"MI Paltan",   emoji:"🔵", color:"#3b82f6", members:52, rank:1, war:"Active" },
            { name:"CSK Ultras",  emoji:"🦁", color:"#fbbf24", members:47, rank:2, war:"Active", isUser:true },
            { name:"KKR Kings",   emoji:"💜", color:"#8b5cf6", members:45, rank:3, war:"Prep" },
            { name:"RCB Royals",  emoji:"🔴", color:"#ef4444", members:43, rank:4, war:"Active" },
          ].map((c,i) => (
            <div key={i} style={{ padding:14, borderRadius:12, textAlign:"center", cursor:"pointer",
              background: c.isUser ? `${c.color}15` : "rgba(255,255,255,0.02)",
              border: `1px solid ${c.isUser ? c.color+"50" : "rgba(255,255,255,0.07)"}` }}>
              <div style={{ fontSize:28 }}>{c.emoji}</div>
              <div className="raj" style={{ fontSize:13, fontWeight:700, color:c.color, margin:"4px 0" }}>{c.name}</div>
              <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>{c.members} members · Rank #{c.rank}</div>
              {c.isUser
                ? <Badge color={c.color}>YOUR CLAN</Badge>
                : <button style={{ padding:"4px 14px", borderRadius:20, border:`1px solid ${c.color}50`, background:"transparent", color:c.color, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Rajdhani', sans-serif" }}>Join</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  PROFILE
// ═══════════════════════════════════════════
function Profile() {
  const xpPct = Math.round((USER.xp / USER.xpMax) * 100);

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      <SectionHeader title="👤 MY PROFILE" sub="Your fan journey, achievements, and AI persona" />

      {/* Profile Hero */}
      <div className="glass" style={{ padding:28, marginBottom:20 }}>
        <div style={{ display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div style={{ position:"relative" }}>
            <div style={{
              width:80, height:80, borderRadius:"50%",
              background:"linear-gradient(135deg,#00d4ff,#8b5cf6)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:32, fontWeight:900, boxShadow:"0 0 30px rgba(0,212,255,0.4)"
            }}>A</div>
            <div style={{ position:"absolute", bottom:-4, right:-4, width:26, height:26, borderRadius:"50%",
              background:"linear-gradient(135deg,#fbbf24,#f97316)", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:900, border:"2px solid #060912", color:"white", fontFamily:"'Orbitron', sans-serif" }}>42</div>
          </div>

          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
              <div>
                <h2 className="orb" style={{ fontSize:22, fontWeight:900 }}>{USER.name}</h2>
                <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:10 }}>
                  🤖 AI Persona: <strong style={{ color:"#00d4ff" }}>{USER.persona}</strong> · 🦁 {USER.clan}
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <Badge color="#f97316">🔥 {USER.streak}-Day Streak</Badge>
                  <Badge color="#8b5cf6">⚡ Level {USER.level}</Badge>
                  <Badge color="#10b981">🏆 Rank #{USER.rank}</Badge>
                  <Badge color="#fbbf24">🌍 Top 1%</Badge>
                </div>
              </div>
            </div>
            <div style={{ marginTop:16 }}>
              <div className="raj" style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:5 }}>
                <span>Level {USER.level}</span>
                <span>{USER.xp.toLocaleString()} / {USER.xpMax.toLocaleString()} XP</span>
                <span>Level {USER.level+1}</span>
              </div>
              <XPBar pct={xpPct} height={10} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        <StatTile icon="🎯" label="Predictions" value={USER.totalPredictions} color="#00d4ff" />
        <StatTile icon="🧠" label="Accuracy" value={`${USER.accuracy}%`} color="#10b981" sub="Top 8%" />
        <StatTile icon="✅" label="Quests Done" value={USER.questsDone} color="#8b5cf6" />
        <StatTile icon="⚔️" label="Clan Wars" value={USER.clanWars} color="#fbbf24" sub="9W 3L" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Badges */}
        <div className="glass" style={{ padding:20 }}>
          <div className="raj" style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>🏅 Badge Collection</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {USER.badges.map(b => (
              <div key={b.id} style={{ textAlign:"center", padding:10, borderRadius:10, cursor:"pointer", transition:"all 0.2s",
                background: b.earned ? `${RarityColor(b.rarity)}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${b.earned ? RarityColor(b.rarity)+"35" : "rgba(255,255,255,0.05)"}`,
                opacity: b.earned ? 1 : 0.4 }}>
                <div style={{ fontSize:22, filter:b.earned?"none":"grayscale(1)", marginBottom:4 }}>{b.icon}</div>
                <div className="raj" style={{ fontSize:8, fontWeight:700, color:b.earned?RarityColor(b.rarity):"rgba(255,255,255,0.25)", textTransform:"uppercase" }}>{b.rarity}</div>
                <div className="raj" style={{ fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:1 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass" style={{ padding:20 }}>
          <div className="raj" style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>🕸 Fan Skill Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill:"rgba(255,255,255,0.4)", fontSize:10, fontFamily:"Rajdhani" }} />
              <Radar dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Persona Card */}
      <div className="glass neon-border-cyan" style={{ padding:22, background:"rgba(0,212,255,0.02)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
          <div style={{ flex:1 }}>
            <div className="raj" style={{ fontSize:10, color:"#00d4ff", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>
              🤖 AI GENERATED FAN PERSONA
            </div>
            <div className="orb" style={{ fontSize:22, fontWeight:900, marginBottom:10 }}>The Oracle</div>
            <div className="raj" style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.65, maxWidth:520 }}>
              <em>"AvePlayz sees the game before it happens. With an uncanny ability to predict match outcomes 
              (74% accuracy) and a legendary 14-day streak, The Oracle commands respect in every clan battle. 
              Known for bold powerplay calls, clutch flash challenge performances, and being the first to call 
              an upset before it happens. Their clan relies on them in the final hours of war."</em>
            </div>
          </div>
          <button style={{ padding:"9px 18px", background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.25)",
            borderRadius:10, color:"#00d4ff", fontSize:12, fontWeight:700, cursor:"pointer",
            fontFamily:"'Rajdhani', sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
            Regenerate 🔄
          </button>
        </div>

        {/* AI Commentator */}
        <div style={{ marginTop:16, padding:"12px 14px", background:"rgba(0,212,255,0.05)", borderRadius:10, borderLeft:"2px solid #00d4ff" }}>
          <div className="raj" style={{ fontSize:11, color:"#00d4ff", fontWeight:700, marginBottom:3 }}>🎙 AI COMMENTATOR · Today's Recap</div>
          <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.5 }}>
            "And what a day for The Oracle — 14 consecutive days of fire! AvePlayz called the CSK momentum shift 
            in the 15th over before ANYONE else. That's not luck, that's prophecy. The clan is going to need 
            this level of performance if they want to hold off RCB tonight!"
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  QUEST CENTER
// ═══════════════════════════════════════════
function QuestCenter() {
  const [tab, setTab] = useState("daily");
  const [accepted, setAccepted] = useState({});

  const diffColor = { Epic:"#ef4444", Hard:"#fbbf24", Medium:"#00d4ff", Easy:"#10b981" };

  return (
    <div className="page-enter" style={{ paddingBottom:48 }}>
      <SectionHeader title="🔮 QUEST CENTER" sub="Personalized AI challenges crafted from your fan behavior"
        right={<Badge color="#8b5cf6" size="md">🤖 AI ENGINE ACTIVE</Badge>} />

      {/* AI Banner */}
      <div style={{ padding:"16px 20px", borderRadius:14, marginBottom:24,
        background:"linear-gradient(135deg,rgba(139,92,246,0.12),rgba(0,212,255,0.08))",
        border:"1px solid rgba(139,92,246,0.25)",
        display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:28 }}>🤖</span>
        <div>
          <div className="raj" style={{ fontWeight:700, fontSize:14 }}>AI Quest Engine — Analyzing your patterns</div>
          <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>
            74% prediction accuracy · 14-day streak · CSK Ultras war active → Generating personalized quests...
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", animation:"pulseGlow 1s infinite" }} />
          <span className="raj" style={{ fontSize:11, color:"#10b981", fontWeight:600 }}>LIVE</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["daily","📅 Daily"],["weekly","📆 Weekly"],["ai","🤖 AI Special"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding:"8px 20px", borderRadius:20, border:"none",
            background: tab===id ? "linear-gradient(135deg,#00d4ff,#8b5cf6)" : "rgba(255,255,255,0.05)",
            color:"white", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Rajdhani', sans-serif"
          }}>{label}</button>
        ))}
      </div>

      {/* Quest Cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:28 }}>
        {(tab === "ai" ? AI_QUESTS : QUESTS).map((q, i) => {
          const isAI = tab === "ai";
          const isAccepted = accepted[q.id];
          const isDone = q.done;
          return (
            <div key={q.id} className="glass" style={{ padding:22, transition:"all 0.2s",
              border: isAI ? "1px solid rgba(139,92,246,0.25)" : isDone ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.07)",
              background: isAI ? "rgba(139,92,246,0.03)" : isDone ? "rgba(16,185,129,0.03)" : "rgba(255,255,255,0.02)" }}>
              <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                <div style={{ width:44, height:44, borderRadius:10, flexShrink:0,
                  background: isAI ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.06)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                  {q.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <span className="raj" style={{ fontSize:15, fontWeight:700 }}>{q.title}</span>
                    {isAI && <Badge color="#8b5cf6">🤖 AI</Badge>}
                    {q.rarity && <Badge color={RarityColor(q.rarity)}>{q.rarity}</Badge>}
                    {q.difficulty && <Badge color={diffColor[q.difficulty]}>{q.difficulty}</Badge>}
                    {isDone && <Badge color="#10b981">✅ DONE</Badge>}
                  </div>
                  <div className="raj" style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.55, marginBottom: isAI && q.tag ? 8 : 0 }}>{q.desc}</div>
                  {isAI && q.tag && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px",
                      background:"rgba(139,92,246,0.1)", borderRadius:20, border:"1px solid rgba(139,92,246,0.2)" }}>
                      <span style={{ fontSize:10 }}>💡</span>
                      <span className="raj" style={{ fontSize:10, color:"#a78bfa", fontWeight:600 }}>{q.tag}</span>
                    </div>
                  )}
                  {q.progress !== undefined && !isDone && (
                    <div style={{ marginTop:10 }}>
                      <MiniBar pct={Math.round((q.progress/q.total)*100)} color="#00d4ff" />
                      <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:3 }}>{q.progress}/{q.total} complete</div>
                    </div>
                  )}
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div className="orb" style={{ fontSize:14, fontWeight:900, color:"#fbbf24" }}>
                    {isAI ? q.reward.split("+")[1]?.trim().split(" ")[0] + " XP" : `+${q.xp} XP`}
                  </div>
                  {isAI && q.timeLeft && (
                    <div className="raj" style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:3 }}>⏱ {q.timeLeft}</div>
                  )}
                  {!isDone && !isAccepted && (
                    <button onClick={() => setAccepted(a => ({...a,[q.id]:true}))}
                      style={{ marginTop:10, padding:"7px 14px", borderRadius:8, fontSize:11, fontWeight:700,
                        background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.25)",
                        color:"#00d4ff", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif", whiteSpace:"nowrap" }}>
                      Accept →
                    </button>
                  )}
                  {isAccepted && (
                    <div className="raj" style={{ fontSize:11, color:"#10b981", fontWeight:700, marginTop:10 }}>✅ Accepted!</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Battle Pass */}
      <div className="glass" style={{ padding:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div className="raj" style={{ fontSize:16, fontWeight:700 }}>⚡ Season 1 Battle Pass</div>
          <Badge color="#fbbf24">38 days left</Badge>
        </div>
        <div className="raj" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:18 }}>Tier 4 / 10 Complete · 1,250 XP to next tier</div>

        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8 }}>
          {PASS_TIERS.map((t,i) => (
            <div key={i} style={{ flex:"0 0 88px", textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:12, margin:"0 auto 6px",
                background: t.done ? "rgba(0,212,255,0.12)" : t.current ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${t.done ? "rgba(0,212,255,0.35)" : t.current ? "rgba(251,191,36,0.45)" : "rgba(255,255,255,0.06)"}`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
                boxShadow: t.current ? "0 0 18px rgba(251,191,36,0.3)" : "none" }}>
                {t.done ? t.icon : t.current ? t.icon : "🔒"}
              </div>
              <div className="raj" style={{ fontSize:8, fontWeight:700, letterSpacing:"0.5px", textTransform:"uppercase",
                color: t.done ? "#00d4ff" : t.current ? "#fbbf24" : "rgba(255,255,255,0.2)" }}>
                {t.done ? "✓ done" : t.current ? "NEXT" : `Tier ${t.tier}`}
              </div>
              <div className="raj" style={{ fontSize:8, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{t.name}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:14, height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
          <div style={{ width:"40%", height:"100%", background:"linear-gradient(90deg,#00d4ff,#8b5cf6)", borderRadius:3 }} />
        </div>

        <div style={{ marginTop:16, display:"flex", gap:12, justifyContent:"center" }}>
          <button style={{ padding:"11px 28px", borderRadius:10, fontSize:13, fontWeight:700,
            background:"linear-gradient(135deg,#fbbf24,#f97316)", border:"none",
            color:"white", cursor:"pointer", fontFamily:"'Orbitron', sans-serif",
            boxShadow:"0 0 20px rgba(251,191,36,0.3)", letterSpacing:"0.5px" }}>
            UPGRADE PASS ⚡
          </button>
          <button style={{ padding:"11px 28px", borderRadius:10, fontSize:13, fontWeight:600,
            background:"transparent", border:"1px solid rgba(255,255,255,0.15)",
            color:"rgba(255,255,255,0.6)", cursor:"pointer", fontFamily:"'Rajdhani', sans-serif" }}>
            View All Rewards
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════
export default function FanVerseAI() {
  const [page, setPage] = useState("landing");

  return (
    <div style={{ background:"#060912", minHeight:"100vh", color:"white", fontFamily:"'Rajdhani', sans-serif" }}>
      <style>{STYLES}</style>

      {page === "landing" && <LandingPage onEnter={() => setPage("dashboard")} />}

      {page !== "landing" && (
        <div style={{ display:"flex", minHeight:"100vh" }}>
          <Sidebar page={page} setPage={setPage} />
          <main style={{ flex:1, marginLeft:216, padding:"28px 32px", maxWidth:"calc(100vw - 216px)", overflowX:"hidden" }}>
            {page === "dashboard"   && <Dashboard setPage={setPage} />}
            {page === "arena"       && <PredictionArena />}
            {page === "leaderboard" && <Leaderboard />}
            {page === "clans"       && <ClanBattles />}
            {page === "profile"     && <Profile />}
            {page === "quests"      && <QuestCenter />}
          </main>
        </div>
      )}
    </div>
  );
}
