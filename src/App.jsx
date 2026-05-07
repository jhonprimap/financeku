import React, { useState, useContext, createContext, useMemo, useRef, useEffect } from "react";

const AppContext = createContext();

const INITIAL_CATEGORIES = [
  { id: "c1", name: "Gaji",      type: "income",  icon: "💼", color: "#10b981" },
  { id: "c2", name: "Freelance", type: "income",  icon: "💻", color: "#06b6d4" },
  { id: "c3", name: "Investasi", type: "income",  icon: "📈", color: "#8b5cf6" },
  { id: "c4", name: "Makanan",   type: "expense", icon: "🍜", color: "#f59e0b" },
  { id: "c5", name: "Transport", type: "expense", icon: "🚗", color: "#ef4444" },
  { id: "c6", name: "Belanja",   type: "expense", icon: "🛍️", color: "#ec4899" },
  { id: "c7", name: "Hiburan",   type: "expense", icon: "🎮", color: "#6366f1" },
  { id: "c8", name: "Kesehatan", type: "expense", icon: "🏥", color: "#14b8a6" },
  { id: "c9", name: "Tagihan",   type: "expense", icon: "🧾", color: "#f97316" },
];

const INITIAL_ACCOUNTS = [
  { id: "a1", name: "BCA Tabungan",       type: "bank",        balance: 12500000, color: "#3b82f6" },
  { id: "a2", name: "Mandiri Giro",        type: "bank",        balance: 8200000,  color: "#10b981" },
  { id: "a3", name: "BCA Visa Platinum",   type: "credit_card", balance: -2400000, limit: 20000000, billing_date: 25, due_date: 10, color: "#f59e0b" },
  { id: "a4", name: "Saham & Reksadana",   type: "investment",  balance: 45000000, color: "#8b5cf6" },
];

const INITIAL_TRANSACTIONS = [
  { id:"t1",  amount:12000000, type:"income",  category:"c1", account:"a1", date:"2025-06-01", note:"Gaji Juni",           tags:["rutin"] },
  { id:"t2",  amount:3500000,  type:"income",  category:"c2", account:"a1", date:"2025-06-03", note:"Project website",     tags:["freelance"] },
  { id:"t3",  amount:850000,   type:"expense", category:"c4", account:"a1", date:"2025-06-05", note:"Groceries Alfamart",  tags:["kebutuhan"] },
  { id:"t4",  amount:450000,   type:"expense", category:"c5", account:"a3", date:"2025-06-06", note:"Bensin & parkir",     tags:["rutin"] },
  { id:"t5",  amount:180000,   type:"expense", category:"c4", account:"a1", date:"2025-06-06", note:"Kopi & snack",        tags:["food"] },
  { id:"t6",  amount:1200000,  type:"expense", category:"c6", account:"a3", date:"2025-06-08", note:"Beli baju",           tags:["lifestyle"] },
  { id:"t7",  amount:299000,   type:"expense", category:"c7", account:"a1", date:"2025-06-10", note:"Netflix & Spotify",   tags:["subscriptions"] },
  { id:"t8",  amount:500000,   type:"expense", category:"c8", account:"a1", date:"2025-06-12", note:"Dokter gigi",         tags:["kesehatan"] },
  { id:"t9",  amount:750000,   type:"expense", category:"c6", account:"a3", date:"2025-06-12", note:"Skincare",            tags:["lifestyle"] },
  { id:"t10", amount:650000,   type:"expense", category:"c9", account:"a1", date:"2025-06-15", note:"Token listrik",       tags:["rutin"] },
  { id:"t11", amount:2000000,  type:"income",  category:"c3", account:"a4", date:"2025-06-16", note:"Dividen BBCA",        tags:["dividen"] },
  { id:"t12", amount:320000,   type:"expense", category:"c4", account:"a1", date:"2025-06-18", note:"Makan siang",         tags:["food"] },
  { id:"t13", amount:95000,    type:"expense", category:"c5", account:"a1", date:"2025-06-18", note:"Grab",                tags:["transport"] },
  { id:"t14", amount:2500000,  type:"expense", category:"c6", account:"a3", date:"2025-06-20", note:"Gadget accessories",  tags:["lifestyle"] },
  { id:"t15", amount:430000,   type:"expense", category:"c4", account:"a1", date:"2025-06-22", note:"Makan malam",         tags:["food"] },
  { id:"t16", amount:120000,   type:"expense", category:"c7", account:"a1", date:"2025-06-23", note:"Game in-app",         tags:["game"] },
  { id:"t17", amount:890000,   type:"expense", category:"c9", account:"a1", date:"2025-06-25", note:"Internet",            tags:["rutin"] },
  { id:"t18", amount:210000,   type:"expense", category:"c4", account:"a1", date:"2025-06-26", note:"Sarapan warung",      tags:["food"] },
  { id:"t19", amount:3200000,  type:"expense", category:"c6", account:"a3", date:"2025-06-28", note:"Belanja akhir bulan", tags:["lifestyle"] },
  { id:"t20", amount:150000,   type:"expense", category:"c5", account:"a1", date:"2025-06-29", note:"Ojek online",         tags:["transport"] },
];


const INITIAL_RECURRINGS = [
  { id:"r1", name:"Asuransi Jiwa Prudential", amount:2400000, type:"expense", category:"c9", account:"a1",
    frequency:"yearly", day:15, month:3, startDate:"2024-03-15", endDate:"2029-03-15",
    note:"Premi tahunan polis jiwa", tags:["asuransi","rutin"], active:true, lastRun:"2025-03-15" },
  { id:"r2", name:"Netflix & Spotify", amount:299000, type:"expense", category:"c7", account:"a1",
    frequency:"monthly", day:10, startDate:"2024-01-10", endDate:null,
    note:"Subscription bulanan", tags:["subscriptions","rutin"], active:true, lastRun:"2025-06-10" },
  { id:"r3", name:"Token Listrik", amount:650000, type:"expense", category:"c9", account:"a1",
    frequency:"monthly", day:15, startDate:"2024-01-15", endDate:null,
    note:"Token listrik bulanan", tags:["rutin","tagihan"], active:true, lastRun:"2025-06-15" },
];

const INITIAL_GOALS = [
  { id:"g1", name:"Dana Darurat 6 Bulan", target:72000000,  current:45000000, deadline:"2025-12-31", icon:"🛡️", color:"#10b981" },
  { id:"g2", name:"DP Rumah",             target:150000000, current:62000000, deadline:"2026-06-30", icon:"🏠", color:"#3b82f6" },
  { id:"g3", name:"Liburan Jepang",       target:25000000,  current:8500000,  deadline:"2025-09-01", icon:"✈️", color:"#8b5cf6" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = n => { if(Math.abs(n)>=1e9) return `Rp ${(n/1e9).toFixed(1)}M`; if(Math.abs(n)>=1e6) return `Rp ${(n/1e6).toFixed(1)}jt`; return `Rp ${Math.abs(n).toLocaleString("id-ID")}`; };
const fmtF = n => { const f=Math.abs(n).toLocaleString("id-ID"); return n<0?`-Rp ${f}`:`Rp ${f}`; };

function hexToRgb(hex) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ─── Financial Health Score ───────────────────────────────────────────────────
function computeHealthScore(transactions, accounts, goals) {
  const thisMonth   = transactions.filter(t=>t.date.startsWith("2025-06"));
  const income      = thisMonth.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense     = thisMonth.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const savings     = income - expense;
  const totalDebt   = Math.abs(accounts.filter(a=>a.balance<0).reduce((s,a)=>s+a.balance,0));
  const ccLimit     = accounts.filter(a=>a.type==="credit_card").reduce((s,a)=>s+a.limit,0);
  const ccUsed      = accounts.filter(a=>a.type==="credit_card").reduce((s,a)=>s+Math.abs(a.balance),0);
  const emergencyFund = accounts.filter(a=>a.type==="bank").reduce((s,a)=>s+a.balance,0);

  const savingRate  = income>0 ? (savings/income)*100 : 0;
  const efMonths    = expense>0 ? emergencyFund/expense : 0;
  const dti         = income>0 ? (totalDebt/(income*12))*100 : 100;
  const ccUtil      = ccLimit>0 ? (ccUsed/ccLimit)*100 : 0;
  const avgGoal     = goals.length>0 ? goals.reduce((s,g)=>s+(g.current/g.target),0)/goals.length*100 : 0;

  const savingScore = Math.min(30,(savingRate/20)*30);
  const efScore     = Math.min(25,(efMonths/6)*25);
  const dtiScore    = Math.max(0,20-(dti/40)*20);
  const ccScore     = Math.max(0,15-(ccUtil/30)*15);
  const goalScore   = Math.min(10,(avgGoal/100)*10);
  const total       = Math.round(savingScore+efScore+dtiScore+ccScore+goalScore);

  return {
    total,
    grade: total>=85?"A":total>=70?"B":total>=55?"C":total>=40?"D":"E",
    color: total>=85?"#10b981":total>=70?"#3b82f6":total>=55?"#f59e0b":total>=40?"#f97316":"#ef4444",
    label: total>=85?"Excellent 🌟":total>=70?"Bagus 👍":total>=55?"Cukup 📈":total>=40?"Perlu Perhatian ⚠️":"Kritis 🚨",
    breakdown: [
      { label:"Rasio Tabungan",  score:Math.round(savingScore), max:30, value:`${savingRate.toFixed(0)}%`,  tip:savingRate<20?"Targetkan menabung ≥20% dari penghasilan":"Rasio tabungan sangat baik!" },
      { label:"Dana Darurat",    score:Math.round(efScore),     max:25, value:`${efMonths.toFixed(1)}x`,   tip:efMonths<6?`Butuh ${fmt(Math.round((6-efMonths)*expense))} lagi untuk 6 bulan`:"Dana darurat sudah aman!" },
      { label:"Rasio Utang/DTI", score:Math.round(dtiScore),    max:20, value:`${dti.toFixed(0)}%`,        tip:dti>40?"Pertimbangkan pelunasan utang lebih cepat":"Debt-to-income dalam batas sehat" },
      { label:"Utilisasi KK",    score:Math.round(ccScore),     max:15, value:`${ccUtil.toFixed(0)}%`,     tip:ccUtil>30?"Kurangi penggunaan kartu kredit di bawah 30%":"Penggunaan kartu kredit aman" },
      { label:"Progress Target", score:Math.round(goalScore),   max:10, value:`${avgGoal.toFixed(0)}%`,    tip:avgGoal<50?"Tingkatkan alokasi ke tujuan finansial":"Terus pertahankan progres ini!" },
    ],
    savingRate, efMonths, dti, ccUtil, avgGoal,
  };
}

// ─── Health Score Widget ──────────────────────────────────────────────────────
function HealthScoreWidget({ score }) {
  const [expanded, setExpanded] = useState(false);
  const circumference = 2*Math.PI*40;
  const dash = (score.total/100)*circumference;

  return (
    <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
        <div>
          <h3 style={{margin:"0 0 2px",fontSize:"15px",fontWeight:700,color:"var(--text)"}}>💊 Financial Health Score</h3>
          <span style={{fontSize:"12px",fontWeight:700,color:score.color}}>{score.label}</span>
        </div>
        <button onClick={()=>setExpanded(!expanded)} style={{fontSize:"11px",padding:"5px 10px",borderRadius:"8px",border:"1px solid var(--border)",background:"transparent",color:"var(--text-muted)",cursor:"pointer",fontWeight:600}}>
          {expanded?"Tutup ▲":"Detail ▼"}
        </button>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
        {/* Ring gauge */}
        <div style={{position:"relative",flexShrink:0,width:"96px",height:"96px"}}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="var(--border)" strokeWidth="9"/>
            <circle cx="48" cy="48" r="40" fill="none" stroke={score.color} strokeWidth="9"
              strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
              transform="rotate(-90 48 48)" style={{transition:"stroke-dasharray 1.2s ease"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:"22px",fontWeight:900,color:score.color,lineHeight:1}}>{score.total}</span>
            <span style={{fontSize:"14px",fontWeight:800,color:score.color}}>{score.grade}</span>
          </div>
        </div>

        {/* Mini bars */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"8px"}}>
          {score.breakdown.map((b,i)=>(
            <div key={i}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                <span style={{fontSize:"10px",color:"var(--text-muted)",fontWeight:600}}>{b.label}</span>
                <span style={{fontSize:"10px",fontWeight:700,color:"var(--text)"}}>{b.score}/{b.max}</span>
              </div>
              <div style={{height:"5px",background:"var(--border)",borderRadius:"3px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(b.score/b.max)*100}%`,background:score.color,borderRadius:"3px",transition:"width 1s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded tips */}
      {expanded && (
        <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"12px"}}>
          <p style={{margin:"0 0 4px",fontSize:"12px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>Analisis Detail</p>
          {score.breakdown.map((b,i)=>{
            const pct=(b.score/b.max)*100;
            const status=pct>=80?"✅":pct>=50?"⚠️":"🔴";
            return(
              <div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start",padding:"10px",background:"var(--bg)",borderRadius:"12px"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"8px",background:`rgba(${hexToRgb(score.color)},0.15)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:"15px"}}>{status}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2px"}}>
                    <span style={{fontSize:"12px",fontWeight:700,color:"var(--text)"}}>{b.label}</span>
                    <span style={{fontSize:"12px",fontWeight:800,color:score.color}}>{b.value}</span>
                  </div>
                  <p style={{margin:0,fontSize:"11px",color:"var(--text-muted)",lineHeight:1.5}}>{b.tip}</p>
                </div>
              </div>
            );
          })}
          <div style={{padding:"10px 12px",background:`rgba(${hexToRgb(score.color)},0.1)`,borderRadius:"10px",border:`1px solid rgba(${hexToRgb(score.color)},0.3)`}}>
            <p style={{margin:0,fontSize:"11px",color:score.color,fontWeight:600,lineHeight:1.5}}>
              💡 Skor dihitung dari: rasio tabungan (30 poin), dana darurat (25 poin), rasio utang (20 poin), utilisasi kartu kredit (15 poin), dan progres target finansial (10 poin).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Expense Heatmap ──────────────────────────────────────────────────────────
function ExpenseHeatmap({ transactions, primaryColor }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const dailyExpense = useMemo(()=>{
    const map={};
    transactions.filter(t=>t.type==="expense"&&t.date.startsWith("2025-06")).forEach(t=>{
      const d=parseInt(t.date.split("-")[2]);
      map[d]=(map[d]||0)+t.amount;
    });
    return map;
  },[transactions]);

  const dailyTxns = useMemo(()=>{
    const map={};
    transactions.filter(t=>t.type==="expense"&&t.date.startsWith("2025-06")).forEach(t=>{
      const d=parseInt(t.date.split("-")[2]);
      if(!map[d]) map[d]=[];
      map[d].push(t);
    });
    return map;
  },[transactions]);

  const maxVal = Math.max(...Object.values(dailyExpense),1);
  const firstDow = new Date(2025,5,1).getDay();
  const daysInMonth = 30;
  const dayNames=["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

  const getOpacity = amt => {
    if(!amt) return 0.07;
    const i=amt/maxVal;
    if(i>0.7) return 0.95;
    if(i>0.4) return 0.65;
    if(i>0.15) return 0.38;
    return 0.18;
  };

  const cells=[];
  for(let i=0;i<firstDow;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  const topDays=Object.entries(dailyExpense).sort((a,b)=>b[1]-a[1]).slice(0,3);

  return (
    <div>
      {/* Day-of-week labels */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px",marginBottom:"5px"}}>
        {dayNames.map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:"9px",color:"var(--text-muted)",fontWeight:700}}>{d}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px",position:"relative"}}>
        {cells.map((day,i)=>{
          if(!day) return <div key={`e${i}`}/>;
          const amt=dailyExpense[day]||0;
          const isHov=hoveredDay===day;
          const rgb=hexToRgb(primaryColor);
          return(
            <div key={day}
              onMouseEnter={()=>setHoveredDay(day)}
              onMouseLeave={()=>setHoveredDay(null)}
              style={{
                position:"relative",aspectRatio:"1",borderRadius:"7px",
                background:`rgba(${rgb},${getOpacity(amt)})`,
                border:isHov?`2px solid ${primaryColor}`:"2px solid transparent",
                cursor:amt?"pointer":"default",
                transition:"all 0.15s",
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>
              <span style={{fontSize:"9px",color:amt>maxVal*0.5?"#fff":"var(--text-muted)",fontWeight:600,userSelect:"none"}}>{day}</span>
              {/* Tooltip */}
              {isHov && (
                <div style={{
                  position:"absolute",bottom:"115%",left:"50%",transform:"translateX(-50%)",
                  background:"var(--text)",color:"var(--card-bg)",
                  padding:"6px 10px",borderRadius:"8px",
                  fontSize:"11px",fontWeight:700,whiteSpace:"nowrap",
                  zIndex:50,pointerEvents:"none",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.2)"
                }}>
                  {amt>0 ? <>📅 {day} Jun<br/>{fmt(amt)}</> : `${day} Jun — Tidak ada pengeluaran`}
                  <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
                    width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",
                    borderTop:`5px solid var(--text)`}}/>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"5px",marginTop:"10px"}}>
        <span style={{fontSize:"10px",color:"var(--text-muted)"}}>Hemat</span>
        {[0.12,0.32,0.58,0.88].map((op,i)=>(
          <div key={i} style={{width:"13px",height:"13px",borderRadius:"4px",background:`rgba(${hexToRgb(primaryColor)},${op})`}}/>
        ))}
        <span style={{fontSize:"10px",color:"var(--text-muted)"}}>Boros</span>
      </div>

      {/* Top spending days */}
      {topDays.length>0 && (
        <div style={{marginTop:"14px",paddingTop:"14px",borderTop:"1px solid var(--border)"}}>
          <p style={{margin:"0 0 8px",fontSize:"11px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>🔥 Hari Pengeluaran Terbesar</p>
          {topDays.map(([day,amt])=>{
            const dayTxns=dailyTxns[parseInt(day)]||[];
            return(
              <div key={day} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:"10px",background:"var(--bg)",marginBottom:"5px"}}>
                <div>
                  <span style={{fontSize:"12px",fontWeight:700,color:"var(--text)"}}>📅 {day} Juni 2025</span>
                  <p style={{margin:"1px 0 0",fontSize:"10px",color:"var(--text-muted)"}}>{dayTxns.length} transaksi</p>
                </div>
                <span style={{fontSize:"13px",fontWeight:800,color:"#ef4444"}}>{fmt(amt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function ProgressBar({pct,color}) {
  return(
    <div style={{height:"8px",background:"var(--border)",borderRadius:"4px",overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:"4px",transition:"width 0.8s ease"}}/>
    </div>
  );
}

function PieChart({data,size=120}) {
  const total=data.reduce((s,d)=>s+d.value,0);
  if(!total) return null;
  let cum=0;
  const cx=size/2,cy=size/2,r=size*0.38,ir=size*0.22;
  const slices=data.map(d=>{
    const pct=d.value/total;
    const sa=cum*2*Math.PI-Math.PI/2; cum+=pct; const ea=cum*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const ix1=cx+ir*Math.cos(sa),iy1=cy+ir*Math.sin(sa),ix2=cx+ir*Math.cos(ea),iy2=cy+ir*Math.sin(ea);
    const la=pct>0.5?1:0;
    return{...d,path:`M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${la} 0 ${ix1} ${iy1} Z`};
  });
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={0.9}/>)}
    </svg>
  );
}

function BarChart({data}) {
  const max=Math.max(...data.map(d=>Math.max(d.income,d.expense)));
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:"4px",height:"80px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
          <div style={{display:"flex",gap:"2px",alignItems:"flex-end",height:"64px"}}>
            <div style={{width:"8px",height:`${(d.income/max)*60}px`,background:"#10b981",borderRadius:"2px 2px 0 0",minHeight:"2px"}}/>
            <div style={{width:"8px",height:`${(d.expense/max)*60}px`,background:"#ef4444",borderRadius:"2px 2px 0 0",minHeight:"2px"}}/>
          </div>
          <span style={{fontSize:"9px",color:"var(--text-muted)"}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Modal({title,onClose,children}) {
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",backdropFilter:"blur(4px)"}}>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",width:"100%",maxWidth:"480px",maxHeight:"90vh",overflow:"auto",boxShadow:"var(--shadow-xl)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px 16px",borderBottom:"1px solid var(--border)",marginBottom:"20px"}}>
          <span style={{fontWeight:700,fontSize:"16px",color:"var(--text)"}}>{title}</span>
          <button onClick={onClose} style={{background:"var(--bg)",border:"none",width:"32px",height:"32px",borderRadius:"8px",cursor:"pointer",color:"var(--text-muted)",fontSize:"16px"}}>✕</button>
        </div>
        <div style={{padding:"0 24px 24px"}}>{children}</div>
      </div>
    </div>
  );
}


// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({message, onConfirm, onCancel}) {
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",backdropFilter:"blur(4px)"}}>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",width:"100%",maxWidth:"320px",padding:"24px",boxShadow:"var(--shadow-xl)",textAlign:"center"}}>
        <div style={{fontSize:"36px",marginBottom:"12px"}}>🗑️</div>
        <p style={{margin:"0 0 20px",fontSize:"15px",fontWeight:600,color:"var(--text)",lineHeight:1.5}}>{message}</p>
        <div style={{display:"flex",gap:"10px"}}>
          <button onClick={onCancel}
            style={{flex:1,padding:"12px",borderRadius:"12px",border:"1.5px solid var(--border)",background:"transparent",color:"var(--text-muted)",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>
            Batal
          </button>
          <button onClick={onConfirm}
            style={{flex:1,padding:"12px",borderRadius:"12px",border:"none",background:"#ef4444",color:"#fff",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({onLogin}) {
  const [loading,setLoading]=useState(false);
  const handle=()=>{setLoading(true);setTimeout(()=>{onLogin();setLoading(false);},1200);};
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{width:"100%",maxWidth:"400px"}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <div style={{fontSize:"48px",marginBottom:"12px"}}>💰</div>
          <h1 style={{fontSize:"28px",fontWeight:800,color:"var(--text)",margin:"0 0 8px",letterSpacing:"-0.5px"}}>FinanceKu</h1>
          <p style={{color:"var(--text-muted)",fontSize:"14px",margin:0}}>Kelola keuangan pribadi dengan cerdas</p>
        </div>
        <div style={{background:"var(--card-bg)",borderRadius:"24px",padding:"32px",boxShadow:"var(--shadow)"}}>
          {["Email","Password"].map(l=>(
            <div key={l} style={{marginBottom:l==="Email"?"16px":"24px"}}>
              <label style={{fontSize:"13px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>{l}</label>
              <input type={l==="Password"?"password":"email"} defaultValue={l==="Email"?"budi@example.com":"password123"} style={{width:"100%",padding:"12px 14px",borderRadius:"12px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
            </div>
          ))}
          <button onClick={handle} style={{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"Masuk...":"Masuk →"}
          </button>
          <p style={{textAlign:"center",marginTop:"16px",fontSize:"13px",color:"var(--text-muted)"}}>Demo: gunakan email & password apapun</p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const {transactions,accounts,categories,goals,primaryColor}=useContext(AppContext);

  const totalAssets      =accounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0);
  const totalLiabilities =Math.abs(accounts.filter(a=>a.balance<0).reduce((s,a)=>s+a.balance,0));
  const netWorth         =totalAssets-totalLiabilities;
  const thisMonth        =transactions.filter(t=>t.date.startsWith("2025-06"));
  const monthIncome      =thisMonth.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const monthExpense     =thisMonth.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const creditCards      =accounts.filter(a=>a.type==="credit_card");
  const healthScore      =computeHealthScore(transactions,accounts,goals);

  const expenseByCat=categories
    .filter(c=>c.type==="expense")
    .map(c=>({name:c.name,value:thisMonth.filter(t=>t.type==="expense"&&t.category===c.id).reduce((s,t)=>s+t.amount,0),color:c.color,icon:c.icon}))
    .filter(c=>c.value>0).sort((a,b)=>b.value-a.value);

  const barData=[
    {label:"Mar",income:11500000,expense:4200000},{label:"Apr",income:14200000,expense:5100000},
    {label:"Mei",income:12800000,expense:3900000},{label:"Jun",income:monthIncome,expense:monthExpense},
  ];

  return(
    <div style={{padding:"0 0 80px"}}>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg, var(--primary), var(--primary-dark))",borderRadius:"0 0 28px 28px",padding:"24px 20px 28px",color:"#fff",marginBottom:"20px"}}>
        <p style={{fontSize:"12px",opacity:0.8,margin:"0 0 4px",letterSpacing:"1px",textTransform:"uppercase"}}>Total Net Worth</p>
        <h2 style={{fontSize:"32px",fontWeight:800,margin:"0 0 16px",letterSpacing:"-1px"}}>{fmtF(netWorth)}</h2>
        <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
          {[["↑ Aset",fmt(totalAssets),null],["↓ Utang",fmt(totalLiabilities),null],["💰 Bulan Ini",(monthIncome>monthExpense?"+":"-")+fmt(Math.abs(monthIncome-monthExpense)),monthIncome>monthExpense?"#86efac":"#fca5a5"]].map(([l,v,c])=>(
            <div key={l}><p style={{fontSize:"11px",opacity:0.7,margin:"0 0 2px"}}>{l}</p><p style={{fontSize:"15px",fontWeight:700,margin:0,color:c||"#fff"}}>{v}</p></div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:"16px"}}>

        {/* ── Financial Health Score ── */}
        <HealthScoreWidget score={healthScore}/>

        {/* Pie chart */}
        <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
            <h3 style={{margin:0,fontSize:"15px",fontWeight:700,color:"var(--text)"}}>Pengeluaran Juni</h3>
            <span style={{fontSize:"13px",fontWeight:700,color:"#ef4444"}}>-{fmt(monthExpense)}</span>
          </div>
          <div style={{display:"flex",gap:"16px",alignItems:"center"}}>
            <PieChart data={expenseByCat} size={110}/>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:"8px"}}>
              {expenseByCat.slice(0,4).map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <div style={{width:"8px",height:"8px",borderRadius:"2px",background:c.color,flexShrink:0}}/>
                  <span style={{fontSize:"12px",color:"var(--text-muted)",flex:1}}>{c.icon} {c.name}</span>
                  <span style={{fontSize:"12px",fontWeight:600,color:"var(--text)"}}>{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Expense Heatmap ── */}
        <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
            <h3 style={{margin:0,fontSize:"15px",fontWeight:700,color:"var(--text)"}}>🔥 Heatmap Pengeluaran</h3>
            <span style={{fontSize:"11px",color:"var(--text-muted)",background:"var(--bg)",padding:"3px 8px",borderRadius:"6px",fontWeight:600}}>Juni 2025</span>
          </div>
          <p style={{margin:"0 0 14px",fontSize:"11px",color:"var(--text-muted)"}}>Hover pada tanggal untuk detail. Makin gelap = makin boros.</p>
          <ExpenseHeatmap transactions={transactions} primaryColor={primaryColor}/>
        </div>

        {/* Bar chart */}
        <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <h3 style={{margin:0,fontSize:"15px",fontWeight:700,color:"var(--text)"}}>Tren 4 Bulan</h3>
            <div style={{display:"flex",gap:"12px"}}>
              {[["#10b981","Masuk"],["#ef4444","Keluar"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:"4px"}}><div style={{width:"8px",height:"8px",borderRadius:"2px",background:c}}/><span style={{fontSize:"11px",color:"var(--text-muted)"}}>{l}</span></div>
              ))}
            </div>
          </div>
          <BarChart data={barData}/>
        </div>

        {/* Goals */}
        <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
          <h3 style={{margin:"0 0 16px",fontSize:"15px",fontWeight:700,color:"var(--text)"}}>🎯 Target Finansial</h3>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            {goals.map(g=>{
              const pct=(g.current/g.target)*100;
              return(
                <div key={g.id}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                    <span style={{fontSize:"13px",fontWeight:600,color:"var(--text)"}}>{g.icon} {g.name}</span>
                    <span style={{fontSize:"12px",color:"var(--text-muted)"}}>{pct.toFixed(0)}%</span>
                  </div>
                  <ProgressBar pct={pct} color={g.color}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
                    <span style={{fontSize:"11px",color:"var(--text-muted)"}}>{fmt(g.current)}</span>
                    <span style={{fontSize:"11px",color:"var(--text-muted)"}}>{fmt(g.target)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credit cards */}
        {creditCards.length>0&&(
          <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
            <h3 style={{margin:"0 0 16px",fontSize:"15px",fontWeight:700,color:"var(--text)"}}>💳 Kartu Kredit</h3>
            {creditCards.map(cc=>{
              const used=Math.abs(cc.balance),pct=(used/cc.limit)*100;
              return(
                <div key={cc.id} style={{background:`linear-gradient(135deg,${cc.color}22,${cc.color}11)`,border:`1px solid ${cc.color}33`,borderRadius:"14px",padding:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}>
                    <span style={{fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{cc.name}</span>
                    <span style={{fontSize:"11px",color:"#ef4444",fontWeight:600}}>Jatuh tempo: tgl {cc.due_date}</span>
                  </div>
                  <ProgressBar pct={pct} color={cc.color}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
                    <span style={{fontSize:"12px",color:"var(--text-muted)"}}>Terpakai: {fmt(used)}</span>
                    <span style={{fontSize:"12px",color:"var(--text-muted)"}}>Limit: {fmt(cc.limit)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent txns */}
        <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
          <h3 style={{margin:"0 0 16px",fontSize:"15px",fontWeight:700,color:"var(--text)"}}>Transaksi Terbaru</h3>
          {transactions.slice(0,5).map(t=>{
            const cat=INITIAL_CATEGORIES.find(c=>c.id===t.category)||{};
            return(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{width:"38px",height:"38px",borderRadius:"10px",background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:"13px",fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.note}</p>
                  <p style={{margin:0,fontSize:"11px",color:"var(--text-muted)"}}>{cat.name} • {t.date}</p>
                </div>
                <span style={{fontSize:"13px",fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444",flexShrink:0}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────
function TransactionForm({onSave,onClose,initial}) {
  const {categories,accounts}=useContext(AppContext);
  const [form,setForm]=useState(initial||{amount:"",type:"expense",category:"c4",account:"a1",date:new Date().toISOString().split("T")[0],note:"",tags:""});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filteredCats=categories.filter(c=>c.type===form.type);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      <div style={{display:"flex",background:"var(--bg)",borderRadius:"12px",padding:"4px"}}>
        {["expense","income"].map(t=>(
          <button key={t} onClick={()=>{set("type",t);set("category",t==="expense"?"c4":"c1");}} style={{flex:1,padding:"8px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:600,fontSize:"13px",background:form.type===t?(t==="income"?"#10b981":"#ef4444"):"transparent",color:form.type===t?"#fff":"var(--text-muted)"}}>
            {t==="expense"?"💸 Pengeluaran":"💰 Pemasukan"}
          </button>
        ))}
      </div>
      {[{l:"Nominal (Rp)",k:"amount",t:"number",p:"0"},{l:"Keterangan",k:"note",t:"text",p:"Tambah catatan..."},{l:"Tanggal",k:"date",t:"date"},{l:"Tags (pisah koma)",k:"tags",t:"text",p:"rutin, kebutuhan..."}].map(f=>(
        <div key={f.k}>
          <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
          <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type={f.t} placeholder={f.p} style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        </div>
      ))}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Kategori</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
          {filteredCats.map(c=>(
            <button key={c.id} onClick={()=>set("category",c.id)} style={{padding:"6px 12px",borderRadius:"8px",border:`1.5px solid ${form.category===c.id?c.color:"var(--border)"}`,background:form.category===c.id?`${c.color}22`:"transparent",cursor:"pointer",fontSize:"12px",fontWeight:600,color:form.category===c.id?c.color:"var(--text-muted)"}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Akun</label>
        <select value={form.account} onChange={e=>set("account",e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px"}}>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <button onClick={()=>onSave(form)} style={{padding:"13px",borderRadius:"12px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",marginTop:"4px"}}>
        {initial?"Update Transaksi":"Simpan Transaksi"}
      </button>
    </div>
  );
}

function TransactionsPage() {
  const {transactions,setTransactions,categories}=useContext(AppContext);
  const [showModal,setShowModal]=useState(false);
  const [editTx,setEditTx]=useState(null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [confirmId,setConfirmId]=useState(null);
  const filtered=transactions.filter(t=>filter==="all"||t.type===filter).filter(t=>!search||t.note.toLowerCase().includes(search.toLowerCase()));
  const save=form=>{
    const tx={...form,id:editTx?editTx.id:`t${Date.now()}`,amount:parseFloat(form.amount)||0};
    if(editTx) setTransactions(p=>p.map(t=>t.id===tx.id?tx:t));
    else setTransactions(p=>[tx,...p]);
    setShowModal(false);setEditTx(null);
  };
  const del=id=>setConfirmId(id);
  const doDelete=()=>{setTransactions(p=>p.filter(t=>t.id!==confirmId));setConfirmId(null);};
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <h2 style={{margin:"0 0 16px",fontSize:"20px",fontWeight:800,color:"var(--text)"}}>Transaksi</h2>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari transaksi..." style={{width:"100%",padding:"11px 14px",borderRadius:"12px",border:"1.5px solid var(--border)",background:"var(--card-bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box",marginBottom:"12px"}}/>
      <div style={{display:"flex",background:"var(--card-bg)",borderRadius:"12px",padding:"3px",marginBottom:"16px",boxShadow:"var(--shadow)"}}>
        {[["all","Semua"],["income","Pemasukan"],["expense","Pengeluaran"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{flex:1,padding:"7px 4px",borderRadius:"9px",border:"none",cursor:"pointer",fontWeight:600,fontSize:"12px",background:filter===v?"var(--primary)":"transparent",color:filter===v?"#fff":"var(--text-muted)"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {filtered.map(t=>{
          const cat=categories.find(c=>c.id===t.category)||{};
          return(
            <div key={t.id} style={{background:"var(--card-bg)",borderRadius:"14px",padding:"14px",display:"flex",alignItems:"center",gap:"12px",boxShadow:"var(--shadow)"}}>
              <div style={{width:"40px",height:"40px",borderRadius:"10px",background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0}}>{cat.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:0,fontSize:"13px",fontWeight:600,color:"var(--text)"}}>{t.note||cat.name}</p>
                <p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--text-muted)"}}>{cat.name} • {t.date}</p>
                {t.tags&&<div style={{display:"flex",gap:"4px",marginTop:"4px",flexWrap:"wrap"}}>
                  {(Array.isArray(t.tags)?t.tags:t.tags.split(",")).map((tag,i)=>(
                    <span key={i} style={{fontSize:"10px",padding:"1px 7px",borderRadius:"6px",background:"var(--primary)22",color:"var(--primary)",fontWeight:600}}>#{tag.trim()}</span>
                  ))}
                </div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{margin:"0 0 4px",fontSize:"14px",fontWeight:700,color:t.type==="income"?"#10b981":"#ef4444"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</p>
                <div style={{display:"flex",gap:"4px",justifyContent:"flex-end"}}>
                  <button onClick={()=>{setEditTx(t);setShowModal(true);}} style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:"11px",color:"var(--text-muted)"}}>✏️</button>
                  <button onClick={()=>del(t.id)} style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid #ef444433",background:"#ef444411",cursor:"pointer",fontSize:"11px",color:"#ef4444"}}>🗑️</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal&&<Modal title={editTx?"Edit Transaksi":"Tambah Transaksi"} onClose={()=>{setShowModal(false);setEditTx(null);}}>
        <TransactionForm onSave={save} onClose={()=>{setShowModal(false);setEditTx(null);}} initial={editTx}/>
      </Modal>}
      {confirmId&&<ConfirmDialog message="Hapus transaksi ini?" onConfirm={doDelete} onCancel={()=>setConfirmId(null)}/> }
    </div>
  );
}

// ─── IDX Stock Widget (TradingView embed + Portfolio tracker) ────────────────
const IDX_WATCHLIST = ["BBCA","BBRI","TLKM","ASII","BMRI","GOTO","BYAN","UNVR","ICBP","PGAS"];

// Current IDX prices (updated per market close — auto-refresh via TradingView)
const IDX_PRICES = {
  BBCA:5950, BBRI:3160, TLKM:2900, BMRI:4510, ASII:5750,
  GOTO:71,   BYAN:18500,UNVR:2290, ICBP:8200, PGAS:1635,
  BBNI:2720, BRIS:1835, ADMR:3180, SMGR:4090, INDF:5775,
};

function TradingViewWidget({ symbol }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `IDX:${symbol}`,
      width: "100%",
      height: 220,
      locale: "id",
      dateRange: "1D",
      colorTheme: "light",
      isTransparent: true,
      autosize: true,
      largeChartUrl: `https://www.tradingview.com/chart/?symbol=IDX:${symbol}`,
    });
    ref.current.appendChild(script);
  }, [symbol]);
  return <div ref={ref} className="tradingview-widget-container" style={{width:"100%",height:"220px"}}/>;
}

function StockWidget() {
  const [portfolio, setPortfolio] = useState([
    {ticker:"BBCA", lot:10, avgPrice:7500},
    {ticker:"TLKM", lot:20, avgPrice:3200},
    {ticker:"BMRI", lot:15, avgPrice:5000},
  ]);
  const [showAddStock, setShowAddStock]   = useState(false);
  const [newStock, setNewStock]           = useState({ticker:"",lot:"",avgPrice:""});
  const [confirmStock, setConfirmStock]   = useState(null);
  const [activeChart, setActiveChart]     = useState("BBCA");
  const [tab, setTab]                     = useState("portfolio"); // "portfolio" | "chart" | "watchlist"

  const getPrice = (ticker) => IDX_PRICES[ticker] || 0;

  const portfolioValue = portfolio.reduce((s,p) => s + getPrice(p.ticker)*p.lot*100, 0);
  const portfolioCost  = portfolio.reduce((s,p) => s + p.avgPrice*p.lot*100, 0);
  const portfolioPnL   = portfolioValue - portfolioCost;
  const portfolioPct   = portfolioCost > 0 ? (portfolioPnL/portfolioCost)*100 : 0;

  const addStock = () => {
    if(!newStock.ticker||!newStock.lot) return;
    setPortfolio(p=>[...p,{ticker:newStock.ticker.toUpperCase(),lot:parseInt(newStock.lot)||0,avgPrice:parseFloat(newStock.avgPrice)||0}]);
    setNewStock({ticker:"",lot:"",avgPrice:""});
    setShowAddStock(false);
  };

  return(
    <div style={{background:"var(--card-bg)",borderRadius:"20px",overflow:"hidden",boxShadow:"var(--shadow)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1e293b,#0f172a)",padding:"16px 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
          <div>
            <p style={{margin:0,fontSize:"11px",color:"#94a3b8",letterSpacing:"1px",textTransform:"uppercase"}}>Portofolio Saham IDX</p>
            <p style={{margin:"4px 0 0",fontSize:"24px",fontWeight:800,color:"#f1f5f9"}}>{fmt(portfolioValue)}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{margin:0,fontSize:"12px",fontWeight:700,color:portfolioPnL>=0?"#10b981":"#ef4444"}}>
              {portfolioPnL>=0?"+":""}{fmt(portfolioPnL)}
            </p>
            <p style={{margin:"2px 0 0",fontSize:"11px",color:portfolioPnL>=0?"#10b981":"#ef4444"}}>
              ({portfolioPct>=0?"+":""}{portfolioPct.toFixed(1)}%)
            </p>
          </div>
        </div>
        {/* Tab switcher */}
        <div style={{display:"flex",gap:"6px"}}>
          {[["portfolio","📊 Portfolio"],["chart","📈 Chart Live"],["watchlist","👁 Watchlist"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)}
              style={{padding:"5px 10px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:600,
                background:tab===v?"rgba(255,255,255,0.2)":"transparent",
                color:tab===v?"#fff":"#64748b"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Tab */}
      {tab==="portfolio"&&(
        <div style={{padding:"12px 16px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <p style={{margin:0,fontSize:"12px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>Holdings</p>
            <button onClick={()=>setShowAddStock(!showAddStock)}
              style={{fontSize:"11px",padding:"4px 10px",borderRadius:"7px",border:"1px solid var(--border)",background:"transparent",color:"var(--primary)",fontWeight:700,cursor:"pointer"}}>
              + Saham
            </button>
          </div>

          {showAddStock&&(
            <div style={{background:"var(--bg)",borderRadius:"12px",padding:"12px",marginBottom:"10px",display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"flex-end"}}>
              {[{p:"Ticker",k:"ticker",w:"80px"},{p:"Lot",k:"lot",w:"60px"},{p:"Harga Beli",k:"avgPrice",w:"95px"}].map(f=>(
                <div key={f.k}>
                  <p style={{margin:"0 0 4px",fontSize:"10px",color:"var(--text-muted)",fontWeight:600}}>{f.p}</p>
                  <input placeholder={f.p} value={newStock[f.k]} onChange={e=>setNewStock(p=>({...p,[f.k]:e.target.value}))}
                    style={{width:f.w,padding:"7px 9px",borderRadius:"8px",border:"1.5px solid var(--border)",background:"var(--card-bg)",color:"var(--text)",fontSize:"12px"}}/>
                </div>
              ))}
              <button onClick={addStock}
                style={{padding:"7px 14px",borderRadius:"8px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>
                Tambah
              </button>
            </div>
          )}

          {portfolio.length===0?(
            <p style={{textAlign:"center",padding:"20px",color:"var(--text-muted)",fontSize:"13px"}}>Belum ada saham — tap + Saham</p>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"1px"}}>
              {portfolio.map(p=>{
                const price  = getPrice(p.ticker);
                const mktVal = price*p.lot*100;
                const cost   = p.avgPrice*p.lot*100;
                const pnl    = mktVal-cost;
                const pct    = cost>0?(pnl/cost)*100:0;
                return(
                  <div key={p.ticker}
                    onClick={()=>{setActiveChart(p.ticker);setTab("chart");}}
                    style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"9px",background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:"9px",fontWeight:800,color:"#93c5fd"}}>{p.ticker}</span>
                    </div>
                    <div style={{flex:1}}>
                      <p style={{margin:0,fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{p.ticker}</p>
                      <p style={{margin:0,fontSize:"10px",color:"var(--text-muted)"}}>{p.lot} lot · avg {p.avgPrice.toLocaleString("id-ID")}</p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{margin:0,fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{fmt(mktVal)}</p>
                      <p style={{margin:0,fontSize:"11px",fontWeight:600,color:pnl>=0?"#10b981":"#ef4444"}}>
                        {pnl>=0?"+":""}{fmt(pnl)} ({pct>=0?"+":""}{pct.toFixed(1)}%)
                      </p>
                    </div>
                    <button onClick={e=>{e.stopPropagation();setConfirmStock(p.ticker);}}
                      style={{width:"26px",height:"26px",borderRadius:"6px",border:"1px solid #ef444433",background:"#ef444411",cursor:"pointer",fontSize:"11px",color:"#ef4444",flexShrink:0}}>
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p style={{margin:"12px 0 0",fontSize:"10px",color:"var(--text-muted)",textAlign:"center"}}>
            💡 Tap nama saham untuk lihat chart live • Harga IDX diperbarui harian
          </p>
        </div>
      )}

      {/* Chart Tab — TradingView Live */}
      {tab==="chart"&&(
        <div style={{padding:"12px 16px 16px"}}>
          {/* Ticker selector */}
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"12px"}}>
            {[...new Set([...portfolio.map(p=>p.ticker),...IDX_WATCHLIST.slice(0,5)])].map(t=>(
              <button key={t} onClick={()=>setActiveChart(t)}
                style={{padding:"4px 10px",borderRadius:"7px",border:`1.5px solid ${activeChart===t?"var(--primary)":"var(--border)"}`,
                  background:activeChart===t?"var(--primary)22":"transparent",
                  cursor:"pointer",fontSize:"11px",fontWeight:700,
                  color:activeChart===t?"var(--primary)":"var(--text-muted)"}}>
                {t}
              </button>
            ))}
          </div>
          {/* TradingView Widget */}
          <div style={{borderRadius:"12px",overflow:"hidden",border:"1px solid var(--border)"}}>
            <TradingViewWidget symbol={activeChart}/>
          </div>
          <p style={{margin:"8px 0 0",fontSize:"10px",color:"var(--text-muted)",textAlign:"center"}}>
            📈 Data real-time dari TradingView • Tap nama saham untuk switch chart
          </p>
        </div>
      )}

      {/* Watchlist Tab */}
      {tab==="watchlist"&&(
        <div style={{padding:"12px 16px 16px"}}>
          <p style={{margin:"0 0 10px",fontSize:"12px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>
            Harga IDX (per penutupan terakhir)
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
            {IDX_WATCHLIST.filter(t=>IDX_PRICES[t]).map(t=>(
              <div key={t}
                onClick={()=>{setActiveChart(t);setTab("chart");}}
                style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 10px",background:"var(--bg)",borderRadius:"10px",cursor:"pointer"}}>
                <span style={{fontSize:"12px",fontWeight:800,color:"var(--text)",width:"48px",flexShrink:0}}>{t}</span>
                <span style={{fontSize:"13px",fontWeight:700,color:"var(--text)",flex:1}}>{(IDX_PRICES[t]||0).toLocaleString("id-ID")}</span>
                <span style={{fontSize:"11px",color:"var(--text-muted)"}}>Tap untuk chart →</span>
              </div>
            ))}
          </div>
          <p style={{margin:"12px 0 0",fontSize:"10px",color:"var(--text-muted)",textAlign:"center"}}>
            Tap saham manapun untuk lihat chart live di TradingView
          </p>
        </div>
      )}

      {confirmStock&&<ConfirmDialog
        message={`Hapus saham ${confirmStock} dari portofolio?`}
        onConfirm={()=>{setPortfolio(p=>p.filter(s=>s.ticker!==confirmStock));setConfirmStock(null);}}
        onCancel={()=>setConfirmStock(null)}
      />}
    </div>
  );
}


// ─── Account Form ─────────────────────────────────────────────────────────────
const ACCOUNT_TYPES = [
  {value:"bank",       label:"🏦 Rekening Bank",   color:"#3b82f6"},
  {value:"ewallet",    label:"💜 E-Wallet",         color:"#8b5cf6"},
  {value:"credit_card",label:"💳 Kartu Kredit",    color:"#f59e0b"},
  {value:"investment", label:"📈 Investasi/Saham",  color:"#10b981"},
  {value:"loan",       label:"🏧 Pinjaman/Utang",   color:"#ef4444"},
  {value:"property",   label:"🏠 Properti",         color:"#06b6d4"},
  {value:"vehicle",    label:"🚗 Kendaraan",        color:"#f97316"},
  {value:"cash",       label:"💵 Kas/Tunai",        color:"#84cc16"},
];
const ACC_COLORS=["#3b82f6","#10b981","#8b5cf6","#f59e0b","#ec4899","#14b8a6","#f97316","#ef4444","#06b6d4","#84cc16"];

function AccountForm({onSave, initial}) {
  const empty={name:"",type:"bank",balance:"",limit:"",billing_date:"",due_date:"",color:"#3b82f6",note:""};
  const [form,setForm]=useState(()=>{
    if(!initial) return empty;
    return {
      ...empty, ...initial,
      balance:      String(initial.balance!=null ? Math.abs(initial.balance) : ""),
      limit:        String(initial.limit!=null ? initial.limit : ""),
      billing_date: String(initial.billing_date!=null ? initial.billing_date : ""),
      due_date:     String(initial.due_date!=null ? initial.due_date : ""),
    };
  });
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const isCreditCard = form.type==="credit_card";
  const isLiability  = ["credit_card","loan"].includes(form.type);
  const handleSave=(e)=>{
    e && e.stopPropagation();
    if(!form.name.trim()){ alert("Nama akun wajib diisi!"); return; }
    onSave(form);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {/* Type selector */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Jenis Akun</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px"}}>
          {ACCOUNT_TYPES.map(t=>(
            <button key={t.value} onClick={()=>{set("type",t.value);set("color",t.color);}}
              style={{padding:"8px 10px",borderRadius:"10px",border:`1.5px solid ${form.type===t.value?t.color:"var(--border)"}`,background:form.type===t.value?`${t.color}22`:"transparent",cursor:"pointer",fontSize:"12px",fontWeight:600,color:form.type===t.value?t.color:"var(--text-muted)",textAlign:"left"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Warna</label>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {ACC_COLORS.map(c=>(
            <button key={c} onClick={()=>set("color",c)}
              style={{width:"28px",height:"28px",borderRadius:"8px",background:c,border:`3px solid ${form.color===c?c:"transparent"}`,cursor:"pointer",transform:form.color===c?"scale(1.15)":"scale(1)",transition:"transform 0.15s"}}/>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Nama Akun</label>
        <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Contoh: BCA Tabungan"
          style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
      </div>

      {/* Balance */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>
          {isLiability?"Saldo Terutang (Rp)":"Saldo / Nilai (Rp)"}
        </label>
        <input value={form.balance} onChange={e=>set("balance",e.target.value)} type="number" placeholder="0"
          style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        {isLiability&&<p style={{margin:"4px 0 0",fontSize:"11px",color:"#f97316"}}>⚠️ Nilai akan disimpan sebagai negatif (liabilitas)</p>}
      </div>

      {/* Credit card extras */}
      {isCreditCard&&(
        <>
          <div>
            <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Limit Kartu (Rp)</label>
            <input value={form.limit} onChange={e=>set("limit",e.target.value)} type="number" placeholder="20000000"
              style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:"10px"}}>
            {[{l:"Tgl Cetak Tagihan",k:"billing_date",p:"25"},{l:"Tgl Jatuh Tempo",k:"due_date",p:"10"}].map(f=>(
              <div key={f.k} style={{flex:1}}>
                <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
                <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type="number" placeholder={f.p} min="1" max="31"
                  style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
        </>
      )}

      <button onClick={handleSave}
        style={{padding:"13px",borderRadius:"12px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",marginTop:"4px"}}>
        {initial?"Simpan Perubahan":"Tambah Akun"}
      </button>
    </div>
  );
}

// ─── Accounts ─────────────────────────────────────────────────────────────────
function AccountsPage() {
  const {accounts,setAccounts}=useContext(AppContext);
  const [modal,setModal]     = useState(null); // null|"add"|"edit"
  const [selected,setSelected] = useState(null);

  const banks  = accounts.filter(a=>a.type==="bank"||a.type==="cash"||a.type==="ewallet");
  const ccs    = accounts.filter(a=>a.type==="credit_card");
  const loans  = accounts.filter(a=>a.type==="loan");
  const invs   = accounts.filter(a=>a.type==="investment");
  const assets = accounts.filter(a=>["property","vehicle"].includes(a.type));

  const totalAset = accounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0);
  const totalUtang= Math.abs(accounts.filter(a=>a.balance<0).reduce((s,a)=>s+a.balance,0));

  const saveAccount = form => {
    const isLiability = ["credit_card","loan"].includes(form.type);
    const bal = parseFloat(form.balance)||0;
    const acc = {
      ...form,
      id: selected?selected.id:`a${Date.now()}`,
      balance: isLiability ? -Math.abs(bal) : Math.abs(bal),
      limit: parseFloat(form.limit)||undefined,
      billing_date: parseInt(form.billing_date)||undefined,
      due_date: parseInt(form.due_date)||undefined,
    };
    if(selected) setAccounts(p=>p.map(a=>a.id===acc.id?acc:a));
    else setAccounts(p=>[...p,acc]);
    setModal(null); setSelected(null);
  };

  const [confirmAccId,setConfirmAccId]=useState(null);
  const delAccount = id => setConfirmAccId(id);
  const doDeleteAcc = () => {setAccounts(p=>p.filter(a=>a.id!==confirmAccId));setConfirmAccId(null);};

  const ActionBtns = ({a}) => (
    <div style={{display:"flex",gap:"4px",marginTop:"8px",justifyContent:"flex-end"}}>
      <button onClick={()=>{setSelected(a);setModal("edit");}}
        style={{padding:"3px 9px",borderRadius:"6px",border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:"11px",color:"var(--text-muted)"}}>✏️ Edit</button>
      <button onClick={()=>delAccount(a.id)}
        style={{padding:"3px 9px",borderRadius:"6px",border:"1px solid #ef444433",background:"#ef444411",cursor:"pointer",fontSize:"11px",color:"#ef4444"}}>🗑️ Hapus</button>
    </div>
  );

  const SectionHeader = ({title, onAdd}) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 0 10px"}}>
      <h3 style={{margin:0,fontSize:"13px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>{title}</h3>
      <button onClick={onAdd} style={{fontSize:"11px",padding:"4px 10px",borderRadius:"7px",border:"1px solid var(--border)",background:"transparent",color:"var(--primary)",fontWeight:700,cursor:"pointer"}}>+ Tambah</button>
    </div>
  );

  return(
    <div style={{padding:"16px 16px 80px"}}>
      {/* Summary */}
      <div style={{background:"linear-gradient(135deg,var(--primary),var(--primary-dark))",borderRadius:"18px",padding:"16px 18px",marginBottom:"20px",color:"#fff"}}>
        <p style={{margin:"0 0 8px",fontSize:"12px",opacity:0.8,textTransform:"uppercase",letterSpacing:"1px"}}>Ringkasan Aset & Liabilitas</p>
        <div style={{display:"flex",gap:"0",justifyContent:"space-between"}}>
          <div><p style={{margin:0,fontSize:"11px",opacity:0.7}}>Total Aset</p><p style={{margin:0,fontSize:"18px",fontWeight:800}}>{fmt(totalAset)}</p></div>
          <div style={{textAlign:"center"}}><p style={{margin:0,fontSize:"20px",opacity:0.4}}>−</p></div>
          <div><p style={{margin:0,fontSize:"11px",opacity:0.7}}>Total Utang</p><p style={{margin:0,fontSize:"18px",fontWeight:800}}>{fmt(totalUtang)}</p></div>
          <div style={{textAlign:"center"}}><p style={{margin:0,fontSize:"20px",opacity:0.4}}>=</p></div>
          <div style={{textAlign:"right"}}><p style={{margin:0,fontSize:"11px",opacity:0.7}}>Net Worth</p><p style={{margin:0,fontSize:"18px",fontWeight:800}}>{fmt(totalAset-totalUtang)}</p></div>
        </div>
      </div>

      {/* Rekening & Kas */}
      {(banks.length>0||true)&&(
        <div style={{marginBottom:"20px"}}>
          <SectionHeader title="🏦 Rekening & Kas" onAdd={()=>{setSelected(null);setModal("add");}}/>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {banks.map(a=>(
              <div key={a.id} style={{background:"var(--card-bg)",borderRadius:"14px",padding:"14px",boxShadow:"var(--shadow)",borderLeft:`4px solid ${a.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{a.name}</p><p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--text-muted)"}}>{ACCOUNT_TYPES.find(t=>t.value===a.type)?.label||"Bank"}</p></div>
                  <p style={{margin:0,fontSize:"16px",fontWeight:800,color:"#10b981"}}>{fmtF(a.balance)}</p>
                </div>
                <ActionBtns a={a}/>
              </div>
            ))}
            {banks.length===0&&<p style={{fontSize:"13px",color:"var(--text-muted)",textAlign:"center",padding:"12px 0"}}>Belum ada rekening — tap + Tambah</p>}
          </div>
        </div>
      )}

      {/* Investasi + Saham */}
      <div style={{marginBottom:"20px"}}>
        <SectionHeader title="📈 Investasi" onAdd={()=>{setSelected(null);setModal("add");}}/>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"12px"}}>
          {invs.map(a=>(
            <div key={a.id} style={{background:"var(--card-bg)",borderRadius:"14px",padding:"14px",boxShadow:"var(--shadow)",borderLeft:`4px solid ${a.color}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{a.name}</p><p style={{margin:"2px 0 0",fontSize:"11px",color:"#10b981"}}>📈 Portofolio Investasi</p></div>
                <p style={{margin:0,fontSize:"16px",fontWeight:800,color:"#8b5cf6"}}>{fmtF(a.balance)}</p>
              </div>
              <ActionBtns a={a}/>
            </div>
          ))}
        </div>
        {/* Real-time stock widget */}
        <StockWidget/>
      </div>

      {/* Aset Fisik */}
      {assets.length>0&&(
        <div style={{marginBottom:"20px"}}>
          <SectionHeader title="🏠 Aset Fisik" onAdd={()=>{setSelected(null);setModal("add");}}/>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {assets.map(a=>(
              <div key={a.id} style={{background:"var(--card-bg)",borderRadius:"14px",padding:"14px",boxShadow:"var(--shadow)",borderLeft:`4px solid ${a.color}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{a.name}</p><p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--text-muted)"}}>{ACCOUNT_TYPES.find(t=>t.value===a.type)?.label}</p></div>
                  <p style={{margin:0,fontSize:"16px",fontWeight:800,color:"#06b6d4"}}>{fmtF(a.balance)}</p>
                </div>
                <ActionBtns a={a}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kartu Kredit */}
      <div style={{marginBottom:"20px"}}>
        <SectionHeader title="💳 Kartu Kredit" onAdd={()=>{setSelected(null);setModal("add");}}/>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {ccs.map(a=>{
            const used=Math.abs(a.balance),pct=(used/(a.limit||1))*100;
            return(
              <div key={a.id} style={{background:`linear-gradient(135deg,${a.color},${a.color}cc)`,borderRadius:"16px",padding:"16px",boxShadow:"var(--shadow)",color:"#fff"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}><p style={{margin:0,fontSize:"14px",fontWeight:700}}>{a.name}</p><span style={{fontSize:"20px"}}>💳</span></div>
                <p style={{margin:"0 0 6px",fontSize:"11px",opacity:0.8}}>Saldo Terutang</p>
                <p style={{margin:"0 0 8px",fontSize:"20px",fontWeight:800}}>{fmtF(a.balance)}</p>
                <div style={{height:"5px",background:"rgba(255,255,255,0.3)",borderRadius:"3px",overflow:"hidden",marginBottom:"6px"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:"#fff",borderRadius:"3px"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",opacity:0.85,marginBottom:"8px"}}><span>Limit: {fmt(a.limit||0)}</span><span>Cetak: tgl {a.billing_date} | Jatuh tempo: tgl {a.due_date}</span></div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button onClick={()=>{setSelected(a);setModal("edit");}} style={{flex:1,padding:"5px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.15)",cursor:"pointer",fontSize:"11px",color:"#fff",fontWeight:600}}>✏️ Edit</button>
                  <button onClick={()=>delAccount(a.id)} style={{flex:1,padding:"5px",borderRadius:"7px",border:"1px solid rgba(255,255,255,0.3)",background:"rgba(0,0,0,0.2)",cursor:"pointer",fontSize:"11px",color:"#fff",fontWeight:600}}>🗑️ Hapus</button>
                </div>
              </div>
            );
          })}
          {ccs.length===0&&<p style={{fontSize:"13px",color:"var(--text-muted)",textAlign:"center",padding:"12px 0"}}>Belum ada kartu kredit</p>}
        </div>
      </div>

      {/* Pinjaman */}
      {(loans.length>0||true)&&(
        <div style={{marginBottom:"20px"}}>
          <SectionHeader title="🏧 Pinjaman / Utang" onAdd={()=>{setSelected(null);setModal("add");}}/>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {loans.map(a=>(
              <div key={a.id} style={{background:"var(--card-bg)",borderRadius:"14px",padding:"14px",boxShadow:"var(--shadow)",borderLeft:`4px solid #ef4444`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{a.name}</p><p style={{margin:"2px 0 0",fontSize:"11px",color:"#ef4444"}}>⚠️ Liabilitas</p></div>
                  <p style={{margin:0,fontSize:"16px",fontWeight:800,color:"#ef4444"}}>{fmtF(a.balance)}</p>
                </div>
                <ActionBtns a={a}/>
              </div>
            ))}
            {loans.length===0&&<p style={{fontSize:"13px",color:"var(--text-muted)",textAlign:"center",padding:"12px 0"}}>Tidak ada pinjaman aktif 🎉</p>}
          </div>
        </div>
      )}

      {/* Modals */}
      {modal==="add"&&<Modal title="Tambah Akun / Aset" onClose={()=>setModal(null)}><AccountForm onSave={saveAccount}/></Modal>}
      {modal==="edit"&&selected&&<Modal title="Edit Akun" onClose={()=>{setModal(null);setSelected(null);}}><AccountForm onSave={saveAccount} initial={selected}/></Modal>}
      {confirmAccId&&<ConfirmDialog message="Hapus akun ini?" onConfirm={doDeleteAcc} onCancel={()=>setConfirmAccId(null)}/>}
    </div>
  );
}

// ─── Goals ────────────────────────────────────────────────────────────────────
const GOAL_ICONS = ["🛡️","🏠","✈️","🚗","💻","📚","💍","🎓","🏋️","🌴","🏦","🎯","👶","🐾","🎸"];
const GOAL_COLORS = ["#10b981","#3b82f6","#8b5cf6","#f59e0b","#ec4899","#14b8a6","#f97316","#ef4444","#6366f1","#06b6d4"];

function GoalForm({onSave, initial}) {
  const empty = {name:"",target:"",current:"",deadline:"",icon:"🎯",color:"#3b82f6"};
  const [form,setForm] = useState(initial ? {...initial, target:String(initial.target), current:String(initial.current)} : empty);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {/* Icon picker */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Ikon</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
          {GOAL_ICONS.map(ic=>(
            <button key={ic} onClick={()=>set("icon",ic)}
              style={{width:"36px",height:"36px",borderRadius:"8px",border:`2px solid ${form.icon===ic?"var(--primary)":"var(--border)"}`,background:form.icon===ic?"var(--primary)22":"transparent",fontSize:"18px",cursor:"pointer"}}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Warna</label>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {GOAL_COLORS.map(c=>(
            <button key={c} onClick={()=>set("color",c)}
              style={{width:"28px",height:"28px",borderRadius:"8px",background:c,border:`3px solid ${form.color===c?c:"transparent"}`,cursor:"pointer",outline:form.color===c?`2px solid ${c}44`:"none",transform:form.color===c?"scale(1.15)":"scale(1)",transition:"transform 0.15s"}}/>
          ))}
        </div>
      </div>

      {/* Fields */}
      {[
        {l:"Nama Target",       k:"name",     t:"text",   p:"Contoh: DP Rumah"},
        {l:"Nominal Target (Rp)",k:"target",   t:"number", p:"150000000"},
        {l:"Dana Terkumpul (Rp)",k:"current",  t:"number", p:"0"},
        {l:"Deadline",          k:"deadline",  t:"date",   p:""},
      ].map(f=>(
        <div key={f.k}>
          <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
          <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type={f.t} placeholder={f.p}
            style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        </div>
      ))}

      {/* Preview */}
      {form.name && (
        <div style={{padding:"12px 14px",borderRadius:"12px",background:`${form.color}15`,border:`1px solid ${form.color}33`,display:"flex",alignItems:"center",gap:"10px"}}>
          <span style={{fontSize:"22px"}}>{form.icon}</span>
          <div>
            <p style={{margin:0,fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{form.name}</p>
            <p style={{margin:0,fontSize:"11px",color:form.color,fontWeight:600}}>Target: {form.target?fmtF(parseFloat(form.target)):"-"}</p>
          </div>
        </div>
      )}

      <button onClick={()=>onSave(form)}
        style={{padding:"13px",borderRadius:"12px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",marginTop:"4px"}}>
        {initial?"Simpan Perubahan":"Tambah Target"}
      </button>
    </div>
  );
}

function TopUpForm({goal, onSave}) {
  const [amount,setAmount] = useState("");
  const remaining = goal.target - goal.current;
  const quickAmounts = [100000,500000,1000000,Math.min(5000000,remaining)].filter((v,i,a)=>a.indexOf(v)===i&&v>0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {/* Goal summary */}
      <div style={{padding:"14px",borderRadius:"14px",background:`${goal.color}15`,border:`1px solid ${goal.color}33`}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
          <span style={{fontSize:"24px"}}>{goal.icon}</span>
          <div>
            <p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)"}}>{goal.name}</p>
            <p style={{margin:0,fontSize:"11px",color:"var(--text-muted)"}}>Sisa: {fmtF(remaining)}</p>
          </div>
        </div>
        <ProgressBar pct={(goal.current/goal.target)*100} color={goal.color}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"5px"}}>
          <span style={{fontSize:"11px",color:"var(--text-muted)"}}>{fmtF(goal.current)}</span>
          <span style={{fontSize:"11px",color:"var(--text-muted)"}}>{fmtF(goal.target)}</span>
        </div>
      </div>

      {/* Quick amounts */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Top-up Cepat</label>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          {quickAmounts.map(v=>(
            <button key={v} onClick={()=>setAmount(String(v))}
              style={{padding:"6px 12px",borderRadius:"8px",border:`1.5px solid ${amount===String(v)?"var(--primary)":"var(--border)"}`,background:amount===String(v)?"var(--primary)22":"transparent",cursor:"pointer",fontSize:"12px",fontWeight:600,color:amount===String(v)?"var(--primary)":"var(--text-muted)"}}>
              +{fmt(v)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Nominal Lainnya (Rp)</label>
        <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="0"
          style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
      </div>

      {amount>0 && (
        <div style={{padding:"10px 12px",borderRadius:"10px",background:"#10b98115",border:"1px solid #10b98133"}}>
          <p style={{margin:0,fontSize:"12px",color:"#10b981",fontWeight:600}}>
            Setelah top-up: {fmtF(goal.current + parseFloat(amount||0))} / {fmtF(goal.target)}
            {" "}({Math.min(100,((goal.current+parseFloat(amount||0))/goal.target*100)).toFixed(0)}%)
          </p>
        </div>
      )}

      <button onClick={()=>onSave(parseFloat(amount)||0)}
        disabled={!amount||parseFloat(amount)<=0}
        style={{padding:"13px",borderRadius:"12px",border:"none",background:(!amount||parseFloat(amount)<=0)?"var(--border)":"var(--primary)",color:(!amount||parseFloat(amount)<=0)?"var(--text-muted)":"#fff",fontSize:"15px",fontWeight:700,cursor:(!amount||parseFloat(amount)<=0)?"not-allowed":"pointer"}}>
        💰 Tambah Dana
      </button>
    </div>
  );
}

function GoalsPage() {
  const {goals,setGoals}=useContext(AppContext);
  const [modal,setModal] = useState(null); // null | "add" | "edit" | "topup"
  const [selected,setSelected] = useState(null);

  const addGoal = form => {
    const g = {
      id: `g${Date.now()}`,
      name: form.name||"Target Baru",
      target: parseFloat(form.target)||0,
      current: parseFloat(form.current)||0,
      deadline: form.deadline||"2025-12-31",
      icon: form.icon||"🎯",
      color: form.color||"#3b82f6",
    };
    setGoals(p=>[...p,g]);
    setModal(null);
  };

  const editGoal = form => {
    setGoals(p=>p.map(g=>g.id===selected.id ? {
      ...g,
      name: form.name||g.name,
      target: parseFloat(form.target)||g.target,
      current: parseFloat(form.current)||g.current,
      deadline: form.deadline||g.deadline,
      icon: form.icon||g.icon,
      color: form.color||g.color,
    } : g));
    setModal(null); setSelected(null);
  };

  const topUpGoal = (amount) => {
    setGoals(p=>p.map(g=>g.id===selected.id ? {...g, current:Math.min(g.target, g.current+amount)} : g));
    setModal(null); setSelected(null);
  };

  const [confirmGoalId,setConfirmGoalId]=useState(null);
  const delGoal = id => setConfirmGoalId(id);
  const doDeleteGoal = () => {setGoals(p=>p.filter(g=>g.id!==confirmGoalId));setConfirmGoalId(null);};

  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
        <h2 style={{margin:0,fontSize:"20px",fontWeight:800,color:"var(--text)"}}>Target Finansial</h2>
        <button onClick={()=>setModal("add")} style={{padding:"8px 14px",borderRadius:"10px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>+ Tambah</button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
        {goals.map(g=>{
          const pct=(g.current/g.target)*100, rem=g.target-g.current;
          return(
            <div key={g.id} style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start",marginBottom:"14px"}}>
                <div style={{width:"44px",height:"44px",borderRadius:"12px",background:`${g.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px"}}>{g.icon}</div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:"15px",fontWeight:700,color:"var(--text)"}}>{g.name}</p>
                  <p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--text-muted)"}}>Deadline: {g.deadline}</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
                  <p style={{margin:0,fontSize:"18px",fontWeight:800,color:g.color}}>{pct.toFixed(0)}%</p>
                  <div style={{display:"flex",gap:"4px"}}>
                    <button onClick={()=>{setSelected(g);setModal("topup");}}
                      style={{padding:"3px 8px",borderRadius:"6px",border:`1px solid ${g.color}55`,background:`${g.color}15`,cursor:"pointer",fontSize:"11px",color:g.color,fontWeight:600}}>+Dana</button>
                    <button onClick={()=>{setSelected(g);setModal("edit");}}
                      style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:"11px",color:"var(--text-muted)"}}>✏️</button>
                    <button onClick={()=>delGoal(g.id)}
                      style={{padding:"3px 8px",borderRadius:"6px",border:"1px solid #ef444433",background:"#ef444411",cursor:"pointer",fontSize:"11px",color:"#ef4444"}}>🗑️</button>
                  </div>
                </div>
              </div>
              <ProgressBar pct={pct} color={g.color}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"8px"}}>
                <div><p style={{margin:0,fontSize:"11px",color:"var(--text-muted)"}}>Terkumpul</p><p style={{margin:0,fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{fmtF(g.current)}</p></div>
                <div style={{textAlign:"right"}}><p style={{margin:0,fontSize:"11px",color:"var(--text-muted)"}}>Kurang</p><p style={{margin:0,fontSize:"13px",fontWeight:700,color:"#ef4444"}}>{rem>0?fmtF(rem):"✅ Tercapai!"}</p></div>
              </div>
            </div>
          );
        })}

        {goals.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",color:"var(--text-muted)"}}>
            <p style={{fontSize:"40px",marginBottom:"12px"}}>🎯</p>
            <p style={{fontSize:"14px",fontWeight:600}}>Belum ada target finansial</p>
            <p style={{fontSize:"12px"}}>Tap "+ Tambah" untuk membuat target pertamamu</p>
          </div>
        )}
      </div>

      {modal==="add"&&<Modal title="Tambah Target Finansial" onClose={()=>setModal(null)}><GoalForm onSave={addGoal}/></Modal>}
      {modal==="edit"&&selected&&<Modal title="Edit Target" onClose={()=>{setModal(null);setSelected(null);}}><GoalForm onSave={editGoal} initial={selected}/></Modal>}
      {modal==="topup"&&selected&&<Modal title="Top-up Dana" onClose={()=>{setModal(null);setSelected(null);}}><TopUpForm goal={selected} onSave={topUpGoal}/></Modal>}
      {confirmGoalId&&<ConfirmDialog message="Hapus target ini?" onConfirm={doDeleteGoal} onCancel={()=>setConfirmGoalId(null)}/>}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsPage() {
  const {darkMode,setDarkMode,primaryColor,setPrimaryColor,transactions}=useContext(AppContext);
  const colors=[{name:"Biru",value:"#3b82f6"},{name:"Hijau",value:"#10b981"},{name:"Ungu",value:"#8b5cf6"},{name:"Oranye",value:"#f59e0b"},{name:"Pink",value:"#ec4899"},{name:"Teal",value:"#14b8a6"}];
  const exportCSV=()=>{
    const h=["Tanggal","Keterangan","Tipe","Nominal","Kategori","Tags"];
    const rows=transactions.map(t=>[t.date,t.note,t.type,t.amount,t.category,Array.isArray(t.tags)?t.tags.join(";"):t.tags]);
    const csv=[h,...rows].map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"}),url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="transaksi.csv";a.click();
  };
  return(
    <div style={{padding:"16px 16px 80px"}}>
      <h2 style={{margin:"0 0 20px",fontSize:"20px",fontWeight:800,color:"var(--text)"}}>Pengaturan</h2>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)",marginBottom:"16px",display:"flex",gap:"14px",alignItems:"center"}}>
        <div style={{width:"52px",height:"52px",borderRadius:"14px",background:"var(--primary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:800,color:"#fff"}}>BS</div>
        <div><p style={{margin:0,fontSize:"15px",fontWeight:700,color:"var(--text)"}}>Budi Santoso</p><p style={{margin:"2px 0 0",fontSize:"12px",color:"var(--text-muted)"}}>budi@example.com</p></div>
      </div>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)",marginBottom:"16px"}}>
        <h3 style={{margin:"0 0 16px",fontSize:"14px",fontWeight:700,color:"var(--text)"}}>🎨 Tema & Tampilan</h3>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <span style={{fontSize:"13px",color:"var(--text)"}}>Dark Mode</span>
          <div onClick={()=>setDarkMode(!darkMode)} style={{width:"46px",height:"26px",borderRadius:"13px",background:darkMode?"var(--primary)":"var(--border)",cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:"3px",left:darkMode?"23px":"3px",width:"20px",height:"20px",borderRadius:"10px",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
          </div>
        </div>
        <p style={{margin:"0 0 10px",fontSize:"13px",color:"var(--text)"}}>Warna Tema</p>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          {colors.map(c=>(
            <button key={c.value} onClick={()=>setPrimaryColor(c.value)} title={c.name} style={{width:"36px",height:"36px",borderRadius:"10px",border:`3px solid ${primaryColor===c.value?c.value:"transparent"}`,background:c.value,cursor:"pointer",transform:primaryColor===c.value?"scale(1.1)":"scale(1)",transition:"transform 0.15s"}}/>
          ))}
        </div>
      </div>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)",marginBottom:"16px"}}>
        <h3 style={{margin:"0 0 14px",fontSize:"14px",fontWeight:700,color:"var(--text)"}}>📤 Export Data</h3>
        <button onClick={exportCSV} style={{width:"100%",padding:"12px",borderRadius:"12px",border:"1.5px solid var(--border)",background:"transparent",color:"var(--text)",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>📥 Download CSV</button>
      </div>
      <div style={{background:"var(--card-bg)",borderRadius:"20px",padding:"20px",boxShadow:"var(--shadow)"}}>
        <h3 style={{margin:"0 0 12px",fontSize:"14px",fontWeight:700,color:"var(--text)"}}>ℹ️ Tentang Aplikasi</h3>
        <p style={{margin:0,fontSize:"12px",color:"var(--text-muted)",lineHeight:1.7}}>FinanceKu v2.0 — Dilengkapi Financial Health Score & Expense Heatmap.<br/>Stack: React + Firebase + Tailwind CSS<br/>© 2025 FinanceKu</p>
      </div>
    </div>
  );
}

// ─── FAB + Nav ────────────────────────────────────────────────────────────────

// ─── Recurring Transactions ───────────────────────────────────────────────────
const FREQ_OPTIONS = [
  {value:"daily",   label:"Harian",    icon:"📅"},
  {value:"weekly",  label:"Mingguan",  icon:"📆"},
  {value:"monthly", label:"Bulanan",   icon:"🗓️"},
  {value:"yearly",  label:"Tahunan",   icon:"📋"},
];

const FREQ_LABEL = {daily:"Harian", weekly:"Mingguan", monthly:"Bulanan", yearly:"Tahunan"};

function getNextRun(rec) {
  const now = new Date();
  const last = rec.lastRun ? new Date(rec.lastRun) : new Date(rec.startDate);
  const next = new Date(last);
  if(rec.frequency==="monthly")  next.setMonth(next.getMonth()+1);
  if(rec.frequency==="yearly")   next.setFullYear(next.getFullYear()+1);
  if(rec.frequency==="weekly")   next.setDate(next.getDate()+7);
  if(rec.frequency==="daily")    next.setDate(next.getDate()+1);
  return next;
}

function daysUntil(date) {
  const diff = Math.ceil((new Date(date) - new Date()) / (1000*60*60*24));
  return diff;
}

function RecurringForm({onSave, initial}) {
  const {categories, accounts} = useContext(AppContext);
  const empty = {
    name:"", amount:"", type:"expense", category:"c9", account:"a1",
    frequency:"monthly", day:"1", month:"1",
    startDate: new Date().toISOString().split("T")[0],
    endDate:"", note:"", tags:"", active:true
  };
  const [form,setForm] = useState(()=>{
    if(!initial) return empty;
    return {...empty, ...initial, amount:String(initial.amount), day:String(initial.day||1), month:String(initial.month||1), endDate:initial.endDate||""};
  });
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const filteredCats = categories.filter(c=>c.type===form.type);

  const handleSave=(e)=>{
    e&&e.stopPropagation();
    if(!form.name.trim()){ alert("Nama transaksi wajib diisi!"); return; }
    if(!form.amount||parseFloat(form.amount)<=0){ alert("Nominal wajib diisi!"); return; }
    onSave(form);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {/* Income/Expense toggle */}
      <div style={{display:"flex",background:"var(--bg)",borderRadius:"12px",padding:"4px"}}>
        {["expense","income"].map(t=>(
          <button key={t} onClick={()=>{set("type",t);set("category",t==="expense"?"c9":"c1");}}
            style={{flex:1,padding:"8px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:600,fontSize:"13px",
              background:form.type===t?(t==="income"?"#10b981":"#ef4444"):"transparent",
              color:form.type===t?"#fff":"var(--text-muted)"}}>
            {t==="expense"?"💸 Pengeluaran":"💰 Pemasukan"}
          </button>
        ))}
      </div>

      {/* Name & Amount */}
      {[{l:"Nama Transaksi",k:"name",t:"text",p:"Contoh: Premi Asuransi Jiwa"},{l:"Nominal (Rp)",k:"amount",t:"number",p:"0"}].map(f=>(
        <div key={f.k}>
          <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
          <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type={f.t} placeholder={f.p}
            style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        </div>
      ))}

      {/* Frequency */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"8px"}}>Frekuensi</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px"}}>
          {FREQ_OPTIONS.map(f=>(
            <button key={f.value} onClick={()=>set("frequency",f.value)}
              style={{padding:"9px",borderRadius:"10px",border:`1.5px solid ${form.frequency===f.value?"var(--primary)":"var(--border)"}`,
                background:form.frequency===f.value?"var(--primary)22":"transparent",
                cursor:"pointer",fontSize:"12px",fontWeight:600,
                color:form.frequency===f.value?"var(--primary)":"var(--text-muted)"}}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Day / Month */}
      <div style={{display:"flex",gap:"10px"}}>
        <div style={{flex:1}}>
          <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>
            {form.frequency==="weekly"?"Hari ke- (1=Sen)":"Tanggal"}
          </label>
          <input value={form.day} onChange={e=>set("day",e.target.value)} type="number" min="1" max="31" placeholder="1"
            style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        </div>
        {form.frequency==="yearly"&&(
          <div style={{flex:1}}>
            <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Bulan</label>
            <select value={form.month} onChange={e=>set("month",e.target.value)}
              style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px"}}>
              {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"].map((m,i)=>(
                <option key={i+1} value={i+1}>{m}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Start & End date */}
      <div style={{display:"flex",gap:"10px"}}>
        {[{l:"Mulai Dari",k:"startDate"},{l:"Berakhir (kosongkan = selamanya)",k:"endDate"}].map(f=>(
          <div key={f.k} style={{flex:1}}>
            <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
            <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type="date"
              style={{width:"100%",padding:"10px 8px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"13px",boxSizing:"border-box"}}/>
          </div>
        ))}
      </div>

      {/* Category */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Kategori</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
          {filteredCats.map(c=>(
            <button key={c.id} onClick={()=>set("category",c.id)}
              style={{padding:"5px 11px",borderRadius:"8px",border:`1.5px solid ${form.category===c.id?c.color:"var(--border)"}`,
                background:form.category===c.id?`${c.color}22`:"transparent",
                cursor:"pointer",fontSize:"11px",fontWeight:600,color:form.category===c.id?c.color:"var(--text-muted)"}}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div>
        <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>Akun</label>
        <select value={form.account} onChange={e=>set("account",e.target.value)}
          style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px"}}>
          {accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {/* Note & Tags */}
      {[{l:"Catatan",k:"note",p:"Contoh: Polis No. 12345"},{l:"Tags (pisah koma)",k:"tags",p:"asuransi, rutin..."}].map(f=>(
        <div key={f.k}>
          <label style={{fontSize:"12px",fontWeight:600,color:"var(--text-muted)",display:"block",marginBottom:"6px"}}>{f.l}</label>
          <input value={form[f.k]} onChange={e=>set(f.k,e.target.value)} type="text" placeholder={f.p}
            style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:"14px",boxSizing:"border-box"}}/>
        </div>
      ))}

      {/* Preview */}
      {form.name&&form.amount&&(
        <div style={{padding:"12px 14px",borderRadius:"12px",background:"var(--primary)11",border:"1px solid var(--primary)33"}}>
          <p style={{margin:0,fontSize:"12px",fontWeight:700,color:"var(--primary)"}}>📋 Preview Jadwal</p>
          <p style={{margin:"4px 0 0",fontSize:"12px",color:"var(--text)"}}>
            {form.type==="expense"?"-":"+"}Rp {parseFloat(form.amount||0).toLocaleString("id-ID")} setiap <strong>{FREQ_LABEL[form.frequency]}</strong>
            {form.frequency!=="daily"&&` tgl ${form.day}`}
            {form.frequency==="yearly"&&` bulan ${["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"][parseInt(form.month)]}`}
            {form.endDate&&` sampai ${form.endDate}`}
          </p>
        </div>
      )}

      <button onClick={handleSave}
        style={{padding:"13px",borderRadius:"12px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"15px",fontWeight:700,cursor:"pointer",marginTop:"4px"}}>
        {initial?"Simpan Perubahan":"Buat Transaksi Berulang"}
      </button>
    </div>
  );
}

function RecurringPage() {
  const {recurrings, setRecurrings, setTransactions, categories} = useContext(AppContext);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const saveRecurring = (form) => {
    const rec = {
      ...form,
      id: selected ? selected.id : `r${Date.now()}`,
      amount: parseFloat(form.amount)||0,
      day: parseInt(form.day)||1,
      month: parseInt(form.month)||1,
      endDate: form.endDate||null,
      active: true,
      lastRun: null,
    };
    if(selected) setRecurrings(p=>p.map(r=>r.id===rec.id?rec:r));
    else setRecurrings(p=>[rec,...p]);
    setModal(null); setSelected(null);
  };

  // Record now: immediately create a transaction from this recurring
  const recordNow = (rec) => {
    const tx = {
      id: `t${Date.now()}`,
      amount: rec.amount,
      type: rec.type,
      category: rec.category,
      account: rec.account,
      date: new Date().toISOString().split("T")[0],
      note: rec.name,
      tags: Array.isArray(rec.tags) ? rec.tags : (rec.tags||"").split(",").map(t=>t.trim()).filter(Boolean),
    };
    setTransactions(p=>[tx,...p]);
    setRecurrings(p=>p.map(r=>r.id===rec.id?{...r,lastRun:tx.date}:r));
    alert(`✅ Transaksi "${rec.name}" berhasil dicatat!`);
  };

  const toggleActive = (id) => setRecurrings(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const doDelete = () => { setRecurrings(p=>p.filter(r=>r.id!==confirmId)); setConfirmId(null); };

  const active   = recurrings.filter(r=>r.active);
  const inactive = recurrings.filter(r=>!r.active);

  // Summary
  const monthlyTotal = recurrings.filter(r=>r.active&&r.type==="expense").reduce((sum,r)=>{
    if(r.frequency==="monthly") return sum+r.amount;
    if(r.frequency==="yearly")  return sum+r.amount/12;
    if(r.frequency==="weekly")  return sum+r.amount*4.3;
    if(r.frequency==="daily")   return sum+r.amount*30;
    return sum;
  },0);

  const RecCard = ({rec}) => {
    const cat     = categories.find(c=>c.id===rec.category)||{};
    const nextRun = getNextRun(rec);
    const days    = daysUntil(nextRun);
    const isOverdue = days < 0;
    const isSoon    = days >= 0 && days <= 7;
    const endSoon   = rec.endDate && daysUntil(new Date(rec.endDate)) <= 30 && daysUntil(new Date(rec.endDate)) > 0;

    return(
      <div style={{background:"var(--card-bg)",borderRadius:"16px",padding:"16px",boxShadow:"var(--shadow)",
        borderLeft:`4px solid ${rec.active?(isOverdue?"#ef4444":isSoon?"#f59e0b":cat.color||"var(--primary)"):"var(--border)"}`,
        opacity:rec.active?1:0.55}}>

        {/* Header row */}
        <div style={{display:"flex",alignItems:"flex-start",gap:"10px",marginBottom:"10px"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"9px",background:`${cat.color||"#94a3b8"}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>
            {cat.icon||"🔄"}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{margin:0,fontSize:"14px",fontWeight:700,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rec.name}</p>
            <p style={{margin:"2px 0 0",fontSize:"11px",color:"var(--text-muted)"}}>
              {FREQ_LABEL[rec.frequency]} · tgl {rec.day}{rec.frequency==="yearly"?` bulan ${["","Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"][rec.month]}`:""}
            </p>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <p style={{margin:0,fontSize:"15px",fontWeight:800,color:rec.type==="income"?"#10b981":"#ef4444"}}>
              {rec.type==="income"?"+":"-"}{fmt(rec.amount)}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}}>
          {isOverdue&&<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"#ef444422",color:"#ef4444",fontWeight:700}}>⚠️ Terlambat {Math.abs(days)} hari</span>}
          {isSoon&&!isOverdue&&<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"#f59e0b22",color:"#f59e0b",fontWeight:700}}>⏰ {days===0?"Hari ini!":days+" hari lagi"}</span>}
          {!isOverdue&&!isSoon&&<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"var(--bg)",color:"var(--text-muted)",fontWeight:600}}>Berikutnya: {nextRun.toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</span>}
          {endSoon&&<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"#8b5cf622",color:"#8b5cf6",fontWeight:700}}>🏁 Berakhir {daysUntil(new Date(rec.endDate))} hari lagi</span>}
          {rec.endDate&&<span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"6px",background:"var(--bg)",color:"var(--text-muted)",fontWeight:600}}>s/d {rec.endDate}</span>}
        </div>

        {/* Note */}
        {rec.note&&<p style={{margin:"0 0 10px",fontSize:"11px",color:"var(--text-muted)",fontStyle:"italic"}}>📝 {rec.note}</p>}

        {/* Action buttons */}
        <div style={{display:"flex",gap:"6px"}}>
          <button onClick={()=>recordNow(rec)} disabled={!rec.active}
            style={{flex:2,padding:"7px",borderRadius:"8px",border:"none",
              background:rec.active?"var(--primary)":"var(--border)",
              color:rec.active?"#fff":"var(--text-muted)",fontSize:"11px",fontWeight:700,cursor:rec.active?"pointer":"not-allowed"}}>
            ✅ Catat Sekarang
          </button>
          <button onClick={()=>toggleActive(rec.id)}
            style={{flex:1,padding:"7px",borderRadius:"8px",border:"1px solid var(--border)",
              background:"transparent",color:"var(--text-muted)",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>
            {rec.active?"⏸ Jeda":"▶ Aktifkan"}
          </button>
          <button onClick={()=>{setSelected(rec);setModal("edit");}}
            style={{width:"32px",padding:"7px",borderRadius:"8px",border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:"12px",color:"var(--text-muted)"}}>✏️</button>
          <button onClick={()=>setConfirmId(rec.id)}
            style={{width:"32px",padding:"7px",borderRadius:"8px",border:"1px solid #ef444433",background:"#ef444411",cursor:"pointer",fontSize:"12px",color:"#ef4444"}}>🗑️</button>
        </div>
      </div>
    );
  };

  return(
    <div style={{padding:"16px 16px 80px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <h2 style={{margin:0,fontSize:"20px",fontWeight:800,color:"var(--text)"}}>Transaksi Berulang</h2>
        <button onClick={()=>{setSelected(null);setModal("add");}}
          style={{padding:"8px 14px",borderRadius:"10px",border:"none",background:"var(--primary)",color:"#fff",fontSize:"13px",fontWeight:700,cursor:"pointer"}}>
          + Tambah
        </button>
      </div>

      {/* Summary card */}
      <div style={{background:"linear-gradient(135deg,var(--primary),var(--primary-dark))",borderRadius:"16px",padding:"16px 18px",marginBottom:"20px",color:"#fff"}}>
        <p style={{margin:"0 0 4px",fontSize:"11px",opacity:0.8,textTransform:"uppercase",letterSpacing:"1px"}}>Estimasi Pengeluaran Rutin</p>
        <p style={{margin:"0 0 12px",fontSize:"26px",fontWeight:800,letterSpacing:"-0.5px"}}>{fmt(monthlyTotal)}<span style={{fontSize:"13px",fontWeight:500,opacity:0.8}}> /bulan</span></p>
        <div style={{display:"flex",gap:"16px"}}>
          <div><p style={{margin:0,fontSize:"10px",opacity:0.7}}>Aktif</p><p style={{margin:0,fontSize:"15px",fontWeight:700}}>{active.length} jadwal</p></div>
          <div><p style={{margin:0,fontSize:"10px",opacity:0.7}}>Jatuh tempo minggu ini</p>
            <p style={{margin:0,fontSize:"15px",fontWeight:700,color:active.filter(r=>daysUntil(getNextRun(r))<=7).length>0?"#fbbf24":"#fff"}}>
              {active.filter(r=>daysUntil(getNextRun(r))<=7).length} transaksi
            </p>
          </div>
          <div><p style={{margin:0,fontSize:"10px",opacity:0.7}}>Terlambat</p>
            <p style={{margin:0,fontSize:"15px",fontWeight:700,color:active.filter(r=>daysUntil(getNextRun(r))<0).length>0?"#fca5a5":"#fff"}}>
              {active.filter(r=>daysUntil(getNextRun(r))<0).length} transaksi
            </p>
          </div>
        </div>
      </div>

      {/* Active recurrings */}
      {active.length>0&&(
        <div style={{marginBottom:"20px"}}>
          <p style={{margin:"0 0 10px",fontSize:"12px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>🟢 Aktif ({active.length})</p>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {active.sort((a,b)=>daysUntil(getNextRun(a))-daysUntil(getNextRun(b))).map(r=><RecCard key={r.id} rec={r}/>)}
          </div>
        </div>
      )}

      {/* Inactive */}
      {inactive.length>0&&(
        <div style={{marginBottom:"20px"}}>
          <p style={{margin:"0 0 10px",fontSize:"12px",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px"}}>⏸ Dijeda ({inactive.length})</p>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {inactive.map(r=><RecCard key={r.id} rec={r}/>)}
          </div>
        </div>
      )}

      {recurrings.length===0&&(
        <div style={{textAlign:"center",padding:"48px 20px",color:"var(--text-muted)"}}>
          <p style={{fontSize:"44px",margin:"0 0 12px"}}>🔄</p>
          <p style={{fontSize:"15px",fontWeight:700,margin:"0 0 6px"}}>Belum ada transaksi berulang</p>
          <p style={{fontSize:"12px",margin:0}}>Tambahkan premi asuransi, cicilan, atau tagihan rutin</p>
        </div>
      )}

      {modal==="add"&&<Modal title="Transaksi Berulang Baru" onClose={()=>setModal(null)}><RecurringForm onSave={saveRecurring}/></Modal>}
      {modal==="edit"&&selected&&<Modal title="Edit Jadwal" onClose={()=>{setModal(null);setSelected(null);}}><RecurringForm onSave={saveRecurring} initial={selected}/></Modal>}
      {confirmId&&<ConfirmDialog message="Hapus jadwal transaksi ini?" onConfirm={doDelete} onCancel={()=>setConfirmId(null)}/>}
    </div>
  );
}

function FAB({onClick}) {
  return(<button onClick={onClick} style={{position:"fixed",bottom:"80px",right:"20px",width:"56px",height:"56px",borderRadius:"18px",background:"var(--primary)",border:"none",color:"#fff",fontSize:"24px",cursor:"pointer",boxShadow:"0 4px 20px var(--primary)88",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>);
}

function BottomNav({tab,setTab}) {
  const tabs=[{id:"dashboard",icon:"📊",label:"Beranda"},{id:"transactions",icon:"💸",label:"Transaksi"},{id:"accounts",icon:"🏦",label:"Akun"},{id:"recurring",icon:"🔄",label:"Rutin"},{id:"settings",icon:"⚙️",label:"Setelan"}];
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--card-bg)",borderTop:"1px solid var(--border)",display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px 6px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
          <span style={{fontSize:"20px",opacity:tab===t.id?1:0.4,transform:tab===t.id?"scale(1.15)":"scale(1)",transition:"all 0.2s"}}>{t.icon}</span>
          <span style={{fontSize:"10px",fontWeight:tab===t.id?700:500,color:tab===t.id?"var(--primary)":"var(--text-muted)"}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn]          = useState(false);
  const [tab,setTab]                    = useState("dashboard");
  const [darkMode,setDarkMode]          = useState(false);
  const [primaryColor,setPrimaryColor]  = useState("#3b82f6");
  const [transactions,setTransactions]  = useState(INITIAL_TRANSACTIONS);
  const [categories]                    = useState(INITIAL_CATEGORIES);
  const [accounts,setAccounts]          = useState(INITIAL_ACCOUNTS);
  const [goals,setGoals]                = useState(INITIAL_GOALS);
  const [recurrings,setRecurrings]      = useState(INITIAL_RECURRINGS);
  const [showFAB,setShowFAB]            = useState(false);

  const theme = {
    "--primary":      primaryColor,
    "--primary-dark": primaryColor+"cc",
    "--bg":           darkMode?"#0f172a":"#f1f5f9",
    "--card-bg":      darkMode?"#1e293b":"#ffffff",
    "--text":         darkMode?"#f1f5f9":"#0f172a",
    "--text-muted":   darkMode?"#94a3b8":"#64748b",
    "--border":       darkMode?"#334155":"#e2e8f0",
    "--shadow":       darkMode?"0 2px 8px rgba(0,0,0,0.4)":"0 2px 8px rgba(0,0,0,0.06)",
    "--shadow-xl":    darkMode?"0 20px 60px rgba(0,0,0,0.6)":"0 20px 60px rgba(0,0,0,0.15)",
  };

  const saveTx=form=>{setTransactions(p=>[{...form,id:`t${Date.now()}`,amount:parseFloat(form.amount)||0},...p]);setShowFAB(false);};

  if(!loggedIn) return(
    <div style={{...theme,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box;font-family:'DM Sans',system-ui,sans-serif}::-webkit-scrollbar{width:0}`}</style>
      <LoginPage onLogin={()=>setLoggedIn(true)}/>
    </div>
  );

  return(
    <AppContext.Provider value={{transactions,setTransactions,categories,accounts,setAccounts,goals,setGoals,recurrings,setRecurrings,darkMode,setDarkMode,primaryColor,setPrimaryColor}}>
      <div style={{...theme,minHeight:"100vh",background:"var(--bg)",color:"var(--text)",maxWidth:"430px",margin:"0 auto",position:"relative"}}>
        <style>{`
          *{box-sizing:border-box}
          input,select,button{font-family:'DM Sans',system-ui,sans-serif}
          input:focus,select:focus{outline:2px solid ${primaryColor}44;border-color:${primaryColor}!important}
          ::-webkit-scrollbar{width:0}
        `}</style>
        {tab==="dashboard"    && <Dashboard/>}
        {tab==="transactions" && <TransactionsPage/>}
        {tab==="accounts"     && <AccountsPage/>}
        {tab==="goals"        && <GoalsPage/>}
        {tab==="recurring"     && <RecurringPage/>}
        {tab==="settings"     && <SettingsPage/>}
        <FAB onClick={()=>setShowFAB(true)}/>
        <BottomNav tab={tab} setTab={setTab}/>
        {showFAB&&(
          <Modal title="Tambah Transaksi" onClose={()=>setShowFAB(false)}>
            <TransactionForm onSave={saveTx} onClose={()=>setShowFAB(false)}/>
          </Modal>
        )}
      </div>
    </AppContext.Provider>
  );
}
