import { useState, useEffect, useCallback, useRef } from "react";

const P = {
  saffron:"#FF6B35",gold:"#F59E0B",pink:"#EC4899",maroon:"#991B1B",
  purple:"#7C3AED",green:"#059669",teal:"#0D9488",cream:"#FFFBEB",
};

/* ─────────── DATA ─────────── */
const GODS_MAP = {
  ganesh:{e:"🐘",name:"Ganesh"}, krishna:{e:"🦚",name:"Krishna"},
  hanuman:{e:"💪",name:"Hanuman"}, lakshmi:{e:"🪔",name:"Lakshmi"},
  rama:{e:"🏹",name:"Rama"}, shiva:{e:"🔱",name:"Shiva"},
  durga:{e:"⚔️",name:"Durga"}, saraswati:{e:"🎵",name:"Saraswati"},
};

const SPOT_QUESTIONS = [
  {clue:"Who loves BUTTER? 🧈",           target:"krishna",   opts:["ganesh","krishna","hanuman","lakshmi"]},
  {clue:"Who has the TRISHUL? 🔱",         target:"shiva",     opts:["rama","shiva","ganesh","krishna"]},
  {clue:"Who lifted the MOUNTAIN? ⛰️",     target:"hanuman",   opts:["hanuman","rama","shiva","lakshmi"]},
  {clue:"Who plays the FLUTE? 🎵",         target:"krishna",   opts:["saraswati","krishna","ganesh","durga"]},
  {clue:"Who has an ELEPHANT HEAD? 🐘",    target:"ganesh",    opts:["ganesh","hanuman","krishna","shiva"]},
  {clue:"Who uses BOW & ARROW? 🏹",        target:"rama",      opts:["hanuman","durga","rama","krishna"]},
  {clue:"Who rides a LION? 🦁",            target:"durga",     opts:["lakshmi","durga","saraswati","shiva"]},
  {clue:"Who sits on a LOTUS? 🪷",         target:"lakshmi",   opts:["saraswati","lakshmi","durga","ganesh"]},
  {clue:"Who is Rama's best FRIEND? 🐒",   target:"hanuman",   opts:["krishna","hanuman","shiva","ganesh"]},
  {clue:"Who plays the VEENA (sitar)? 🎶", target:"saraswati", opts:["saraswati","lakshmi","durga","parvati"]},
];
GODS_MAP.parvati = {e:"🌸",name:"Parvati"};

const STORIES = [
  {title:"Rama & Ravana",emoji:"🏹",col:P.saffron,slides:[
    {e:"👑",t:"Rama was a kind and brave prince loved by everyone!"},
    {e:"👿",t:"Bad Ravana stole Sita away! 😢"},
    {e:"🐒",t:"Hanuman the super monkey flew to find Sita!"},
    {e:"⚔️",t:"Rama and Hanuman defeated Ravana — BOOM! 💥"},
    {e:"🪔",t:"Everyone lit diyas to welcome Rama home! That's Diwali! 🎉"},
  ]},
  {title:"Ganesha's Race",emoji:"🐘",col:P.gold,slides:[
    {e:"🏁",t:"Shiva said: Race around the world and win! 🌍"},
    {e:"💨",t:"Brother Kartikeya RAN super fast around Earth!"},
    {e:"🐘",t:"Ganesha walked slowly around Mama and Papa..."},
    {e:"❤️",t:"My parents ARE my whole world! said Ganesha. 💕"},
    {e:"🏆",t:"Ganesha won! Love your parents always! 🙏"},
  ]},
  {title:"Baby Krishna",emoji:"🦚",col:P.purple,slides:[
    {e:"👶",t:"Baby Krishna loved BUTTER more than anything! 🧈"},
    {e:"🏺",t:"Mama put butter HIGH up so Krishna can't reach!"},
    {e:"🧗",t:"Clever Krishna climbed on his friends!"},
    {e:"🤝",t:"Krishna shared all the butter with friends! ❤️"},
    {e:"💙",t:"Always share! That's what Krishna teaches us! 🦚"},
  ]},
  {title:"Prahlad & Holi",emoji:"🌈",col:P.pink,slides:[
    {e:"👦",t:"Prahlad loved praying to Vishnu every day! 🙏"},
    {e:"😡",t:"His mean dad didn't like Vishnu at all! 👿"},
    {e:"🔥",t:"Evil Holika tried to burn Prahlad in fire!"},
    {e:"✨",t:"Vishnu saved Prahlad! He was totally safe! ✅"},
    {e:"🌈",t:"We throw colors on Holi to celebrate! 🎊"},
  ]},
];

const SHLOKAS = [
  {title:"Ganesh Mantra",deity:"🐘",col:P.saffron,
   hindi:"वक्रतुण्ड महाकाय",roman:"Vakratunda Mahakaya",
   meaning:"O Ganesh, remove my obstacles!"},
  {title:"Om Namah Shivaya",deity:"🔱",col:P.purple,
   hindi:"ॐ नमः शिवाय",roman:"Om Namah Shivaya",
   meaning:"I bow to Lord Shiva!"},
  {title:"Gayatri Mantra",deity:"☀️",col:P.gold,
   hindi:"ॐ भूर्भुवः स्वः",roman:"Om Bhur Bhuva Swah",
   meaning:"Dear Sun, make me wise!"},
];

/* ─────────── HELPERS ─────────── */
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

const root = {
  fontFamily:"'Baloo 2','Comic Sans MS',cursive",
  minHeight:"100vh",
  background:"radial-gradient(ellipse at top,#FEF3C7 0%,#FFFBEB 70%,#FEF9EE 100%)",
  userSelect:"none",WebkitUserSelect:"none",
};

function BackBtn({onBack,col=P.saffron}){
  return <button onClick={onBack} style={{background:"white",border:`2.5px solid ${col}`,borderRadius:14,
    padding:"8px 18px",fontFamily:"inherit",fontSize:14,fontWeight:800,color:col,cursor:"pointer",
    marginBottom:14,display:"block"}}>← Home</button>;
}
function TapBtn({onClick,bg,children,style={}}){
  return <button onClick={onClick}
    onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"}
    onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    onTouchStart={e=>e.currentTarget.style.transform="scale(0.93)"}
    onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
    style={{background:bg,border:"none",borderRadius:18,padding:"14px 28px",
      fontFamily:"inherit",fontSize:17,fontWeight:800,color:"white",
      cursor:"pointer",transition:"transform .12s",...style}}>{children}</button>;
}

/* ─────────── 🪔 DIYA SIMON SAYS ─────────── */
function DiyaGame({onBack}){
  const N=6;
  const [seq,setSeq]=useState([]);
  const [playerSeq,setPlayerSeq]=useState([]);
  const [lit,setLit]=useState(-1);
  const [phase,setPhase]=useState("intro"); // intro|showing|playing|wrong|levelup
  const [level,setLevel]=useState(0);
  const [wrongIdx,setWrongIdx]=useState(-1);
  const lockRef=useRef(false);

  const showSeq=useCallback((s)=>{
    setPhase("showing");lockRef.current=true;setLit(-1);
    let i=0;
    const tick=()=>{
      if(i>=s.length){setLit(-1);lockRef.current=false;setPhase("playing");return;}
      setLit(s[i]);
      setTimeout(()=>{setLit(-1);setTimeout(()=>{i++;tick();},280);},620);
    };
    setTimeout(tick,700);
  },[]);

  const startRound=useCallback((prevSeq=[])=>{
    const ns=[...prevSeq,Math.floor(Math.random()*N)];
    setSeq(ns);setPlayerSeq([]);setWrongIdx(-1);
    showSeq(ns);
  },[showSeq]);

  const restart=()=>{setLevel(0);setSeq([]);setPlayerSeq([]);setWrongIdx(-1);setPhase("intro");};

  const tapDiya=idx=>{
    if(lockRef.current||phase!=="playing")return;
    const newP=[...playerSeq,idx];
    const pos=newP.length-1;
    setLit(idx);setTimeout(()=>setLit(-1),250);
    if(newP[pos]!==seq[pos]){
      setWrongIdx(idx);setPhase("wrong");return;
    }
    setPlayerSeq(newP);
    if(newP.length===seq.length){
      setLevel(l=>l+1);setPhase("levelup");
      setTimeout(()=>startRound(seq),1200);
    }
  };

  const phaseMsg={
    intro:"Watch the diyas glow, then tap them in the same order! 🪔",
    showing:"👀 Watch carefully...",
    playing:"👆 Now tap in order!",
    wrong:`❌ Oops! You tapped wrong! Level was ${seq.length-1}`,
    levelup:"🎉 Amazing! Adding one more diya!",
  };

  return(
    <div style={{...root,padding:16,textAlign:"center"}}>
      <BackBtn onBack={onBack} col="#EA580C"/>
      <div style={{fontSize:24,fontWeight:800,color:P.maroon,marginBottom:4}}>🪔 Light the Diyas!</div>
      {level>0&&<div style={{fontSize:15,color:P.gold,fontWeight:800,marginBottom:4}}>
        Level {level} {"⭐".repeat(Math.min(level,7))}
      </div>}
      <div style={{fontSize:13,color:"#B45309",marginBottom:20,minHeight:20}}>{phaseMsg[phase]}</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:300,margin:"0 auto 28px"}}>
        {Array.from({length:N},(_,i)=>{
          const isLit=lit===i;
          const isWrong=wrongIdx===i&&phase==="wrong";
          return(
            <div key={i} onClick={()=>tapDiya(i)} style={{
              fontSize:isLit?50:38,cursor:phase==="playing"?"pointer":"default",
              padding:10,background:isLit?"#FEF3C7":isWrong?"#FEE2E2":"white",
              borderRadius:20,border:`3px solid ${isLit?"#F59E0B":isWrong?"#DC2626":"#FDE68A"}`,
              boxShadow:isLit?"0 0 24px rgba(245,158,11,.8)":isWrong?"0 0 16px rgba(220,38,38,.5)":"none",
              transition:"all .15s",transform:isLit?"scale(1.18)":isWrong?"scale(0.9)":"scale(1)",
            }}>🪔</div>
          );
        })}
      </div>

      {(phase==="intro"||phase==="wrong")&&(
        <TapBtn onClick={()=>startRound([])} bg={P.saffron} style={{boxShadow:`0 4px 16px ${P.saffron}55`}}>
          {phase==="intro"?"Start! 🪔":"Try Again! 💪"}
        </TapBtn>
      )}
      {phase==="levelup"&&<div style={{fontSize:40}}>🎉</div>}
    </div>
  );
}

/* ─────────── 🔍 SPOT THE GOD ─────────── */
function SpotGame({onBack}){
  const [pool]=useState(()=>shuffle(SPOT_QUESTIONS));
  const [qi,setQi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const [shake,setShake]=useState(null);
  const [bounce,setBounce]=useState(null);

  const q=pool[qi];

  const answer=g=>{
    if(picked)return;
    setPicked(g);
    if(g===q.target){
      setScore(s=>s+1);setBounce(g);
      setTimeout(()=>{
        setBounce(null);
        if(qi>=pool.length-1){setDone(true);return;}
        setQi(i=>i+1);setPicked(null);
      },1100);
    }else{
      setShake(g);
      setTimeout(()=>setShake(null),600);
    }
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{fontSize:64,marginTop:20}}>🏆</div>
      <div style={{fontSize:26,fontWeight:800,color:P.maroon,marginTop:8}}>शाबाश!</div>
      <div style={{fontSize:18,color:"#B45309",marginTop:6}}>{score}/{pool.length} correct! 🌟</div>
      <div style={{fontSize:24,letterSpacing:3,marginTop:8}}>
        {Array.from({length:pool.length},(_,i)=><span key={i} style={{opacity:i<score?1:.2}}>⭐</span>)}
      </div>
      <TapBtn onClick={()=>{setQi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.purple}
        style={{marginTop:20}}>Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{fontSize:22,fontWeight:800,color:P.maroon,marginBottom:4}}>🔍 Spot the God!</div>
      <div style={{fontSize:13,color:"#B45309",marginBottom:16}}>Q {qi+1}/{pool.length} · Score: {score} ⭐</div>

      <div style={{background:"white",borderRadius:24,padding:"22px 16px",border:`3px solid ${P.purple}`,
        boxShadow:`0 6px 20px ${P.purple}33`,marginBottom:20}}>
        <div style={{fontSize:28,fontWeight:800,color:"#1F2937",lineHeight:1.4}}>{q.clue}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,maxWidth:380,margin:"0 auto"}}>
        {shuffle(q.opts).map(g=>{
          const god=GODS_MAP[g];
          const isTarget=g===q.target;
          const isWrong=picked===g&&!isTarget;
          let bg="white",border=`3px solid #E5E7EB`,extra={};
          if(picked){
            if(isTarget){bg="#D1FAE5";border=`3px solid ${P.green}`;
              if(bounce===g)extra={transform:"scale(1.12)",transition:"transform .2s"};}
            else if(isWrong){bg="#FEE2E2";border="3px solid #DC2626";
              extra={animation:"none",transform:shake===g?"translateX(6px)":"translateX(0)",transition:"transform .1s"};}
          }
          return(
            <button key={g} onClick={()=>answer(g)} style={{
              background:bg,border,borderRadius:22,padding:"20px 8px",
              cursor:"pointer",fontFamily:"inherit",transition:"all .2s",...extra,
            }}>
              <div style={{fontSize:50}}>{god?.e||"❓"}</div>
              <div style={{fontSize:16,fontWeight:800,color:"#374151",marginTop:8}}>{god?.name||g}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── 🃏 MEMORY GAME ─────────── */
function MemoryGame({onBack}){
  const items=Object.entries(GODS_MAP).slice(0,6).map(([id,v])=>({id,...v}));
  const make=()=>shuffle([...items.map((c,i)=>({...c,key:`a${i}`,f:false,m:false})),...items.map((c,i)=>({...c,key:`b${i}`,f:false,m:false}))]);
  const [cards,setCards]=useState(make);
  const [sel,setSel]=useState([]);
  const [moves,setMoves]=useState(0);
  const [won,setWon]=useState(false);
  const [locked,setLocked]=useState(false);

  const flip=idx=>{
    if(locked||cards[idx].f||cards[idx].m)return;
    const next=cards.map((c,i)=>i===idx?{...c,f:true}:c);
    const ns=[...sel,idx];
    setCards(next);
    if(ns.length===2){
      setLocked(true);setMoves(m=>m+1);
      const[a,b]=ns;
      if(next[a].id===next[b].id){
        setTimeout(()=>{
          setCards(c=>{const u=c.map((x,i)=>(i===a||i===b)?{...x,m:true}:x);if(u.every(x=>x.m))setWon(true);return u;});
          setSel([]);setLocked(false);
        },400);
      }else{
        setTimeout(()=>{setCards(c=>c.map((x,i)=>(i===a||i===b)?{...x,f:false}:x));setSel([]);setLocked(false);},900);
      }
    }else setSel(ns);
  };

  const reset=()=>{setCards(make());setMoves(0);setWon(false);setSel([]);setLocked(false);};

  if(won)return(
    <div style={{...root,padding:16,textAlign:"center"}}>
      <BackBtn onBack={onBack}/>
      <div style={{fontSize:70,marginTop:20}}>🏆</div>
      <div style={{fontSize:24,fontWeight:800,color:P.green,marginTop:8}}>शाबाश! You did it!</div>
      <div style={{color:"#6B7280",marginTop:4}}>{moves} moves! 🌟</div>
      <TapBtn onClick={reset} bg={P.saffron} style={{marginTop:20}}>Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:14}}>
      <BackBtn onBack={onBack}/>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:22,fontWeight:800,color:P.maroon}}>🃏 Match the Cards!</div>
        <div style={{color:"#B45309",fontSize:13}}>Find the pairs! Moves: {moves} 🌟</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,maxWidth:400,margin:"0 auto"}}>
        {cards.map((c,idx)=>{
          const show=c.f||c.m;
          return(
            <div key={c.key} onClick={()=>flip(idx)} style={{
              aspectRatio:"1",borderRadius:12,cursor:"pointer",
              background:c.m?"#D1FAE5":show?"#FFF8EE":`linear-gradient(135deg,${P.saffron},${P.gold})`,
              border:`2.5px solid ${c.m?P.green:show?P.saffron:"rgba(255,107,53,.3)"}`,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              transition:"all .18s",boxShadow:c.m?"0 0 10px rgba(5,150,105,.3)":"none",
            }}>
              {show?<><div style={{fontSize:22}}>{c.e}</div><div style={{fontSize:8,fontWeight:800,color:"#374151",marginTop:1}}>{c.name}</div></>:<div style={{fontSize:20}}>🕉️</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── 📖 STORIES ─────────── */
function StoriesScreen({onBack}){
  const[chosen,setChosen]=useState(null);
  const[slide,setSlide]=useState(0);
  if(!chosen)return(
    <div style={{...root,padding:14}}>
      <BackBtn onBack={onBack} col={P.green}/>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:20,fontWeight:800,color:P.maroon}}>📖 Epic Stories</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:400,margin:"0 auto"}}>
        {STORIES.map((st,i)=>(
          <button key={i} onClick={()=>{setChosen(st);setSlide(0);}} style={{
            background:"white",border:`3px solid ${st.col}`,borderRadius:20,
            padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",
            gap:14,boxShadow:`0 4px 14px ${st.col}33`,fontFamily:"inherit",
          }}>
            <div style={{fontSize:38}}>{st.emoji}</div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:16,fontWeight:800,color:st.col}}>{st.title}</div>
              <div style={{fontSize:11,color:"#6B7280"}}>{st.slides.length} slides 📖</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
  const s=chosen.slides[slide];
  const isLast=slide===chosen.slides.length-1;
  return(
    <div style={{...root,padding:14,textAlign:"center"}}>
      <button onClick={()=>setChosen(null)} style={{background:"white",border:`2.5px solid ${chosen.col}`,
        borderRadius:14,padding:"8px 18px",fontFamily:"inherit",fontSize:14,fontWeight:800,
        color:chosen.col,cursor:"pointer",marginBottom:14,display:"block"}}>← Stories</button>
      <div style={{fontSize:16,fontWeight:800,color:chosen.col,marginBottom:14}}>{chosen.emoji} {chosen.title}</div>
      <div style={{background:"white",borderRadius:26,padding:"32px 22px",border:`3px solid ${chosen.col}`,
        boxShadow:`0 8px 28px ${chosen.col}44`,minHeight:200,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",marginBottom:18}}>
        <div style={{fontSize:72,marginBottom:16}}>{s.e}</div>
        <div style={{fontSize:18,fontWeight:700,color:"#1F2937",lineHeight:1.5,maxWidth:280}}>{s.t}</div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18}}>
        {chosen.slides.map((_,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",
          background:i<=slide?chosen.col:"#E5E7EB",transition:"background .3s",cursor:"pointer"}}
          onClick={()=>setSlide(i)}/>)}
      </div>
      {isLast?(
        <div>
          <div style={{fontSize:18,fontWeight:800,color:P.green,marginBottom:12}}>🎉 The End! Amazing!</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <TapBtn bg={chosen.col} onClick={()=>setSlide(0)}>Again! 🔄</TapBtn>
            <button onClick={()=>setChosen(null)} style={{background:"white",color:chosen.col,
              border:`2px solid ${chosen.col}`,borderRadius:18,padding:"14px 22px",
              fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>More 📖</button>
          </div>
        </div>
      ):<TapBtn bg={chosen.col} onClick={()=>setSlide(p=>p+1)} style={{padding:"16px 56px",fontSize:19,
        boxShadow:`0 4px 16px ${chosen.col}55`}}>Next →</TapBtn>}
    </div>
  );
}

/* ─────────── 🕉️ SHLOKAS ─────────── */
function ShlokasScreen({onBack}){
  const[si,setSi]=useState(0);
  const[chanting,setChanting]=useState(false);
  const[count,setCount]=useState(0);
  const s=SHLOKAS[si];
  const chant=()=>{setChanting(true);setCount(c=>c+1);setTimeout(()=>setChanting(false),2000);};
  return(
    <div style={{...root,padding:14}}>
      <BackBtn onBack={onBack} col={P.pink}/>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:20,fontWeight:800,color:P.maroon}}>🕉️ Sacred Shlokas</div>
        {count>0&&<div style={{color:P.gold,fontSize:13,fontWeight:700}}>You chanted {count} times! 🙏</div>}
      </div>
      <div style={{background:"white",borderRadius:26,padding:"22px 18px",border:`3px solid ${s.col}`,
        boxShadow:`0 8px 28px ${s.col}44`,textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:chanting?62:52,transition:"font-size .25s",display:"inline-block",
          transform:chanting?"scale(1.2)":"scale(1)",transition:"transform .25s"}}>{s.deity}</div>
        {chanting&&<div style={{fontSize:13,color:s.col,fontWeight:700,letterSpacing:3,marginTop:4}}>🔔 ॐ ॐ ॐ 🔔</div>}
        <div style={{fontSize:16,fontWeight:800,color:s.col,margin:"10px 0 12px"}}>{s.title}</div>
        <div style={{fontSize:22,color:"#1F2937",fontWeight:700,lineHeight:2,marginBottom:10}}>{s.hindi}</div>
        <div style={{fontSize:13,color:"#6B7280",marginBottom:10}}>{s.roman}</div>
        <div style={{background:"#FEF3C7",borderRadius:12,padding:"10px 12px",fontSize:13,color:"#92400E"}}>
          💡 {s.meaning}
        </div>
      </div>
      <button onClick={chant} style={{
        width:"100%",background:chanting?P.green:s.col,color:"white",border:"none",
        borderRadius:18,padding:16,fontSize:18,fontWeight:800,cursor:"pointer",
        fontFamily:"inherit",marginBottom:14,transition:"background .3s",
        boxShadow:`0 4px 16px ${s.col}55`,
      }}>{chanting?"🔔 Chanting... 🙏":"🙏 Tap to Chant!"}</button>
      <div style={{display:"flex",justifyContent:"center",gap:8}}>
        {SHLOKAS.map((sh,i)=>(
          <button key={i} onClick={()=>{setSi(i);setChanting(false);}} style={{
            fontSize:22,background:i===si?sh.col:"#FEF3C7",border:`2.5px solid ${sh.col}`,
            borderRadius:"50%",width:46,height:46,cursor:"pointer",transition:"all .2s",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>{sh.deity}</button>
        ))}
      </div>
    </div>
  );
}

/* ─────────── 🏠 HOME ─────────── */
function HomeScreen({onSelect}){
  const tiles=[
    {id:"diya",   e:"🪔",title:"Diya Game!",    sub:"Simon Says — light them!",col:"#EA580C",bg:"#FFF5EE"},
    {id:"spot",   e:"🔍",title:"Spot the God!", sub:"Find the right one!",     col:P.purple, bg:"#F5F0FF"},
    {id:"memory", e:"🃏",title:"Match Cards",   sub:"Find the pairs!",          col:P.teal,  bg:"#EEFAFA"},
    {id:"stories",e:"📖",title:"Epic Stories",  sub:"Brave tales!",             col:P.green, bg:"#EEFAF5"},
    {id:"shlokas",e:"🕉️",title:"Shlokas",       sub:"Chant together!",          col:P.pink,  bg:"#FFF0F7"},
  ];
  return(
    <div style={{...root,padding:"20px 14px",textAlign:"center"}}>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:52,marginBottom:4}}>🕉️</div>
        <h1 style={{margin:0,fontSize:28,fontWeight:800,color:P.maroon,letterSpacing:-1}}>Dharma Fun!</h1>
        <p style={{margin:"4px 0 0",color:"#B45309",fontSize:13,fontWeight:700}}>For Little Learners 🌸</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
        {tiles.map(g=>(
          <button key={g.id} onClick={()=>onSelect(g.id)}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.92)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e=>e.currentTarget.style.transform="scale(0.92)"}
            onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            style={{background:g.bg,border:`3px solid ${g.col}`,borderRadius:22,
              padding:"18px 8px",cursor:"pointer",transition:"transform .12s",
              boxShadow:`0 4px 16px ${g.col}44`,fontFamily:"inherit",
              gridColumn:g.id==="shlokas"?"1 / -1":"auto"}}>
            <div style={{fontSize:34,marginBottom:6}}>{g.e}</div>
            <div style={{fontSize:15,fontWeight:800,color:g.col}}>{g.title}</div>
            <div style={{fontSize:11,color:"#6B7280",marginTop:3}}>{g.sub}</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:24,fontSize:18,letterSpacing:10,color:P.gold}}>🌸🪔🌸🪔🌸</div>
    </div>
  );
}

export default function App(){
  const[screen,setScreen]=useState("home");
  useEffect(()=>{
    const l=document.createElement("link");l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap";
    document.head.appendChild(l);
  },[]);
  if(screen==="diya")    return <DiyaGame    onBack={()=>setScreen("home")}/>;
  if(screen==="spot")    return <SpotGame    onBack={()=>setScreen("home")}/>;
  if(screen==="memory")  return <MemoryGame  onBack={()=>setScreen("home")}/>;
  if(screen==="stories") return <StoriesScreen onBack={()=>setScreen("home")}/>;
  if(screen==="shlokas") return <ShlokasScreen onBack={()=>setScreen("home")}/>;
  return <HomeScreen onSelect={setScreen}/>;
}
