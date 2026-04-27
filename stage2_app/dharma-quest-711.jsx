import { useState, useEffect } from "react";

const P={saffron:"#FF6B35",gold:"#F59E0B",pink:"#EC4899",maroon:"#991B1B",
  purple:"#7C3AED",green:"#059669",teal:"#0D9488",blue:"#2563EB",orange:"#D97706"};

/* ─────────── DATA ─────────── */
const SCRAMBLE_WORDS = [
  {word:"GANESH",   hint:"Elephant God 🐘",         emoji:"🐘"},
  {word:"KRISHNA",  hint:"Flute player 🦚",          emoji:"🦚"},
  {word:"HANUMAN",  hint:"Rama's monkey devotee 💪", emoji:"💪"},
  {word:"DIWALI",   hint:"Festival of Lights 🪔",    emoji:"🪔"},
  {word:"RAMAYANA", hint:"Epic story of Rama 🏹",    emoji:"🏹"},
  {word:"SHIVA",    hint:"God with Trishul 🔱",      emoji:"🔱"},
  {word:"DURGA",    hint:"Warrior Goddess ⚔️",       emoji:"⚔️"},
  {word:"LAKSHMI",  hint:"Goddess of wealth 💰",     emoji:"🪔"},
  {word:"HOLI",     hint:"Festival of Colors 🌈",    emoji:"🌈"},
  {word:"DHARMA",   hint:"Righteous duty 🕉️",        emoji:"🕉️"},
  {word:"KARMA",    hint:"Your actions decide fate ⚡",emoji:"⚡"},
  {word:"VEDAS",    hint:"Ancient holy scriptures 📜",emoji:"📜"},
];

const TIMELINES = [
  {title:"Ramayana — The Journey", col:P.saffron, emoji:"🏹",
   events:shuffle2([
     {t:"Rama is born as the prince of Ayodhya",    order:1},
     {t:"Rama is sent to the forest for 14 years",  order:2},
     {t:"Ravana kidnaps Sita and takes her to Lanka",order:3},
     {t:"Hanuman crosses the ocean to find Sita",   order:4},
     {t:"Rama defeats Ravana and saves Sita",       order:5},
     {t:"Rama returns home — people light Diyas!",  order:6},
   ])},
  {title:"Krishna's Life", col:P.purple, emoji:"🦚",
   events:shuffle2([
     {t:"Krishna is born in a prison in Mathura",   order:1},
     {t:"Baby Krishna steals butter from everyone", order:2},
     {t:"Krishna defeats the giant serpent Kaliya", order:3},
     {t:"Krishna lifts Govardhan Mountain",         order:4},
     {t:"Krishna gives Arjuna the Bhagavad Gita",   order:5},
     {t:"Pandavas win the Kurukshetra War",         order:6},
   ])},
  {title:"Ganesha's Story", col:P.orange, emoji:"🐘",
   events:shuffle2([
     {t:"Parvati creates Ganesha from clay",        order:1},
     {t:"Ganesha guards Parvati's door",            order:2},
     {t:"Shiva does not know Ganesha and fights",   order:3},
     {t:"Ganesha's head is cut off by Shiva",       order:4},
     {t:"Shiva replaces Ganesha's head with an elephant's", order:5},
     {t:"Ganesha becomes the first god to be worshipped!", order:6},
   ])},
];

function shuffle2(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

const DEEP_QUIZ = [
  {cat:"⚔️ Epics",   q:"Who wrote the Ramayana?",                a:["Valmiki","Vyasa","Tulsidas","Kalidasa"],       ok:0, fact:"Sage Valmiki wrote the original Ramayana in Sanskrit!"},
  {cat:"⚔️ Epics",   q:"How many days did the Kurukshetra War last?", a:["18 days","7 days","30 days","14 days"],   ok:0, fact:"The great Mahabharata war lasted exactly 18 days!"},
  {cat:"⚔️ Epics",   q:"Who is Arjuna's charioteer in the Mahabharata?", a:["Krishna","Hanuman","Bhima","Yudhishthir"],ok:0,fact:"Krishna himself became Arjuna's charioteer — and gave him the Bhagavad Gita!"},
  {cat:"🐘 Gods",     q:"How many arms does Goddess Durga have?",  a:["8 arms","4 arms","6 arms","10 arms"],         ok:0, fact:"Durga has 8 arms, each holding a different weapon!"},
  {cat:"🐘 Gods",     q:"What is Vishnu's bird vehicle?",          a:["Garuda","Peacock","Swan","Nandi"],            ok:0, fact:"Garuda is the giant eagle who carries Lord Vishnu!"},
  {cat:"🪔 Festivals",q:"Navratri means how many nights?",         a:["9 nights","7 nights","5 nights","11 nights"],ok:0, fact:"Nava = 9, Ratri = night — nine nights of Goddess Durga!"},
  {cat:"🪔 Festivals",q:"What do we float on water at Chhath Puja?", a:["Diyas","Flowers","Leaves","Lamps"],        ok:0, fact:"Diyas and offerings are floated on rivers during Chhath Puja to worship the Sun!"},
  {cat:"📜 Scripture",q:"The Bhagavad Gita has how many chapters?", a:["18","12","7","24"],                          ok:0, fact:"The Bhagavad Gita has 18 chapters, just like the 18 days of the war!"},
  {cat:"📜 Scripture",q:"What are the four Vedas?",                 a:["Rig, Sama, Yajur, Atharva","Rig, Ram, Gita, Purana","Upanishad, Purana, Veda, Gita","None of these"],ok:0,fact:"The four Vedas are Rigveda, Samaveda, Yajurveda, and Atharvaveda!"},
  {cat:"🐘 Gods",     q:"Who is the twin brother of Lord Rama?",   a:["Lakshmana","Bharata","Shatrughna","None"],   ok:0, fact:"Rama had three brothers — Lakshmana, Bharata, and Shatrughna!"},
  {cat:"⚔️ Epics",   q:"Who is Karna's mother?",                  a:["Kunti","Gandhari","Draupadi","Sita"],         ok:0, fact:"Karna was born to Kunti before she married the Pandava king — a great secret!"},
  {cat:"📜 Scripture",q:"The Mahabharata was written by?",         a:["Vyasa","Valmiki","Brahma","Narada"],          ok:0, fact:"Sage Vyasa composed the Mahabharata — it is the world's longest epic!"},
];

const PAIRS_SETS = [
  {title:"Gods & Their Vehicles 🚗", col:P.teal,
   pairs:[
     {left:{e:"🐘",t:"Ganesh"},    right:{e:"🐭",t:"Mouse"}},
     {left:{e:"🦚",t:"Krishna"},   right:{e:"🦚",t:"Peacock"}},
     {left:{e:"🔱",t:"Shiva"},     right:{e:"🐂",t:"Nandi Bull"}},
     {left:{e:"🪔",t:"Lakshmi"},   right:{e:"🦉",t:"Owl"}},
     {left:{e:"🎵",t:"Saraswati"}, right:{e:"🦢",t:"Swan"}},
     {left:{e:"⚔️",t:"Durga"},     right:{e:"🦁",t:"Lion"}},
   ]},
  {title:"Gods & Their Weapons ⚔️", col:P.pink,
   pairs:[
     {left:{e:"🔱",t:"Shiva"},     right:{e:"🔱",t:"Trishul"}},
     {left:{e:"🏹",t:"Rama"},      right:{e:"🏹",t:"Bow & Arrow"}},
     {left:{e:"💪",t:"Hanuman"},   right:{e:"🪵",t:"Mace (Gada)"}},
     {left:{e:"⚔️",t:"Durga"},     right:{e:"⚔️",t:"Many swords"}},
     {left:{e:"🦚",t:"Krishna"},   right:{e:"💫",t:"Sudarshana Chakra"}},
     {left:{e:"🐘",t:"Ganesh"},    right:{e:"🪝",t:"Ankush (hook)"}},
   ]},
];

/* ─────────── HELPERS ─────────── */
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

const root={fontFamily:"'Baloo 2','Nunito',sans-serif",minHeight:"100vh",
  background:"linear-gradient(135deg,#EFF6FF 0%,#F0FDF4 50%,#EFF6FF 100%)",
  userSelect:"none",WebkitUserSelect:"none"};

function BackBtn({onBack,col=P.blue}){
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
    style={{background:bg,border:"none",borderRadius:18,padding:"12px 24px",fontFamily:"inherit",
      fontSize:16,fontWeight:800,color:"white",cursor:"pointer",transition:"transform .12s",...style}}>
    {children}</button>;
}

/* ─────────── 🔤 WORD SCRAMBLE ─────────── */
function WordScramble({onBack}){
  const [words]=useState(()=>shuffle(SCRAMBLE_WORDS));
  const [wi,setWi]=useState(0);
  const [letters,setLetters]=useState([]);
  const [typed,setTyped]=useState([]);
  const [status,setStatus]=useState("playing"); // playing|correct|wrong
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    const w=words[wi].word;
    setLetters(shuffle(w.split("").map((l,i)=>({l,i,used:false}))));
    setTyped([]);setStatus("playing");
  },[wi]);

  const tapLetter=lt=>{
    if(lt.used||status!=="playing")return;
    const newTyped=[...typed,lt];
    const newLetters=letters.map(x=>x.i===lt.i&&x.l===lt.l?{...x,used:true}:x);
    setLetters(newLetters);setTyped(newTyped);
    const attempt=newTyped.map(x=>x.l).join("");
    const word=words[wi].word;
    if(newTyped.length===word.length){
      if(attempt===word){
        setStatus("correct");setScore(s=>s+1);
        setTimeout(()=>{
          if(wi>=words.length-1){setDone(true);return;}
          setWi(i=>i+1);
        },1400);
      }else{
        setStatus("wrong");
        setTimeout(()=>{
          setLetters(letters.map(x=>({...x,used:false})));
          setTyped([]);setStatus("playing");
        },900);
      }
    }
  };

  const removeLast=()=>{
    if(typed.length===0||status!=="playing")return;
    const last=typed[typed.length-1];
    setTyped(t=>t.slice(0,-1));
    setLetters(l=>l.map(x=>x.i===last.i&&x.l===last.l&&x.used?{...x,used:false}:x));
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.blue}/>
      <div style={{fontSize:60,marginTop:20}}>🏆</div>
      <div style={{fontSize:24,fontWeight:800,color:P.maroon,marginTop:10}}>Word Master!</div>
      <div style={{fontSize:18,color:"#B45309",marginTop:6}}>{score}/{words.length} words! 🌟</div>
      <TapBtn onClick={()=>{setWi(0);setScore(0);setDone(false);}} bg={P.blue} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  const word=words[wi];
  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.blue}/>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:22,fontWeight:800,color:P.maroon}}>🔤 Word Scramble!</div>
        <div style={{color:"#374151",fontSize:13}}>Word {wi+1}/{words.length} · Score: {score} ⭐</div>
      </div>

      {/* Progress */}
      <div style={{height:8,background:"#BFDBFE",borderRadius:99,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",background:P.blue,borderRadius:99,width:`${(wi/words.length)*100}%`,transition:"width .4s"}}/>
      </div>

      {/* Hint */}
      <div style={{background:"white",borderRadius:20,padding:"16px 14px",border:`2.5px solid ${P.blue}`,
        boxShadow:`0 4px 14px ${P.blue}22`,textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:40,marginBottom:6}}>{word.emoji}</div>
        <div style={{fontSize:16,fontWeight:800,color:"#1F2937"}}>{word.hint}</div>
      </div>

      {/* Answer boxes */}
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {word.word.split("").map((_,i)=>{
          const filled=typed[i];
          return(
            <div key={i} style={{width:40,height:48,borderRadius:12,border:`2.5px solid ${
              status==="correct"?P.green:status==="wrong"?"#DC2626":filled?"#2563EB":"#BFDBFE"}`,
              background:status==="correct"?"#D1FAE5":status==="wrong"?"#FEE2E2":filled?"#EFF6FF":"white",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:20,fontWeight:800,color:status==="correct"?P.green:status==="wrong"?"#DC2626":P.blue,
              transition:"all .2s",transform:status==="correct"?"scale(1.1)":status==="wrong"?"scale(0.95)":"scale(1)",
            }}>
              {filled?.l||""}
            </div>
          );
        })}
      </div>

      {/* Status */}
      {status==="correct"&&<div style={{textAlign:"center",fontSize:22,fontWeight:800,color:P.green,marginBottom:12}}>🎉 Correct!</div>}
      {status==="wrong"&&<div style={{textAlign:"center",fontSize:18,fontWeight:800,color:"#DC2626",marginBottom:12}}>❌ Wrong order! Try again!</div>}

      {/* Letter buttons */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:14}}>
        {letters.map((lt,i)=>(
          <button key={i} onClick={()=>tapLetter(lt)} style={{
            width:46,height:52,borderRadius:14,border:`2.5px solid ${lt.used?"#E5E7EB":P.blue}`,
            background:lt.used?"#F3F4F6":"white",fontSize:20,fontWeight:800,
            color:lt.used?"#9CA3AF":P.blue,cursor:lt.used?"default":"pointer",
            fontFamily:"inherit",transition:"all .15s",
          }}>{lt.l}</button>
        ))}
      </div>

      <div style={{textAlign:"center"}}>
        <button onClick={removeLast} style={{background:"#FEE2E2",border:"2px solid #DC2626",borderRadius:14,
          padding:"10px 20px",fontSize:14,fontWeight:800,color:"#DC2626",cursor:"pointer",
          fontFamily:"inherit"}}>⌫ Delete</button>
      </div>
    </div>
  );
}

/* ─────────── 📋 TIMELINE ─────────── */
function TimelineGame({onBack}){
  const [ti,setTi]=useState(0);
  const tl=TIMELINES[ti];
  const [placed,setPlaced]=useState([]); // correctly placed (in order 1..N)
  const [events,setEvents]=useState(()=>shuffle2([...TIMELINES[0].events]));
  const [wrong,setWrong]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    setEvents(shuffle2([...TIMELINES[ti].events]));
    setPlaced([]);setWrong(null);
  },[ti]);

  const tap=ev=>{
    if(wrong===ev.t)return;
    const nextOrder=placed.length+1;
    if(ev.order===nextOrder){
      const np=[...placed,ev];
      setPlaced(np);
      if(np.length===tl.events.length){
        setScore(s=>s+1);
        setTimeout(()=>{
          if(ti>=TIMELINES.length-1){setDone(true);return;}
          setTi(i=>i+1);
        },1400);
      }
    }else{
      setWrong(ev.t);setTimeout(()=>setWrong(null),700);
    }
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.orange}/>
      <div style={{fontSize:60,marginTop:20}}>🏆</div>
      <div style={{fontSize:24,fontWeight:800,color:P.maroon,marginTop:10}}>Timeline Master!</div>
      <div style={{fontSize:18,color:"#B45309",marginTop:6}}>{score}/{TIMELINES.length} stories correct! 🌟</div>
      <TapBtn onClick={()=>{setTi(0);setScore(0);setDone(false);setPlaced([]);}} bg={P.orange} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  const remaining=events.filter(e=>!placed.find(p=>p.t===e.t));

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.orange}/>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:20,fontWeight:800,color:P.maroon}}>📋 Put in Order!</div>
        <div style={{color:"#374151",fontSize:13}}>{tl.emoji} {tl.title} · Story {ti+1}/{TIMELINES.length}</div>
      </div>

      {/* Placed */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:"#6B7280",marginBottom:6}}>✅ Placed in order:</div>
        {placed.map((ev,i)=>(
          <div key={i} style={{background:"#D1FAE5",border:`2px solid ${P.green}`,borderRadius:14,
            padding:"10px 14px",marginBottom:6,fontSize:14,fontWeight:700,color:"#065F46",
            display:"flex",alignItems:"center",gap:10}}>
            <span style={{background:P.green,color:"white",borderRadius:"50%",width:24,height:24,
              display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{i+1}</span>
            {ev.t}
          </div>
        ))}
        {placed.length===tl.events.length&&(
          <div style={{fontSize:20,fontWeight:800,color:P.green,textAlign:"center",marginTop:8}}>
            🎉 Perfect! That's correct!
          </div>
        )}
      </div>

      {/* Remaining */}
      {remaining.length>0&&(
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#6B7280",marginBottom:6}}>
            👆 Tap the NEXT event (step {placed.length+1}):
          </div>
          {remaining.map((ev,i)=>(
            <button key={i} onClick={()=>tap(ev)} style={{
              background:wrong===ev.t?"#FEE2E2":"white",
              border:`2.5px solid ${wrong===ev.t?"#DC2626":tl.col}`,
              borderRadius:14,padding:"12px 14px",marginBottom:8,fontSize:14,
              fontWeight:700,color:"#1F2937",cursor:"pointer",fontFamily:"inherit",
              width:"100%",textAlign:"left",transition:"all .2s",
              transform:wrong===ev.t?"scale(0.97) translateX(8px)":"scale(1)",
            }}>{ev.t}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── 🧠 DEEP QUIZ ─────────── */
function DeepQuiz({onBack}){
  const [pool]=useState(()=>shuffle(DEEP_QUIZ).slice(0,10));
  const [qi,setQi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=pool[qi];

  const answer=i=>{
    if(picked!==null)return;
    setPicked(i);if(i===q.ok)setScore(s=>s+1);
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{fontSize:60,marginTop:20}}>{score>=8?"🏆":score>=5?"⭐":"📚"}</div>
      <div style={{fontSize:24,fontWeight:800,color:P.maroon,marginTop:10}}>
        {score>=8?"Dharma Scholar!":score>=5?"Great knowledge!":"Keep studying!"}
      </div>
      <div style={{fontSize:18,color:"#B45309",marginTop:6}}>{score}/{pool.length} correct! 🌟</div>
      <div style={{fontSize:22,marginTop:8}}>
        {Array.from({length:pool.length},(_,i)=><span key={i} style={{opacity:i<score?1:.15}}>⭐</span>)}
      </div>
      <TapBtn onClick={()=>{setQi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.purple} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  const opts=shuffle(q.a.map((a,i)=>({a,i})));

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:20,fontWeight:800,color:P.maroon}}>🧠 Deep Quiz!</div>
        <div style={{fontSize:12,color:"#374151"}}>Q {qi+1}/{pool.length} · Score {score} ⭐ · {q.cat}</div>
      </div>

      <div style={{height:8,background:"#E9D5FF",borderRadius:99,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",background:P.purple,borderRadius:99,width:`${(qi/pool.length)*100}%`,transition:"width .4s"}}/>
      </div>

      <div style={{background:"white",borderRadius:20,padding:"18px 14px",border:`2.5px solid ${P.purple}`,
        boxShadow:`0 4px 14px ${P.purple}22`,textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:18,fontWeight:800,color:"#1F2937",lineHeight:1.4}}>{q.q}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        {opts.map(({a,i})=>{
          const isOk=i===q.ok,isPicked=picked===i;
          let bg="white",border=`2px solid #E5E7EB`,color="#374151";
          if(picked!==null){
            if(isOk){bg="#D1FAE5";border=`2px solid ${P.green}`;color=P.green;}
            else if(isPicked){bg="#FEE2E2";border="2px solid #DC2626";color="#DC2626";}
          }
          return(
            <button key={i} onClick={()=>answer(i)} style={{
              background:bg,border,borderRadius:16,padding:"14px 16px",
              cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:15,
              color,textAlign:"left",transition:"all .2s",
            }}>
              <span style={{marginRight:10,opacity:.5,fontSize:12}}>
                {picked===null?"●":isOk?"✅":isPicked?"❌":"○"}
              </span>
              {a}
            </button>
          );
        })}
      </div>

      {picked!==null&&(
        <>
          <div style={{background:picked===q.ok?"#ECFDF5":"#FFF3EE",
            border:`2px solid ${picked===q.ok?P.green:P.saffron}`,borderRadius:16,
            padding:"12px 14px",textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:18}}>{picked===q.ok?"🎉":"💡"}</div>
            <div style={{fontSize:13,color:"#374151",marginTop:4,fontWeight:700}}>{q.fact}</div>
          </div>
          <TapBtn onClick={()=>{if(qi>=pool.length-1){setDone(true);}else{setQi(i=>i+1);setPicked(null);}}}
            bg={P.purple} style={{width:"100%"}}>
            {qi>=pool.length-1?"See Results! 🏆":"Next Question →"}
          </TapBtn>
        </>
      )}
    </div>
  );
}

/* ─────────── 🔗 PAIR MATCH ─────────── */
function PairMatch({onBack}){
  const [pi,setPi]=useState(0);
  const ps=PAIRS_SETS[pi];
  const [leftSel,setLeftSel]=useState(null);
  const [matched,setMatched]=useState([]); // array of left.t
  const [wrong,setWrong]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  const rights=shuffle(ps.pairs.map(p=>p.right));
  const [shuffledR,setShuffledR]=useState(rights);

  useEffect(()=>{
    setShuffledR(shuffle(PAIRS_SETS[pi].pairs.map(p=>p.right)));
    setLeftSel(null);setMatched([]);setWrong(null);
  },[pi]);

  const tapLeft=pair=>{
    if(matched.includes(pair.left.t))return;
    setLeftSel(pair);setWrong(null);
  };

  const tapRight=r=>{
    if(!leftSel)return;
    const correctPair=ps.pairs.find(p=>p.left.t===leftSel.left.t);
    if(correctPair.right.t===r.t){
      const nm=[...matched,leftSel.left.t];
      setMatched(nm);setLeftSel(null);
      if(nm.length===ps.pairs.length){
        setScore(s=>s+1);
        setTimeout(()=>{
          if(pi>=PAIRS_SETS.length-1){setDone(true);return;}
          setPi(i=>i+1);
        },1200);
      }
    }else{
      setWrong(r.t);setTimeout(()=>setWrong(null),700);
    }
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.teal}/>
      <div style={{fontSize:60,marginTop:20}}>🏆</div>
      <div style={{fontSize:24,fontWeight:800,color:P.maroon,marginTop:10}}>Pair Master!</div>
      <div style={{fontSize:18,color:"#B45309",marginTop:6}}>{score}/{PAIRS_SETS.length} sets complete! 🌟</div>
      <TapBtn onClick={()=>{setPi(0);setScore(0);setDone(false);}} bg={P.teal} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.teal}/>
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:20,fontWeight:800,color:P.maroon}}>🔗 Match the Pairs!</div>
        <div style={{color:"#374151",fontSize:13}}>{ps.title}</div>
      </div>
      {leftSel&&<div style={{textAlign:"center",fontSize:13,color:P.teal,fontWeight:700,marginBottom:10}}>
        👆 Now tap the matching item for: {leftSel.left.e} {leftSel.left.t}</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,maxWidth:400,margin:"0 auto"}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#6B7280",marginBottom:8,textAlign:"center"}}>GOD / GODDESS</div>
          {ps.pairs.map((pair,i)=>{
            const done=matched.includes(pair.left.t);
            const sel=leftSel?.left.t===pair.left.t;
            return(
              <button key={i} onClick={()=>tapLeft(pair)} style={{
                background:done?"#D1FAE5":sel?"#CFFAFE":"white",
                border:`2.5px solid ${done?P.green:sel?P.teal:"#E5E7EB"}`,
                borderRadius:14,padding:"10px 8px",marginBottom:8,width:"100%",
                fontFamily:"inherit",cursor:done?"default":"pointer",transition:"all .2s",
              }}>
                <div style={{fontSize:24}}>{pair.left.e}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#374151"}}>{pair.left.t}</div>
                {done&&<div style={{fontSize:10,color:P.green}}>✅</div>}
              </button>
            );
          })}
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:"#6B7280",marginBottom:8,textAlign:"center"}}>MATCH WITH</div>
          {shuffledR.map((r,i)=>{
            const isDone=ps.pairs.find(p=>p.right.t===r.t&&matched.includes(p.left.t));
            return(
              <button key={i} onClick={()=>tapRight(r)} style={{
                background:isDone?"#D1FAE5":wrong===r.t?"#FEE2E2":"white",
                border:`2.5px solid ${isDone?P.green:wrong===r.t?"#DC2626":"#E5E7EB"}`,
                borderRadius:14,padding:"10px 8px",marginBottom:8,width:"100%",
                fontFamily:"inherit",cursor:isDone?"default":"pointer",transition:"all .2s",
                transform:wrong===r.t?"scale(0.92)":"scale(1)",
              }}>
                <div style={{fontSize:24}}>{r.e}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#374151"}}>{r.t}</div>
                {isDone&&<div style={{fontSize:10,color:P.green}}>✅</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────── 🏠 HOME ─────────── */
function HomeScreen({onSelect}){
  const tiles=[
    {id:"scramble", e:"🔤",title:"Word Scramble",    sub:"Unscramble Hindu words!",  col:P.blue,   bg:"#EFF6FF"},
    {id:"timeline", e:"📋",title:"Put in Order!",    sub:"Sort epic events!",         col:P.orange, bg:"#FFF7ED"},
    {id:"quiz",     e:"🧠",title:"Deep Quiz",         sub:"Epic & scripture facts!",  col:P.purple, bg:"#F5F3FF"},
    {id:"pairs",    e:"🔗",title:"Match the Pairs",  sub:"God + vehicle/weapon!",     col:P.teal,   bg:"#F0FDFA"},
  ];
  return(
    <div style={{...root,padding:"20px 14px",textAlign:"center"}}>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:14,fontWeight:700,color:"#6B7280",textTransform:"uppercase",letterSpacing:2}}>
          Ages 7–11
        </div>
        <div style={{fontSize:50,margin:"6px 0 4px"}}>📚</div>
        <h1 style={{margin:0,fontSize:28,fontWeight:800,color:P.maroon,letterSpacing:-1}}>Dharma Quest!</h1>
        <p style={{margin:"4px 0 0",color:"#B45309",fontSize:13,fontWeight:700}}>
          Puzzles • Epics • Knowledge 🌟
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
        {tiles.map(g=>(
          <button key={g.id} onClick={()=>onSelect(g.id)}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.92)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e=>e.currentTarget.style.transform="scale(0.92)"}
            onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            style={{background:g.bg,border:`3px solid ${g.col}`,borderRadius:22,
              padding:"22px 8px",cursor:"pointer",transition:"transform .12s",
              boxShadow:`0 4px 16px ${g.col}44`,fontFamily:"inherit"}}>
            <div style={{fontSize:36,marginBottom:8}}>{g.e}</div>
            <div style={{fontSize:15,fontWeight:800,color:g.col}}>{g.title}</div>
            <div style={{fontSize:11,color:"#6B7280",marginTop:3}}>{g.sub}</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:24,fontSize:18,letterSpacing:10,color:P.gold}}>📜🕉️📜🕉️📜</div>
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
  if(screen==="scramble") return <WordScramble onBack={()=>setScreen("home")}/>;
  if(screen==="timeline") return <TimelineGame onBack={()=>setScreen("home")}/>;
  if(screen==="quiz")     return <DeepQuiz     onBack={()=>setScreen("home")}/>;
  if(screen==="pairs")    return <PairMatch    onBack={()=>setScreen("home")}/>;
  return <HomeScreen onSelect={setScreen}/>;
}
