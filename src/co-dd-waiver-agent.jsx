import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Epilogue:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f5f2ec;--bg2:#ede9e0;--surface:#ffffff;--border:#ddd8cc;--border2:#c8c2b4;
  --ink:#1c1a16;--ink2:#4a4640;--muted:#8c8478;
  --pine:#2d5a3d;--pine-lt:#e8f0ea;
  --sky:#1a4a6b;--sky-lt:#e3edf5;
  --amber:#c4790a;--amber-lt:#fdf3e3;
  --rose:#a63228;--rose-lt:#faeceb;
  --font-d:'Playfair Display',serif;
  --font-b:'Epilogue',sans-serif;
  --font-m:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--ink);font-family:var(--font-b);font-size:14px;}
.shell{display:flex;height:100vh;overflow:hidden;}
.rail{width:220px;min-width:220px;background:var(--ink);color:#fff;display:flex;flex-direction:column;}
.rail-logo{padding:22px 20px 18px;border-bottom:1px solid rgba(255,255,255,0.08);}
.rail-logo-mark{font-family:var(--font-d);font-size:15px;color:#fff;line-height:1.3;}
.rail-logo-sub{font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:2px;text-transform:uppercase;margin-top:4px;font-family:var(--font-m);}
.rail-section{font-size:8.5px;color:rgba(255,255,255,0.22);letter-spacing:2px;text-transform:uppercase;padding:16px 20px 5px;font-family:var(--font-m);}
.rail-item{display:flex;align-items:center;gap:9px;padding:9px 20px;cursor:pointer;font-size:12px;font-weight:500;color:rgba(255,255,255,0.45);transition:all 0.15s;border-left:2px solid transparent;}
.rail-item:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.04);}
.rail-item.active{color:#fff;border-left-color:#a8c5a0;background:rgba(255,255,255,0.07);}
.rail-icon{font-size:13px;width:16px;text-align:center;}
.rail-bottom{margin-top:auto;padding:14px 20px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:rgba(255,255,255,0.25);font-family:var(--font-m);display:flex;align-items:center;gap:7px;}
.live-dot{width:6px;height:6px;border-radius:50%;background:#7dc98a;flex-shrink:0;animation:livepulse 2s ease infinite;}
@keyframes livepulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(125,201,138,0.4);}50%{opacity:0.6;box-shadow:0 0 0 4px rgba(125,201,138,0);}}
.main{flex:1;overflow:hidden;display:flex;flex-direction:column;}
.topbar{padding:16px 28px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.topbar-title{font-family:var(--font-d);font-size:20px;font-weight:700;}
.topbar-sub{font-size:11px;color:var(--muted);margin-top:2px;font-family:var(--font-m);}
.content{flex:1;overflow-y:auto;padding:24px 28px;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:5px;font-family:var(--font-b);font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;}
.btn-pine{background:var(--pine);color:#fff;}.btn-pine:hover{background:#234a30;}
.btn-outline{background:transparent;color:var(--ink2);border:1.5px solid var(--border2);}.btn-outline:hover{border-color:var(--ink);color:var(--ink);}
.btn:disabled{opacity:0.4;cursor:not-allowed;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:18px;}
.card-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:var(--muted);margin-bottom:12px;font-family:var(--font-m);}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.stat-num{font-family:var(--font-d);font-size:28px;font-weight:900;line-height:1;}
.stat-note{font-size:10px;margin-top:5px;font-family:var(--font-m);}
.tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:3px;font-family:var(--font-m);font-weight:500;white-space:nowrap;}
.tag-pine{background:var(--pine-lt);color:var(--pine);}
.tag-sky{background:var(--sky-lt);color:var(--sky);}
.tag-amber{background:var(--amber-lt);color:var(--amber);}
.tag-rose{background:var(--rose-lt);color:var(--rose);}
.tag-ink{background:var(--bg2);color:var(--ink2);}
.client-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:16px;cursor:pointer;transition:all 0.15s;position:relative;overflow:hidden;}
.client-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--border2);transition:background 0.2s;}
.client-card:hover{border-color:var(--border2);box-shadow:0 2px 10px rgba(0,0,0,0.06);}
.client-card:hover::before,.client-card.sel::before{background:var(--pine);}
.client-card.sel{border-color:var(--pine);}
.client-name{font-family:var(--font-d);font-size:14px;font-weight:700;line-height:1.2;}
.client-id{font-size:10px;color:var(--muted);font-family:var(--font-m);margin-top:2px;}
.pbar-bg{height:5px;background:var(--bg2);border-radius:3px;overflow:hidden;margin-top:4px;}
.pbar-fill{height:100%;border-radius:3px;transition:width 0.6s ease;}
.sis-badge{font-family:var(--font-d);font-size:20px;font-weight:900;width:42px;height:42px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid;}
.sis-1{background:var(--pine-lt);color:var(--pine);border-color:#b5d4be;}
.sis-2{background:#eaf4fb;color:#1a6b5a;border-color:#b3d9cc;}
.sis-3{background:var(--sky-lt);color:var(--sky);border-color:#b3ccde;}
.sis-4{background:var(--amber-lt);color:var(--amber);border-color:#e8c98a;}
.sis-5{background:#fde8d8;color:#b85c1a;border-color:#f0b896;}
.sis-6{background:var(--rose-lt);color:var(--rose);border-color:#e0b3af;}
.sis-7{background:#1c1a16;color:#f5c842;border-color:#a08020;box-shadow:0 0 0 1px #f5c84240;}
.prog{height:4px;background:var(--bg2);border-radius:2px;overflow:hidden;}
.prog-f{height:100%;border-radius:2px;transition:width 0.5s;}
.ai-bubble{padding:13px 15px;border-radius:7px;font-size:13px;line-height:1.75;margin-bottom:11px;white-space:pre-wrap;}
.ai-bubble.assistant{background:var(--pine-lt);border:1px solid #c0d9c7;border-left:3px solid var(--pine);}
.ai-bubble.user{background:var(--sky-lt);border:1px solid #bad0e0;border-left:3px solid var(--sky);}
.ai-who{font-size:9px;font-family:var(--font-m);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;font-weight:600;}
.ai-who.assistant{color:var(--pine);}.ai-who.user{color:var(--sky);}
.chat-box{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:6px;color:var(--ink);font-family:var(--font-b);font-size:13px;padding:10px 13px;outline:none;resize:none;transition:border-color 0.15s;}
.chat-box:focus{border-color:var(--pine);}
.chat-box::placeholder{color:var(--muted);}
.tabs{display:flex;border-bottom:1.5px solid var(--border);margin-bottom:18px;}
.tab-item{padding:9px 16px;font-size:12px;font-weight:600;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-1.5px;transition:all 0.15s;}
.tab-item:hover{color:var(--ink);}.tab-item.active{color:var(--pine);border-bottom-color:var(--pine);}
.sh{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;}
.sh-title{font-family:var(--font-d);font-size:17px;font-weight:700;}
.sh-sub{font-size:11px;color:var(--muted);margin-top:3px;font-family:var(--font-m);}
.slide-panel{position:fixed;right:0;top:0;bottom:0;width:540px;background:var(--surface);border-left:1.5px solid var(--border);display:flex;flex-direction:column;z-index:200;transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:-8px 0 40px rgba(0,0,0,0.08);}
.slide-panel.open{transform:translateX(0);}
.panel-head{padding:18px 22px;border-bottom:1.5px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.panel-body{flex:1;overflow-y:auto;padding:22px;}
.panel-close{background:none;border:none;cursor:pointer;color:var(--muted);font-size:18px;line-height:1;}
.panel-close:hover{color:var(--ink);}
hr.div{border:none;border-top:1px solid var(--border);margin:14px 0;}
.spin{display:inline-block;width:13px;height:13px;border:2px solid var(--border2);border-top-color:var(--pine);border-radius:50%;animation:sp 0.7s linear infinite;}
@keyframes sp{to{transform:rotate(360deg);}}
.dots span{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--pine);margin:0 2px;animation:dt 1.2s infinite;}
.dots span:nth-child(2){animation-delay:0.2s;}.dots span:nth-child(3){animation-delay:0.4s;}
@keyframes dt{0%,80%,100%{opacity:0.15}40%{opacity:1}}
.fin-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bg2);font-size:12.5px;}
.fin-row:last-child{border-bottom:none;}
.fin-val{font-family:var(--font-m);font-weight:500;}
.net-pos{color:var(--pine);}.net-neg{color:var(--rose);}.net-warn{color:var(--amber);}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
.fadein{animation:fi 0.3s ease;}
@keyframes fi{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
.alert-pine{background:var(--pine-lt);border:1px solid #c0d9c7;color:var(--pine);padding:11px 13px;border-radius:6px;font-size:12.5px;margin-bottom:14px;}
.drop-zone{border:2px dashed var(--border2);border-radius:8px;padding:32px 24px;text-align:center;cursor:pointer;transition:all 0.2s;background:var(--bg);}
.drop-zone:hover,.drop-zone.drag{border-color:var(--pine);background:var(--pine-lt);}
.field-label{display:block;font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;font-family:var(--font-m);margin-bottom:4px;}
.field-input{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:5px;color:var(--ink);font-family:var(--font-b);font-size:13px;padding:8px 11px;outline:none;transition:border-color 0.15s;font-size:13px;}
.field-input:focus{border-color:var(--pine);}
.mb12{margin-bottom:12px;}
.quick-btn{background:var(--bg2);border:1px solid var(--border);border-radius:5px;padding:7px 11px;font-family:var(--font-b);font-size:11px;font-weight:500;color:var(--ink2);cursor:pointer;transition:all 0.15s;text-align:left;line-height:1.4;}
.quick-btn:hover{background:var(--pine-lt);border-color:var(--pine);color:var(--pine);}
.resp-box{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:15px;font-size:12.5px;line-height:1.75;white-space:pre-wrap;font-family:var(--font-b);max-height:480px;overflow-y:auto;color:var(--ink);}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const CLIENTS = [
  {
    id:"CO-001",name:"James Whitfield",age:34,gender:"Male",tenure:6.2,
    diagnosis:["Intellectual Disability – Mild","Autism Spectrum Disorder"],
    sisLevel:2,sisScore:112,waiver:"Comprehensive DD Waiver",
    placement:"Supported Living – 3-bed home, Lakewood CO",placementStatus:"Active",
    behaviors:["Verbal aggression (low freq.)","Property destruction (rare)"],
    incidentCount:4,incidentsYTD:1,coordinatorHrsMonth:8.5,
    financials:{monthlyBilling:6840,staffingCost:4100,coordinatorCost:595,adminOverhead:420,netMonthly:1725,annualRevenue:82080,annualExpense:61440,annualNet:20640},
    profitMargin:25.1,longevityScore:88,complexityScore:44,overallScore:82,
    notes:"Long-tenure client, SIS 2 — state fee schedule mid-tier. Low incident trend, strong placement stability. Good reference for SIS 2 Supported Living proposals.",
  },
  {
    id:"CO-002",name:"Maria Santos",age:28,gender:"Female",tenure:2.1,
    diagnosis:["Intellectual Disability – Moderate","Cerebral Palsy","Seizure Disorder"],
    sisLevel:5,sisScore:148,waiver:"Comprehensive DD Waiver",
    placement:"Host Home – Colorado Springs CO",placementStatus:"Active",
    behaviors:["Elopement risk","Self-injurious behavior – head hitting"],
    incidentCount:19,incidentsYTD:7,coordinatorHrsMonth:18.0,
    financials:{monthlyBilling:13200,staffingCost:9100,coordinatorCost:1260,adminOverhead:520,netMonthly:2320,annualRevenue:158400,annualExpense:130560,annualNet:27840},
    profitMargin:17.6,longevityScore:42,complexityScore:91,overallScore:41,
    notes:"SIS 5 — higher fee-schedule tier. Coordinator hours are elevated due to incident frequency. Behavior plan update is overdue. Margin is viable but requires close monitoring.",
  },
  {
    id:"CO-003",name:"Derek Holman",age:41,gender:"Male",tenure:9.4,
    diagnosis:["Down Syndrome","Generalized Anxiety Disorder"],
    sisLevel:1,sisScore:84,waiver:"Supported Living Services (SLS)",
    placement:"Supported Living – Pueblo CO",placementStatus:"Active",
    behaviors:["Mild anxiety episodes"],
    incidentCount:2,incidentsYTD:0,coordinatorHrsMonth:3.0,
    financials:{monthlyBilling:4200,staffingCost:2300,coordinatorCost:210,adminOverhead:280,netMonthly:1410,annualRevenue:50400,annualExpense:33480,annualNet:16920},
    profitMargin:33.6,longevityScore:97,complexityScore:18,overallScore:94,
    notes:"Best-performing client. SIS 1 — lowest fee-schedule tier but also lowest cost. Highest tenure, zero YTD incidents. Model placement.",
  },
  {
    id:"CO-004",name:"Tanya Obumseli",age:22,gender:"Female",tenure:0.8,
    diagnosis:["Intellectual Disability – Severe","Prader-Willi Syndrome"],
    sisLevel:4,sisScore:131,waiver:"Comprehensive DD Waiver",
    placement:"Family Model Home – Aurora CO",placementStatus:"Probationary",
    behaviors:["Food-seeking / pica risk","Aggression during transitions"],
    incidentCount:8,incidentsYTD:8,coordinatorHrsMonth:14.0,
    financials:{monthlyBilling:9600,staffingCost:6800,coordinatorCost:980,adminOverhead:440,netMonthly:1380,annualRevenue:115200,annualExpense:98640,annualNet:16560},
    profitMargin:14.4,longevityScore:18,complexityScore:78,overallScore:34,
    notes:"New placement, all 8 incidents happened this year. SIS 4 billing is solid but coordinator hours must decrease as placement stabilizes. 90-day BSP review is critical.",
  },
  {
    id:"CO-005",name:"Robert Callahan",age:55,gender:"Male",tenure:4.7,
    diagnosis:["Intellectual Disability – Mild","Bipolar Disorder I","PTSD"],
    sisLevel:3,sisScore:119,waiver:"Comprehensive DD Waiver",
    placement:"Supported Living – Denver CO",placementStatus:"Active",
    behaviors:["Mood cycling episodes","Verbal outbursts – moderate"],
    incidentCount:11,incidentsYTD:3,coordinatorHrsMonth:10.0,
    financials:{monthlyBilling:8100,staffingCost:5200,coordinatorCost:700,adminOverhead:400,netMonthly:1800,annualRevenue:97200,annualExpense:75600,annualNet:21600},
    profitMargin:22.2,longevityScore:71,complexityScore:58,overallScore:67,
    notes:"Solid performer. SIS 3 on fee schedule. Dual diagnosis adds complexity but billing compensates. Monitor mood cycling for potential SIS re-assessment.",
  },
  {
    id:"CO-006",name:"Patricia Nguyen",age:31,gender:"Female",tenure:3.2,
    diagnosis:["Intellectual Disability – Moderate","Cerebral Palsy – Spastic Diplegia","Epilepsy – Intractable"],
    sisLevel:6,sisScore:162,waiver:"Comprehensive DD Waiver",
    placement:"Supported Living – 24hr, Fort Collins CO",placementStatus:"Active",
    behaviors:["Aggressive outbursts during medical care","Unsafe transfers without proper protocol"],
    incidentCount:14,incidentsYTD:5,coordinatorHrsMonth:20.0,
    financials:{monthlyBilling:15800,staffingCost:11200,coordinatorCost:1400,adminOverhead:580,netMonthly:2620,annualRevenue:189600,annualExpense:157920,annualNet:31680},
    profitMargin:16.7,longevityScore:58,complexityScore:88,overallScore:52,
    notes:"SIS 6 — highest Colorado fee-schedule tier. 24hr staffing required due to seizure and transfer risk. Revenue is strong; keeping coordinator hours controlled is the key margin lever.",
  },
  {
    id:"CO-007",name:"Marcus Delaney",age:19,gender:"Male",tenure:0.4,
    diagnosis:["Intellectual Disability – Profound","Autism Spectrum Disorder – Level 3","Intermittent Explosive Disorder","Pica"],
    sisLevel:7,sisScore:null,waiver:"Comprehensive DD Waiver – Extraordinary Needs",
    placement:"Supported Living – 2:1 staffing, Denver CO",placementStatus:"Probationary",
    behaviors:["Severe physical aggression – staff injury risk","Pica – ingestion of non-food items","Elopement – active runner profile","Self-injurious behavior – multiple topographies"],
    incidentCount:22,incidentsYTD:22,coordinatorHrsMonth:28.0,
    financials:{monthlyBilling:28500,staffingCost:20800,coordinatorCost:1960,adminOverhead:720,netMonthly:5020,annualRevenue:342000,annualExpense:281520,annualNet:60480},
    profitMargin:17.7,longevityScore:12,complexityScore:99,overallScore:28,
    notes:"Level 7 Extraordinary Needs — agency-set daily rate, not state fee schedule. 2:1 staffing ratio required at all times. Highest revenue client. Requires QMAP, active crisis protocols, and monthly BCBA oversight. Year-one placement stability is the single most important goal.",
  },
];


const SIS_LABELS={1:"Level 1",2:"Level 2",3:"Level 3",4:"Level 4",5:"Level 5",6:"Level 6",7:"Extraordinary"};
const fmt$=n=>"$"+Number(n).toLocaleString();
const sisClass=l=>["","sis-1","sis-2","sis-3","sis-4","sis-5","sis-6","sis-7"][l]||"sis-1";
const scoreColor=s=>s>=75?"var(--pine)":s>=50?"var(--amber)":"var(--rose)";
const marginColor=m=>m>=25?"var(--pine)":m>=15?"var(--amber)":"var(--rose)";

// ─── AI ──────────────────────────────────────────────────────────────────────
const SYSTEM=`You are a specialized AI advisor for a Colorado residential services agency operating under the Colorado Developmental Disabilities (DD) Waiver program. You support case care coordinators, intake staff, and agency leadership in evaluating client placements, financials, and caseload sustainability.

Your deep expertise covers:
- Colorado DD Waiver types: Comprehensive DD Waiver, Supported Living Services (SLS), Children's Extensive Support (CES), Adult Autism Waiver
- Support Intensity Scale (SIS): Colorado uses Levels 1–6, each paid according to the state fee schedule set by HCPF based on client support intensity. Level 7 is a special "Extraordinary Needs" designation billed at an agency-determined daily rate — typically a high daily rate — because of the exceptional complexity, staffing ratios, and risk these clients carry. Level 7 does NOT follow the standard fee schedule; the agency negotiates or sets this rate directly.
- SIS Level billing progression: L1 (lowest acuity, lowest rate) → L6 (highest fee-schedule tier) → L7 (agency-set rate, typically highest of all)
- HCBS billing, CMHIFL rate schedules, HCPF reimbursement tiers for residential placements
- Residential placement types: Supported Living, Host Home, Family Model Home, Group Home (ICF-IID)
- How diagnosis profiles, SIS scores, behavior frequency, incident counts, and coordinator hours combine to determine profitability and placement sustainability
- Behavioral Support Plans (BSPs), CIR (Critical Incident Reporting), CDHS compliance requirements
- How to evaluate prospective clients against existing portfolio capacity and experience
- Colorado-specific context: RCCO regions, CDASS, case management structures, HCPF oversight

Current client portfolio:
${JSON.stringify(CLIENTS.map(c=>({id:c.id,name:c.name,age:c.age,tenure:c.tenure,diagnosis:c.diagnosis,sisLevel:c.sisLevel,sisScore:c.sisScore,placement:c.placement,behaviors:c.behaviors,incidentCount:c.incidentCount,incidentsYTD:c.incidentsYTD,coordinatorHrsMonth:c.coordinatorHrsMonth,profitMargin:c.profitMargin,annualNet:c.financials.annualNet,overallScore:c.overallScore,notes:c.notes})),null,2)}

Portfolio summary:
- Total annual revenue: ${fmt$(CLIENTS.reduce((s,c)=>s+c.financials.annualRevenue,0))}
- Total annual net: ${fmt$(CLIENTS.reduce((s,c)=>s+c.financials.annualNet,0))}
- Avg profit margin: ${(CLIENTS.reduce((s,c)=>s+c.profitMargin,0)/CLIENTS.length).toFixed(1)}%
- SIS 5-6 clients (high fee-schedule tier): ${CLIENTS.filter(c=>c.sisLevel>=5 && c.sisLevel<7).length} of ${CLIENTS.length}
- Level 7 Extraordinary Needs clients: ${CLIENTS.filter(c=>c.sisLevel===7).length}

Be direct, specific, and always use Colorado DD Waiver terminology. Reference real client data when relevant.`;

async function callAI(messages,extra=""){
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM+extra,messages}),
  });
  const d=await res.json();
  return d.content?.map(b=>b.text||"").join("")||"No response received.";
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({onClient}){
  const totalRev=CLIENTS.reduce((s,c)=>s+c.financials.annualRevenue,0);
  const totalNet=CLIENTS.reduce((s,c)=>s+c.financials.annualNet,0);
  const avgMargin=(CLIENTS.reduce((s,c)=>s+c.profitMargin,0)/CLIENTS.length).toFixed(1);
  const flagged=CLIENTS.filter(c=>c.overallScore<40);
  const best=[...CLIENTS].sort((a,b)=>b.overallScore-a.overallScore)[0];

  return (
    <div className="fadein">
      <div className="g4" style={{marginBottom:18}}>
        {[
          {label:"Annual Revenue",val:fmt$(totalRev),note:"All active placements",color:"var(--pine)"},
          {label:"Annual Net Income",val:fmt$(totalNet),note:`${avgMargin}% avg margin`,color:"var(--pine)"},
          {label:"Active Clients",val:CLIENTS.length,note:"CO DD Waiver residential",color:"var(--sky)"},
          {label:"Flagged Clients",val:flagged.length,note:"Score below 40 — review needed",color:"var(--rose)"},
        ].map((s,i)=>(
          <div key={i} className="card">
            <div className="card-label">{s.label}</div>
            <div className="stat-num" style={{color:s.color}}>{s.val}</div>
            <div className="stat-note" style={{color:"var(--muted)"}}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className="g2">
        <div>
          <div className="sh">
            <div><div className="sh-title">Client Portfolio</div><div className="sh-sub">Click any client for full AI deep-dive</div></div>
          </div>
          {CLIENTS.map(c=>(
            <div key={c.id} className="client-card" style={{marginBottom:9}} onClick={()=>onClient(c)}>
              <div style={{display:"flex",alignItems:"flex-start",gap:11}}>
                <div className={`sis-badge ${sisClass(c.sisLevel)}`}>{c.sisLevel}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="client-name">{c.name}</div>
                  <div className="client-id">{c.id} · {c.placement.split("–")[0].trim()}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                    {c.diagnosis.slice(0,2).map(d=><span key={d} className="tag tag-ink" style={{fontSize:9}}>{d}</span>)}
                    <span className={`tag ${c.sisLevel===7?"tag-amber":c.sisLevel>=5?"tag-rose":c.sisLevel>=3?"tag-sky":"tag-pine"}`}>SIS {c.sisLevel} – {SIS_LABELS[c.sisLevel]}</span>
                  </div>
                  <div style={{marginTop:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-m)"}}>Profitability Score</span>
                      <span style={{fontSize:11,fontFamily:"var(--font-m)",fontWeight:600,color:scoreColor(c.overallScore)}}>{c.overallScore}/100</span>
                    </div>
                    <div className="pbar-bg"><div className="pbar-fill" style={{width:`${c.overallScore}%`,background:scoreColor(c.overallScore)}}/></div>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"var(--font-m)",fontSize:12,fontWeight:600,color:marginColor(c.profitMargin)}}>{c.profitMargin}%</div>
                  <div style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--font-m)"}}>margin</div>
                  <div style={{marginTop:5,fontSize:9,color:"var(--muted)",fontFamily:"var(--font-m)"}}>{c.tenure}yr tenure</div>
                  <div style={{fontSize:9,color:c.incidentsYTD>5?"var(--rose)":"var(--muted)",fontFamily:"var(--font-m)"}}>{c.incidentsYTD} inc. YTD</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sh"><div><div className="sh-title">SIS Distribution</div><div className="sh-sub">Support intensity vs. avg net income</div></div></div>
          <div className="card" style={{marginBottom:14}}>
            {[1,2,3,4,5,6,7].map(l=>{
              const grp=CLIENTS.filter(c=>c.sisLevel===l);
              const count=grp.length;
              const avgNet=count?grp.reduce((s,c)=>s+c.financials.annualNet,0)/count:0;
              const pct=Math.round(count/CLIENTS.length*100);
              return (
                <div key={l} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span className={`sis-badge ${sisClass(l)}`} style={{width:26,height:26,fontSize:12}}>{l}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:600}}>SIS {l} — {SIS_LABELS[l]}</div>
                        <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-m)"}}>Avg net: {fmt$(Math.round(avgNet))}/yr</div>
                      </div>
                    </div>
                    <span style={{fontSize:11,fontFamily:"var(--font-m)",color:"var(--muted)"}}>{count} client{count!==1?"s":""}</span>
                  </div>
                  <div className="prog"><div className="prog-f" style={{width:`${pct}%`,background:["","var(--pine)","var(--sky)","var(--sky)","var(--amber)","#b85c1a","var(--rose)","#c4900a"][l]}}/></div>
                </div>
              );
            })}
          </div>

          {flagged.length>0&&(
            <>
              <div className="sh" style={{marginBottom:10}}><div><div className="sh-title">⚠️ Flagged</div></div></div>
              {flagged.map(c=>(
                <div key={c.id} className="card" style={{marginBottom:9,cursor:"pointer",padding:13}} onClick={()=>onClient(c)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{c.name}</div>
                      <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-m)",marginTop:2}}>
                        {c.incidentsYTD} inc. YTD · {c.coordinatorHrsMonth}h/mo coord · {c.profitMargin}% margin
                      </div>
                    </div>
                    <span className="tag tag-rose">Score {c.overallScore}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="card" style={{marginTop:6}}>
            <div className="card-label">⭐ Top Performer</div>
            <div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:700}}>{best.name}</div>
            <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)",marginTop:2}}>
              {best.tenure}yr · SIS {best.sisLevel} · {best.profitMargin}% margin · {best.incidentCount} total incidents
            </div>
            <hr className="div"/>
            <div style={{fontSize:12,color:"var(--ink2)",lineHeight:1.65}}>{best.notes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT PANEL ────────────────────────────────────────────────────────────
function ClientPanel({client,onClose}){
  const [tab,setTab]=useState("Overview");
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [analyzed,setAnalyzed]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{setMsgs([]);setTab("Overview");setAnalyzed(false);},[client?.id]);

  useEffect(()=>{
    if(tab==="AI Analysis"&&!analyzed&&client){
      setAnalyzed(true);setLoading(true);
      (async()=>{
        const r=await callAI([{role:"user",content:
          `Full profitability and placement sustainability analysis for ${client.name} (${client.id}):\n\n1. FINANCIAL HEALTH — Profitable? Sustainable? Margin risk level?\n2. CARE COMPLEXITY — How do SIS ${client.sisLevel} (${SIS_LABELS[client.sisLevel]}), diagnoses (${client.diagnosis.join(", ")}), behaviors (${client.behaviors.join(", ")}), and ${client.coordinatorHrsMonth}h/mo coordinator load affect staff burden and cost?\n3. LONGEVITY OUTLOOK — Given ${client.tenure}yr tenure, ${client.incidentCount} total / ${client.incidentsYTD} YTD incidents, how likely is stable placement for 2+ more years?\n4. COORDINATOR ACTIONS — What specific steps should the care coordinator take now?\n\nBe direct. Use Colorado DD Waiver terminology.`
        }]);
        setMsgs([{role:"assistant",content:r}]);
        setLoading(false);
      })();
    }
  },[tab]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  async function send(){
    if(!input.trim()||loading)return;
    const u={role:"user",content:input};
    setMsgs(p=>[...p,u]);setInput("");setLoading(true);
    const r=await callAI([...msgs,u].map(m=>({role:m.role,content:m.content})),`\n\nFocused client:\n${JSON.stringify(client,null,2)}`);
    setMsgs(p=>[...p,{role:"assistant",content:r}]);setLoading(false);
  }

  if(!client)return null;
  const f=client.financials;
  const netCls=f.netMonthly>1200?"net-pos":f.netMonthly>500?"net-warn":"net-neg";

  return (
    <div className={`slide-panel ${client?"open":""}`}>
      <div className="panel-head">
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div className={`sis-badge ${sisClass(client.sisLevel)}`}>{client.sisLevel}</div>
            <div>
              <div style={{fontFamily:"var(--font-d)",fontSize:16,fontWeight:700}}>{client.name}</div>
              <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--font-m)"}}>{client.id} · Age {client.age} · {client.gender} · {client.tenure}yr tenure</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            <span className={`tag ${client.sisLevel===7?"tag-amber":client.sisLevel>=5?"tag-rose":client.sisLevel>=3?"tag-sky":"tag-pine"}`}>SIS {client.sisLevel} – {SIS_LABELS[client.sisLevel]}</span>
            <span className={`tag ${client.placementStatus==="Active"?"tag-pine":"tag-amber"}`}>{client.placementStatus}</span>
            <span className="tag tag-sky" style={{fontSize:9}}>{client.waiver}</span>
          </div>
        </div>
        <button className="panel-close" onClick={onClose}>✕</button>
      </div>
      <div style={{padding:"0 22px",borderBottom:"1px solid var(--border)"}}>
        <div className="tabs" style={{borderBottom:"none",marginBottom:0}}>
          {["Overview","Financials","AI Analysis"].map(t=>(
            <div key={t} className={`tab-item ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{t}</div>
          ))}
        </div>
      </div>
      <div className="panel-body">
        {tab==="Overview"&&(
          <div className="fadein">
            <div className="card" style={{marginBottom:12}}>
              <div className="card-label">Placement</div>
              <div style={{fontWeight:600,fontSize:13}}>{client.placement}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)",marginTop:3}}>{client.waiver}</div>
            </div>
            <div className="g2" style={{marginBottom:12}}>
              <div className="card">
                <div className="card-label">SIS Assessment</div>
                <div style={{fontFamily:"var(--font-d)",fontSize:22,fontWeight:900,color:["","var(--pine)","var(--sky)","var(--amber)","var(--rose)"][client.sisLevel]}}>Level {client.sisLevel}</div>
                <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)",marginTop:2}}>{SIS_LABELS[client.sisLevel]} Support</div>
                <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)"}}>Score: {client.sisScore}</div>
              </div>
              <div className="card">
                <div className="card-label">Profitability Score</div>
                <div style={{fontFamily:"var(--font-d)",fontSize:22,fontWeight:900,color:scoreColor(client.overallScore)}}>{client.overallScore}<span style={{fontSize:13}}>/100</span></div>
                <div className="prog" style={{marginTop:8}}><div className="prog-f" style={{width:`${client.overallScore}%`,background:scoreColor(client.overallScore)}}/></div>
              </div>
            </div>
            <div className="card" style={{marginBottom:12}}>
              <div className="card-label">Diagnosis Profile</div>
              {client.diagnosis.map(d=><div key={d} style={{fontSize:12.5,marginBottom:5,display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:7,color:"var(--pine)"}}>◆</span>{d}</div>)}
            </div>
            <div className="card" style={{marginBottom:12}}>
              <div className="card-label">Behaviors & Incidents</div>
              {client.behaviors.map(b=><div key={b} style={{fontSize:12.5,marginBottom:5,display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:7,color:"var(--rose)"}}>▲</span>{b}</div>)}
              <hr className="div"/>
              <div style={{display:"flex",gap:22}}>
                {[[client.incidentCount,"Total incidents"],[client.incidentsYTD,"YTD incidents"],[`${client.coordinatorHrsMonth}h`,"Coord hrs/mo"],[`${client.tenure}yr`,"Tenure"]].map(([v,l])=>(
                  <div key={l}><div style={{fontSize:20,fontWeight:800,fontFamily:"var(--font-d)",color:l==="YTD incidents"&&client.incidentsYTD>5?"var(--rose)":"var(--ink)"}}>{v}</div><div style={{fontSize:9,color:"var(--muted)",fontFamily:"var(--font-m)"}}>{l}</div></div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-label">Internal Notes</div>
              <div style={{fontSize:12.5,lineHeight:1.7,color:"var(--ink2)"}}>{client.notes}</div>
            </div>
          </div>
        )}
        {tab==="Financials"&&(
          <div className="fadein">
            <div className="g2" style={{marginBottom:12}}>
              <div className="card"><div className="card-label">Annual Revenue</div><div className="stat-num" style={{color:"var(--pine)"}}>{fmt$(f.annualRevenue)}</div><div className="stat-note" style={{color:"var(--muted)"}}>Waiver billing</div></div>
              <div className="card"><div className="card-label">Annual Net</div><div className={`stat-num ${f.annualNet>15000?"net-pos":f.annualNet>5000?"net-warn":"net-neg"}`}>{fmt$(f.annualNet)}</div><div className="stat-note" style={{color:marginColor(client.profitMargin)}}>{client.profitMargin}% margin</div></div>
            </div>
            <div className="card" style={{marginBottom:12}}>
              <div className="card-label">Monthly P&L</div>
              {[
                {l:"DD Waiver Billing",v:fmt$(f.monthlyBilling),pos:true},
                {l:"DSP Staffing & Labor",v:`–${fmt$(f.staffingCost)}`,pos:false},
                {l:"Coordinator Time Cost",v:`–${fmt$(f.coordinatorCost)}`,pos:false},
                {l:"Admin & Overhead",v:`–${fmt$(f.adminOverhead)}`,pos:false},
              ].map(r=>(
                <div key={r.l} className="fin-row">
                  <span style={{color:"var(--ink2)",fontSize:12.5}}>{r.l}</span>
                  <span className="fin-val" style={{color:r.pos?"var(--pine)":"var(--rose)"}}>{r.v}</span>
                </div>
              ))}
              <div className="fin-row" style={{borderTop:"2px solid var(--border)",marginTop:6,paddingTop:10}}>
                <span style={{fontWeight:700,fontSize:13}}>Monthly Net</span>
                <span className={`fin-val ${netCls}`} style={{fontSize:15,fontWeight:700}}>{fmt$(f.netMonthly)}</span>
              </div>
            </div>
            <div className="card">
              <div className="card-label">Coordinator Cost Analysis</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"var(--ink2)"}}>Coord cost as % of billing</span>
                <span style={{fontFamily:"var(--font-m)",fontWeight:600,fontSize:12,color:(f.coordinatorCost/f.monthlyBilling)>0.13?"var(--rose)":"var(--amber)"}}>{(f.coordinatorCost/f.monthlyBilling*100).toFixed(1)}%</span>
              </div>
              <div className="prog" style={{marginBottom:10}}><div className="prog-f" style={{width:`${Math.min(f.coordinatorCost/f.monthlyBilling*100*5,100)}%`,background:(f.coordinatorCost/f.monthlyBilling)>0.13?"var(--rose)":"var(--amber)"}}/></div>
              <div style={{padding:"9px 11px",background:"var(--bg)",borderRadius:5,fontSize:12,color:"var(--ink2)",lineHeight:1.65}}>
                At <strong>{client.coordinatorHrsMonth}h/month</strong>, coordinator time = <strong>{fmt$(f.coordinatorCost)}/mo</strong>.
                {client.coordinatorHrsMonth>12
                  ?` ⚠️ Exceeds the ~12h/mo sustainable threshold for SIS ${client.sisLevel}. A BSP review is recommended to reduce incident-driven hours.`
                  :` ✓ Within sustainable range for SIS ${client.sisLevel} on the ${client.waiver}.`}
              </div>
            </div>
          </div>
        )}
        {tab==="AI Analysis"&&(
          <div className="fadein">
            {loading&&msgs.length===0
              ?<div className="ai-bubble assistant"><div className="ai-who assistant">Colorado DD Waiver Agent</div><div className="dots"><span/><span/><span/></div></div>
              :msgs.map((m,i)=><div key={i} className={`ai-bubble ${m.role}`}><div className={`ai-who ${m.role}`}>{m.role==="assistant"?"Colorado DD Waiver Agent":"You"}</div>{m.content}</div>)
            }
            {loading&&msgs.length>0&&<div className="ai-bubble assistant"><div className="ai-who assistant">Colorado DD Waiver Agent</div><div className="dots"><span/><span/><span/></div></div>}
            <div ref={bottomRef}/>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <textarea className="chat-box" rows={2} value={input} onChange={e=>setInput(e.target.value)}
                placeholder={`Ask about ${client.name}…`}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              />
              <button className="btn btn-pine" onClick={send} disabled={loading||!input.trim()} style={{alignSelf:"flex-end"}}>
                {loading?<span className="spin"/>:"Ask"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INTAKE EVALUATOR ────────────────────────────────────────────────────────
function IntakeEvaluator(){
  const [form,setForm]=useState({name:"",age:"",gender:"Male",diagnosis:"",sisLevel:"2",sisScore:"",waiverType:"Comprehensive DD Waiver",placementType:"Supported Living",behaviors:"",incidentHistory:"",priorPlacements:"",dspRate:"22",coordRate:"70"});
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  async function evaluate(){
    if(!form.name||!form.diagnosis){alert("Please enter at least a name and diagnosis.");return;}
    setLoading(true);setResult("");
    const r=await callAI([{role:"user",content:
      `Evaluate this prospective Colorado DD Waiver residential placement referral. Note: Colorado uses SIS Levels 1–6 on the state fee schedule, plus Level 7 (Extraordinary Needs) billed at agency-set rate.\n\n1. PLACEMENT VIABILITY SCORE (0–100) with rationale\n2. PROJECTED MONTHLY FINANCIALS — billing tier for SIS ${form.sisLevel} on ${form.waiverType}, projected DSP cost at $${form.dspRate}/hr, estimated coordinator hours + cost at $${form.coordRate}/hr, projected net margin\n3. CARE COMPLEXITY RATING — Low / Medium / High / Very High based on: diagnosis (${form.diagnosis}), behaviors (${form.behaviors}), incident history (${form.incidentHistory})\n4. PORTFOLIO FIT — does our caseload have capacity and relevant experience for this client?\n5. RISK FLAGS — what could make this placement financially or clinically unsustainable?\n6. RECOMMENDATION — Accept / Accept with Conditions / Decline — with direct, specific reasoning\n\nReferral:\n${JSON.stringify(form,null,2)}`
    }]);
    setResult(r);setLoading(false);
  }

  const fld=(label,key,type,opts)=>(
    <div className="mb12">
      <label className="field-label">{label}</label>
      {opts
        ?<select value={form[key]} onChange={e=>set(key,e.target.value)} className="field-input">{opts.map(o=><option key={o}>{o}</option>)}</select>
        :<input type={type||"text"} value={form[key]} onChange={e=>set(key,e.target.value)} className="field-input"/>
      }
    </div>
  );
  const area=(label,key,ph)=>(
    <div className="mb12">
      <label className="field-label">{label}</label>
      <textarea value={form[key]} onChange={e=>set(key,e.target.value)} rows={3} placeholder={ph} className="field-input" style={{resize:"vertical"}}/>
    </div>
  );

  return (
    <div className="fadein">
      <div className="sh"><div><div className="sh-title">Prospective Client Intake Evaluator</div><div className="sh-sub">Enter referral details — AI projects viability, margin & care complexity</div></div></div>
      <div className="g2">
        <div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-label">Client Information</div>
            {fld("Full Name","name")}
            <div className="g2">{fld("Age","age","number")}{fld("Gender","gender","text",["Male","Female","Non-binary","Other"])}</div>
            {fld("Waiver Type","waiverType","text",["Comprehensive DD Waiver","Supported Living Services (SLS)","Children's Extensive Support (CES)","Adult Autism Waiver"])}
            {fld("Placement Type","placementType","text",["Supported Living","Host Home","Family Model Home","Group Home (3-bed)","ICF-IID"])}
          </div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-label">Clinical Profile</div>
            <div className="g2">{fld("SIS Level (1–7)","sisLevel","text",["1","2","3","4","5","6","7"])}{fld("SIS Score","sisScore","number")}</div>
            {area("Diagnoses","diagnosis","e.g. Intellectual Disability – Moderate, Autism Spectrum Disorder…")}
            {area("Behaviors / Support Needs","behaviors","e.g. Elopement risk, verbal aggression, SIB, pica…")}
            {area("Incident History","incidentHistory","e.g. 3 CIRs in past 12 months, 1 ER visit…")}
            {area("Prior Placements","priorPlacements","e.g. Previous agency, reason for transition, stability…")}
          </div>
          <div className="card" style={{marginBottom:12}}>
            <div className="card-label">Financial Parameters</div>
            <div className="g2">{fld("DSP Hourly Rate ($)","dspRate","number")}{fld("Coordinator Rate ($/hr)","coordRate","number")}</div>
          </div>
          <button className="btn btn-pine" onClick={evaluate} disabled={loading} style={{width:"100%",justifyContent:"center",padding:"11px"}}>
            {loading?<><span className="spin"/>Analyzing Referral…</>:"🔍 Evaluate Placement Viability"}
          </button>
        </div>
        <div>
          {!result&&!loading&&(
            <div className="card" style={{textAlign:"center",padding:"44px 22px"}}>
              <div style={{fontSize:34,marginBottom:12}}>📋</div>
              <div style={{fontFamily:"var(--font-d)",fontSize:15,fontWeight:700,marginBottom:6}}>Ready to Evaluate</div>
              <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.65,marginBottom:16}}>Fill in the referral form and click Evaluate. The AI will assess viability, project financials, and give a clear Accept / Decline recommendation against your current Colorado DD Waiver portfolio.</div>
              <hr className="div"/>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)",textAlign:"left"}}>
                {["SIS-level billing projection","Coordinator hours estimation","Portfolio capacity check","Diagnosis experience match","Go / No-Go recommendation"].map(t=><div key={t} style={{marginBottom:5}}>✓ {t}</div>)}
              </div>
            </div>
          )}
          {loading&&<div className="card" style={{textAlign:"center",padding:"44px 22px"}}><div className="dots" style={{justifyContent:"center",display:"flex",marginBottom:12}}><span/><span/><span/></div><div style={{fontSize:13,color:"var(--muted)"}}>Analyzing referral against portfolio…</div></div>}
          {result&&(
            <div className="card fadein">
              <div className="card-label" style={{marginBottom:10}}>AI Evaluation Report</div>
              <div className="resp-box">{result}</div>
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button className="btn btn-outline" style={{fontSize:11}} onClick={()=>navigator.clipboard.writeText(result)}>📋 Copy</button>
                <button className="btn btn-outline" style={{fontSize:11}} onClick={()=>setResult("")}>↩ New Evaluation</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AGENT CHAT ──────────────────────────────────────────────────────────────
function AgentChat(){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Hello — I'm your Colorado DD Waiver residential placement advisor.\n\nI have full context on your current client portfolio including their SIS levels, diagnosis profiles, incident histories, coordinator hours, and financial performance.\n\nAsk me anything about a client, how to handle a difficult placement, whether to accept a referral, coordinator workload strategy, or Colorado HCPF compliance questions."}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const QUICK=[
    "Which client is closest to break-even and what should we do?",
    "Which clients are strong references for a new SIS 3 referral?",
    "What's causing the high coordinator hours on our complex clients?",
    "New referral: 25yo with ASD and elopement history — what should I ask first?",
    "Summarize our current portfolio risk profile",
  ];

  async function send(text){
    const msg=text||input;
    if(!msg.trim()||loading)return;
    const u={role:"user",content:msg};
    setMsgs(p=>[...p,u]);setInput("");setLoading(true);
    const r=await callAI([...msgs,u].map(m=>({role:m.role,content:m.content})));
    setMsgs(p=>[...p,{role:"assistant",content:r}]);setLoading(false);
  }

  return (
    <div className="fadein" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}>
      <div className="sh" style={{marginBottom:12}}><div><div className="sh-title">Agent Chat</div><div className="sh-sub">Full portfolio context · Colorado DD Waiver expertise · Ask anything</div></div></div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
        {QUICK.map(q=><button key={q} className="quick-btn" onClick={()=>send(q)}>{q}</button>)}
      </div>
      <div style={{flex:1,overflowY:"auto",paddingRight:4}}>
        {msgs.map((m,i)=>(
          <div key={i} className={`ai-bubble ${m.role}`}>
            <div className={`ai-who ${m.role}`}>{m.role==="assistant"?"🏔 Colorado DD Waiver Agent":"👤 You"}</div>
            {m.content}
          </div>
        ))}
        {loading&&<div className="ai-bubble assistant"><div className="ai-who assistant">🏔 Colorado DD Waiver Agent</div><div className="dots"><span/><span/><span/></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <textarea className="chat-box" rows={3} value={input} onChange={e=>setInput(e.target.value)}
          placeholder="Ask about clients, placements, SIS levels, coordinator workload, Colorado HCPF compliance…"
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
        />
        <button className="btn btn-pine" onClick={()=>send()} disabled={loading||!input.trim()} style={{alignSelf:"flex-end",padding:"10px 18px"}}>
          {loading?<span className="spin"/>:"Send"}
        </button>
      </div>
    </div>
  );
}

// ─── DATA MANAGER ────────────────────────────────────────────────────────────
function DataManager(){
  const [drag,setDrag]=useState(false);
  const docs=[
    {name:"Client_SIS_Assessments_2024.pdf",size:"1.8 MB",icon:"📋"},
    {name:"Incident_Reports_Jan-Dec_2024.xlsx",size:"2.1 MB",icon:"📊"},
    {name:"Coordinator_Time_Logs_Q4.csv",size:"640 KB",icon:"🗓"},
    {name:"Waiver_Billing_Statements_2024.pdf",size:"3.4 MB",icon:"💵"},
    {name:"BSP_ClientProfiles_Active.docx",size:"980 KB",icon:"📄"},
  ];
  return (
    <div className="fadein">
      <div className="sh"><div><div className="sh-title">Data & Document Manager</div><div className="sh-sub">Upload SIS assessments, incident reports, billing records & coordinator logs</div></div></div>
      <div className="alert-pine">Documents uploaded here enrich the AI's analysis. Include SIS assessments, incident reports, billing statements, coordinator time logs, and BSPs for the most accurate projections.</div>
      <div className={`drop-zone ${drag?"drag":""}`} style={{marginBottom:20}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);}}>
        <div style={{fontSize:32,marginBottom:10}}>📁</div>
        <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>Drop files here or click to upload</div>
        <div style={{fontSize:12,color:"var(--muted)"}}>PDF, XLSX, CSV, DOCX · Max 50MB</div>
      </div>
      <div className="card" style={{marginBottom:18}}>
        <div className="card-label">Indexed Documents ({docs.length})</div>
        {docs.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<docs.length-1?"1px solid var(--bg2)":"none"}}>
            <span style={{fontSize:16}}>{f.icon}</span>
            <span style={{flex:1,fontFamily:"var(--font-m)",fontSize:12}}>{f.name}</span>
            <span style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--font-m)"}}>{f.size}</span>
            <span className="tag tag-pine" style={{fontSize:9}}>Indexed</span>
          </div>
        ))}
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-label">Proprietary Context Active</div>
          {[["Client SIS Profiles","5 active clients"],["Incident Report History","CIRs 2022–2024"],["Coordinator Time Data","Monthly logs 2024"],["Billing & Revenue","Waiver statements 2024"],["Behavioral Support Plans","All active BSPs"],["Placement History","All current placements"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bg2)",fontSize:12}}>
              <span style={{color:"var(--ink2)"}}>{k}</span><span style={{fontFamily:"var(--font-m)",fontSize:11,color:"var(--pine)",fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-label">CO DD Waiver Knowledge Base</div>
          {[["Waiver Types","Comprehensive, SLS, CES, AAW"],["SIS Billing Tiers","Levels 1–4 rate schedules"],["CDHS Compliance","CIR, BSP, HCPF standards"],["Placement Rate Types","SL, Host Home, FMH, ICF"],["Coord Benchmarks","Hours by SIS level"],["CO Regional Context","RCCO, CDASS, case mgmt"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bg2)",fontSize:12}}>
              <span style={{color:"var(--ink2)"}}>{k}</span><span style={{fontFamily:"var(--font-m)",fontSize:11,color:"var(--sky)",fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("dashboard");
  const [selectedClient,setSelectedClient]=useState(null);

  const nav=[
    {id:"dashboard",icon:"⬡",label:"Dashboard"},
    {id:"intake",icon:"📋",label:"Intake Evaluator"},
    {id:"chat",icon:"💬",label:"Agent Chat"},
    {id:"data",icon:"📂",label:"Data Manager"},
  ];

  const titles={
    dashboard:{t:"Portfolio Dashboard",s:"Colorado DD Waiver · Residential Home Placement"},
    intake:{t:"Intake Evaluator",s:"AI-powered placement viability & financial projection"},
    chat:{t:"Agent Chat",s:"Colorado DD Waiver advisor with full portfolio context"},
    data:{t:"Data Manager",s:"Client records, billing data & document indexing"},
  };

  function openClient(c){setSelectedClient(c);setView("dashboard");}

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <div className="rail">
          <div className="rail-logo">
            <div className="rail-logo-mark">Colorado DD Waiver<br/>Placement Intelligence</div>
            <div className="rail-logo-sub">Residential Services · CO</div>
          </div>
          <div className="rail-section">Navigation</div>
          {nav.map(n=>(
            <div key={n.id} className={`rail-item ${view===n.id&&!selectedClient||view===n.id?"active":""}`} onClick={()=>{setView(n.id);if(n.id!=="dashboard")setSelectedClient(null);}}>
              <span className="rail-icon">{n.icon}</span>{n.label}
            </div>
          ))}
          <div className="rail-section">Clients</div>
          {CLIENTS.map(c=>(
            <div key={c.id} className={`rail-item ${selectedClient?.id===c.id?"active":""}`} onClick={()=>openClient(c)} style={{paddingLeft:14}}>
              <span className={`sis-badge ${sisClass(c.sisLevel)}`} style={{width:18,height:18,fontSize:10,borderRadius:3,minWidth:18,border:"none"}}>{c.sisLevel}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:11.5}}>{c.name.split(" ")[0]} {c.name.split(" ")[1]?.[0]}.</span>
            </div>
          ))}
          <div className="rail-bottom"><div className="live-dot"/><span>AI Agent Active</span></div>
        </div>

        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">{titles[view]?.t}</div>
              <div className="topbar-sub">{titles[view]?.s}</div>
            </div>
            <div style={{display:"flex",gap:9}}>
              {view==="dashboard"&&<button className="btn btn-pine" onClick={()=>setView("intake")}>+ Evaluate New Referral</button>}
              {view!=="chat"&&<button className="btn btn-outline" onClick={()=>{setView("chat");setSelectedClient(null);}}>💬 Ask Agent</button>}
            </div>
          </div>
          <div className="content">
            {view==="dashboard"&&<Dashboard onClient={openClient}/>}
            {view==="intake"&&<IntakeEvaluator/>}
            {view==="chat"&&<AgentChat/>}
            {view==="data"&&<DataManager/>}
          </div>
        </div>

        <ClientPanel client={selectedClient} onClose={()=>setSelectedClient(null)}/>
      </div>
    </>
  );
}
