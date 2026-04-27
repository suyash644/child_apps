import { useState, useEffect } from "react";

const P={maroon:"#991B1B",purple:"#7C3AED",blue:"#1D4ED8",teal:"#0D9488",
  green:"#059669",gold:"#D97706",pink:"#BE185D",slate:"#334155"};

/* ─────────── DATA ─────────── */
const SCENARIOS = [
  {scenario:"You worked hard all year but didn't get the prize you expected. Your friend who worked less got it. You feel angry and cheated.",
   question:"Which Gita teaching applies here?",
   opts:[
    {t:"Nishkama Karma — Do your duty without attachment to results",ok:true},
    {t:"Run away from all competitions",ok:false},
    {t:"Feel angry and stop working hard",ok:false},
    {t:"Blame others for your failure",ok:false},
   ],
   gita:"Chapter 2, Verse 47: 'You have a right to perform your duties, but not to the fruits of your actions.'",
   learning:"This is one of the most powerful teachings — work hard, but don't let results define you!"},
  {scenario:"Your best friend is wrong about something, and you know it. But speaking up might upset them and damage your friendship.",
   question:"What does Dharma say you should do?",
   opts:[
    {t:"Speak the truth with kindness — Satya (truth) is sacred",ok:true},
    {t:"Stay quiet to protect the friendship at all costs",ok:false},
    {t:"Tell other people but not your friend",ok:false},
    {t:"Pretend to agree with your friend",ok:false},
   ],
   gita:"Dharma principle: 'Satyam Vada' — Always speak the truth. Ahimsa means non-violence in words too.",
   learning:"True friendship can handle honest truth. Lying to protect feelings is actually disrespect!"},
  {scenario:"You see someone being bullied at school. You want to help but you are afraid of getting involved.",
   question:"What does the Bhagavad Gita teach Arjuna about facing fear?",
   opts:[
    {t:"A Kshatriya must stand up against injustice — do your duty courageously",ok:true},
    {t:"Only get involved if it benefits you personally",ok:false},
    {t:"Walk away — it's not your problem",ok:false},
    {t:"Wait and see if someone else helps first",ok:false},
   ],
   gita:"Chapter 2, Verse 3: 'Do not yield to weakness — arise with courage!'",
   learning:"Arjuna was afraid too! Krishna taught that courage is doing the right thing even when scared."},
  {scenario:"You made a big mistake that hurt someone. You feel extremely guilty and keep punishing yourself mentally.",
   question:"What is the healthy spiritual approach?",
   opts:[
    {t:"Acknowledge, apologize, learn, and move forward — excessive guilt helps no one",ok:true},
    {t:"Keep feeling guilty forever as punishment",ok:false},
    {t:"Pretend it never happened",ok:false},
    {t:"Blame circumstances instead of taking responsibility",ok:false},
   ],
   gita:"Chapter 18, Verse 66: 'Abandon all varieties of dharma and surrender to Me. I shall deliver you from all sinful reactions — do not fear.'",
   learning:"The Gita teaches self-forgiveness and renewal, not endless guilt. Learn, grow, and move forward!"},
  {scenario:"You are very good at cricket and your friend is not. He feels bad. You wonder if you should pretend to play badly to make him feel better.",
   question:"Is hiding your talent the right Dharmic action?",
   opts:[
    {t:"No — excellence is a gift from God. Share your skill and help your friend improve instead",ok:true},
    {t:"Yes — always hide your abilities to avoid hurting others",ok:false},
    {t:"Stop playing cricket entirely",ok:false},
    {t:"Show off even more to motivate him",ok:false},
   ],
   gita:"Chapter 3, Verse 21: 'Whatever a great person does, ordinary people follow their example.'",
   learning:"Your excellence can inspire others. Hiding it helps no one. Teach, mentor, and lift others up!"},
];

const WHO_SAID_IT = [
  {quote:"I am the beginning and the end of all creation.",speaker:"Lord Krishna",others:["Rama","Shiva","Brahma"],source:"Bhagavad Gita 10:20"},
  {quote:"Whenever righteousness declines and evil rises, I manifest myself to restore dharma.",speaker:"Lord Krishna",others:["Vishnu","Rama","Arjuna"],source:"Bhagavad Gita 4:7–8"},
  {quote:"You can't be a great warrior while clinging to a woman. Release her.",speaker:"Lakshmana",others:["Rama","Hanuman","Bharata"],source:"Ramayana"},
  {quote:"I am the son of the Wind God. Nothing is impossible for me!",speaker:"Hanuman",others:["Bhima","Garuda","Arjuna"],source:"Ramayana"},
  {quote:"Even if I am killed, I will not fight on the side of adharma.",speaker:"Karna",others:["Arjuna","Bhishma","Drona"],source:"Mahabharata"},
  {quote:"Where there is dharma, there is victory.",speaker:"Vyasa",others:["Krishna","Arjuna","Bhishma"],source:"Mahabharata 6:43:60"},
  {quote:"Death is certain for the born. Birth is certain for the dead.",speaker:"Lord Krishna",others:["Arjuna","Yama","Brahma"],source:"Bhagavad Gita 2:27"},
  {quote:"My parents are my world. I need go no further.",speaker:"Ganesha",others:["Kartikeya","Hanuman","Rama"],source:"Shiva Purana"},
];

const SANSKRIT = [
  {word:"Dharma",    meaning:"Righteous duty and moral order",      hint:"Your sacred responsibility 📜",     emoji:"🕉️"},
  {word:"Karma",     meaning:"Actions and their consequences",       hint:"What you do comes back to you ⚡",   emoji:"⚡"},
  {word:"Moksha",    meaning:"Liberation from the cycle of rebirth", hint:"The ultimate spiritual goal 🌟",     emoji:"🌟"},
  {word:"Ahimsa",    meaning:"Non-violence in thought, word, deed",  hint:"The greatest ethical principle ☮️",  emoji:"☮️"},
  {word:"Artha",     meaning:"Material prosperity and wealth",        hint:"One of the four goals of life 💰",   emoji:"💰"},
  {word:"Kama",      meaning:"Desire and pleasure",                   hint:"One of the four purusharthas 💝",    emoji:"💝"},
  {word:"Samsara",   meaning:"The cycle of birth, death and rebirth", hint:"The wheel we seek to escape 🔄",    emoji:"🔄"},
  {word:"Atman",     meaning:"The individual soul within each person",hint:"Your true eternal self 🪔",         emoji:"🪔"},
  {word:"Brahman",   meaning:"The universal cosmic consciousness",    hint:"The ultimate reality of existence 🌌",emoji:"🌌"},
  {word:"Yoga",      meaning:"Union of self with the divine",         hint:"Much more than just exercise! 🧘",   emoji:"🧘"},
  {word:"Satya",     meaning:"Truth in all its forms",                hint:"Fundamental pillar of Dharma ✨",    emoji:"✨"},
  {word:"Tapas",     meaning:"Spiritual discipline and austerity",    hint:"Burning away impurities 🔥",        emoji:"🔥"},
  {word:"Guru",      meaning:"One who dispels darkness with light",   hint:"Teacher of wisdom 🎓",              emoji:"🎓"},
  {word:"Mantra",    meaning:"Sacred sound that transforms the mind", hint:"Words with divine vibration 🔔",    emoji:"🔔"},
  {word:"Prana",     meaning:"Life force energy in all living beings",hint:"The breath of life 💨",             emoji:"💨"},
];

const DEEP_QUESTIONS = [
  {q:"What is the core teaching of the Bhagavad Gita?",
   opts:["Do your duty without attachment to results","Always win at any cost","Avoid all action to avoid sin","Worship only one God"],ok:0,
   fact:"Nishkama Karma — selfless action is the Gita's central teaching."},
  {q:"How many Pandava brothers were there?",opts:["5","3","7","4"],ok:0,
   fact:"Yudhishthira, Bhima, Arjuna, Nakula, and Sahadeva — all sons of Kunti and Madri."},
  {q:"Which chapter of the Gita is called 'Vishwarupa Darshana'?",
   opts:["Chapter 11","Chapter 2","Chapter 18","Chapter 7"],ok:0,
   fact:"In Chapter 11, Krishna reveals his Universal Form (Vishwarupa) to Arjuna!"},
  {q:"Karna was actually the son of which deity?",opts:["Surya (Sun God)","Indra","Varuna","Yama"],ok:0,
   fact:"Karna was born to Kunti from a boon given by Surya — making him the eldest Pandava by birth!"},
  {q:"What is Brahmacharya?",opts:["Celibacy and self-restraint","Prayer","Fasting","Meditation"],ok:0,
   fact:"Brahmacharya means channeling energy toward spiritual growth through self-discipline."},
  {q:"The Rigveda has approximately how many hymns?",opts:["1,028","500","2,000","108"],ok:0,
   fact:"The Rigveda contains 1,028 hymns (suktas) organized in 10 mandalas (books)!"},
  {q:"Who is called the 'grandfather' of the Pandavas and Kauravas?",opts:["Bhishma","Drona","Dhritarashtra","Vyasa"],ok:0,
   fact:"Bhishma (born Devavrata) was the grand-uncle, revered as grandfather of both families."},
  {q:"What is the meaning of 'Upanishad'?",
   opts:["Sitting near a teacher to receive wisdom","Going to the temple","Reading scriptures","Performing rituals"],ok:0,
   fact:"'Upa' (near) + 'ni' (below) + 'shad' (to sit) — sitting near a guru to receive spiritual knowledge."},
  {q:"Which animal is sacred to Lord Shiva?",opts:["Nandi the Bull","Elephant","Tiger","Peacock"],ok:0,
   fact:"Nandi the white bull is Shiva's vehicle and guardian of Mount Kailash!"},
  {q:"What are the four Purusharthas (goals of life)?",
   opts:["Dharma, Artha, Kama, Moksha","Karma, Yoga, Bhakti, Jnana","Satya, Ahimsa, Tapas, Brahmacharya","Veda, Upanishad, Purana, Gita"],ok:0,
   fact:"The four goals are: Dharma (duty), Artha (prosperity), Kama (desire), and Moksha (liberation)!"},
];

/* ─────────── HELPERS ─────────── */
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

const root={fontFamily:"'Baloo 2','Trebuchet MS',sans-serif",minHeight:"100vh",
  background:"linear-gradient(135deg,#F8FAFC 0%,#F1F5F9 50%,#F8FAFC 100%)",
  userSelect:"none",WebkitUserSelect:"none"};

function BackBtn({onBack,col=P.slate}){
  return <button onClick={onBack} style={{background:"white",border:`2px solid ${col}22`,borderRadius:12,
    padding:"8px 18px",fontFamily:"inherit",fontSize:14,fontWeight:800,color:col,cursor:"pointer",
    marginBottom:14,display:"block",boxShadow:"0 1px 4px rgba(0,0,0,.07)"}}>← Home</button>;
}
function TapBtn({onClick,bg,children,style={}}){
  return <button onClick={onClick}
    onMouseDown={e=>e.currentTarget.style.transform="scale(0.96)"}
    onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
    onTouchStart={e=>e.currentTarget.style.transform="scale(0.96)"}
    onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
    style={{background:bg,border:"none",borderRadius:14,padding:"12px 22px",fontFamily:"inherit",
      fontSize:15,fontWeight:800,color:"white",cursor:"pointer",transition:"transform .1s",...style}}>
    {children}</button>;
}
function Badge({text,col}){
  return <span style={{background:`${col}18`,color:col,border:`1.5px solid ${col}44`,
    borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:800,letterSpacing:.5}}>{text}</span>;
}

/* ─────────── 🧘 GITA WISDOM SCENARIOS ─────────── */
function GitaWisdom({onBack}){
  const [pool]=useState(()=>shuffle(SCENARIOS));
  const [si,setSi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const sc=pool[si];
  const [opts]=useState(()=>pool.map(s=>shuffle(s.opts)));

  const answer=opt=>{
    if(picked)return;
    setPicked(opt);if(opt.ok)setScore(s=>s+1);
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{fontSize:56,marginTop:16}}>{score>=4?"🏆":score>=2?"⭐":"📚"}</div>
      <div style={{fontSize:22,fontWeight:800,color:P.maroon,marginTop:8}}>
        {score>=4?"Gita Scholar!":score>=2?"Good thinking!":"Keep reflecting!"}
      </div>
      <div style={{fontSize:16,color:P.gold,marginTop:4}}>{score}/{pool.length} correct 🌟</div>
      <p style={{color:"#475569",fontSize:13,marginTop:12,lineHeight:1.6,maxWidth:320,margin:"12px auto"}}>
        The Gita's wisdom applies to every situation in life. Keep reading and reflecting!
      </p>
      <TapBtn onClick={()=>{setSi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.purple} style={{marginTop:16}}>
        Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.purple}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <Badge text="Gita Wisdom" col={P.purple}/>
        <span style={{fontSize:12,color:"#64748B"}}>Scenario {si+1}/{pool.length}</span>
        <span style={{fontSize:12,color:P.gold,marginLeft:"auto"}}>Score: {score} ⭐</span>
      </div>

      <div style={{background:"white",borderRadius:18,padding:"18px 16px",
        border:"1.5px solid #E2E8F0",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:800,color:"#94A3B8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
          Life Situation
        </div>
        <div style={{fontSize:15,color:"#1E293B",lineHeight:1.7,fontWeight:600}}>{sc.scenario}</div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:P.purple,marginBottom:10}}>{sc.question}</div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
        {opts[si].map((opt,i)=>{
          const isPicked=picked===opt;const isOk=opt.ok;
          let bg="white",border="1.5px solid #E2E8F0",color="#1E293B";
          if(picked){
            if(isOk){bg="#F0FDF4";border=`1.5px solid ${P.green}`;color=P.green;}
            else if(isPicked){bg="#FEF2F2";border="1.5px solid #EF4444";color="#DC2626";}
          }
          return(
            <button key={i} onClick={()=>answer(opt)} style={{
              background:bg,border,borderRadius:14,padding:"14px 16px",cursor:"pointer",
              fontFamily:"inherit",fontWeight:600,fontSize:14,color,textAlign:"left",transition:"all .2s",
              boxShadow:"0 1px 4px rgba(0,0,0,.04)",
            }}>
              <span style={{opacity:.4,marginRight:8,fontSize:11}}>{picked?isOk?"✅":isPicked?"❌":"":"•"}</span>
              {opt.t}
            </button>
          );
        })}
      </div>

      {picked&&(
        <>
          <div style={{background:`${P.purple}08`,border:`1.5px solid ${P.purple}33`,borderRadius:14,
            padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:800,color:P.purple,marginBottom:6}}>📖 Gita Reference</div>
            <div style={{fontSize:13,color:"#374151",fontStyle:"italic",marginBottom:8}}>"{sc.gita}"</div>
            <div style={{fontSize:13,color:"#1E293B",fontWeight:600,lineHeight:1.6}}>{sc.learning}</div>
          </div>
          <TapBtn onClick={()=>{if(si>=pool.length-1){setDone(true);}else{setSi(i=>i+1);setPicked(null);}}}
            bg={P.purple} style={{width:"100%"}}>
            {si>=pool.length-1?"See Results 🏆":"Next Scenario →"}
          </TapBtn>
        </>
      )}
    </div>
  );
}

/* ─────────── 🗣️ WHO SAID IT ─────────── */
function WhoSaidIt({onBack}){
  const [pool]=useState(()=>shuffle(WHO_SAID_IT));
  const [qi,setQi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=pool[qi];
  const [opts]=useState(()=>pool.map(p=>shuffle([p.speaker,...p.others])));

  const answer=s=>{
    if(picked)return;
    setPicked(s);if(s===q.speaker)setScore(sc=>sc+1);
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.teal}/>
      <div style={{fontSize:56,marginTop:16}}>{score>=6?"🏆":score>=4?"⭐":"📚"}</div>
      <div style={{fontSize:22,fontWeight:800,color:P.maroon,marginTop:8}}>
        {score>=6?"Epic Scholar!":score>=4?"Great recall!":"Study the epics more!"}
      </div>
      <div style={{fontSize:16,color:P.gold,marginTop:4}}>{score}/{pool.length} correct 🌟</div>
      <TapBtn onClick={()=>{setQi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.teal} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.teal}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <Badge text="Who Said It?" col={P.teal}/>
        <span style={{fontSize:12,color:"#64748B"}}>Q {qi+1}/{pool.length}</span>
        <span style={{fontSize:12,color:P.gold,marginLeft:"auto"}}>Score: {score} ⭐</span>
      </div>

      <div style={{background:"white",borderRadius:18,padding:"22px 16px",
        border:"1.5px solid #E2E8F0",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:10,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:12}}>"</div>
        <div style={{fontSize:17,color:"#1E293B",lineHeight:1.7,fontStyle:"italic",fontWeight:600}}>
          {q.quote}
        </div>
        <div style={{fontSize:28,marginTop:8}}>"</div>
        <div style={{marginTop:10}}>
          <Badge text={q.source} col="#64748B"/>
        </div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:P.teal,marginBottom:10,textAlign:"center"}}>
        Who spoke these words?
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {opts[qi].map((s,i)=>{
          const isOk=s===q.speaker,isPicked=picked===s;
          let bg="white",border="1.5px solid #E2E8F0",color="#1E293B";
          if(picked){
            if(isOk){bg="#F0FDFA";border=`1.5px solid ${P.teal}`;color=P.teal;}
            else if(isPicked){bg="#FEF2F2";border="1.5px solid #EF4444";color="#DC2626";}
          }
          return(
            <button key={i} onClick={()=>answer(s)} style={{
              background:bg,border,borderRadius:14,padding:"16px 10px",cursor:"pointer",
              fontFamily:"inherit",fontWeight:700,fontSize:14,color,textAlign:"center",transition:"all .2s",
            }}>
              {picked&&isOk?"✅ ":picked&&isPicked?"❌ ":""}{s}
            </button>
          );
        })}
      </div>

      {picked&&(
        <TapBtn onClick={()=>{if(qi>=pool.length-1){setDone(true);}else{setQi(i=>i+1);setPicked(null);}}}
          bg={P.teal} style={{width:"100%"}}>
          {qi>=pool.length-1?"See Results 🏆":"Next Quote →"}
        </TapBtn>
      )}
    </div>
  );
}

/* ─────────── 🕉️ SANSKRIT DECODER ─────────── */
function SanskritDecoder({onBack}){
  const [pool]=useState(()=>shuffle(SANSKRIT));
  const [si,setSi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const word=pool[si];

  // Generate 4 options: correct + 3 wrong
  const [allOpts]=useState(()=>pool.map((w,i)=>{
    const wrongs=shuffle(pool.filter((_,j)=>j!==i).map(x=>x.meaning)).slice(0,3);
    return shuffle([w.meaning,...wrongs]);
  }));

  const answer=m=>{
    if(picked)return;
    setPicked(m);if(m===word.meaning)setScore(s=>s+1);
  };

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.gold}/>
      <div style={{fontSize:56,marginTop:16}}>{score>=12?"🏆":score>=8?"⭐":"📚"}</div>
      <div style={{fontSize:22,fontWeight:800,color:P.maroon,marginTop:8}}>
        {score>=12?"Sanskrit Master!":score>=8?"Great vocabulary!":"Keep learning!"}
      </div>
      <div style={{fontSize:16,color:P.gold,marginTop:4}}>{score}/{pool.length} correct 🌟</div>
      <TapBtn onClick={()=>{setSi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.gold} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.gold}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <Badge text="Sanskrit Decoder" col={P.gold}/>
        <span style={{fontSize:12,color:"#64748B"}}>{si+1}/{pool.length}</span>
        <span style={{fontSize:12,color:P.gold,marginLeft:"auto"}}>Score: {score} ⭐</span>
      </div>

      <div style={{height:6,background:"#FEF3C7",borderRadius:99,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",background:P.gold,borderRadius:99,width:`${(si/pool.length)*100}%`,transition:"width .4s"}}/>
      </div>

      <div style={{background:"white",borderRadius:18,padding:"28px 20px",
        border:"1.5px solid #E2E8F0",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:8}}>{word.emoji}</div>
        <div style={{fontSize:32,fontWeight:800,color:P.maroon,letterSpacing:1}}>{word.word}</div>
        <div style={{fontSize:13,color:"#94A3B8",marginTop:6}}>{word.hint}</div>
      </div>

      <div style={{fontSize:13,fontWeight:700,color:P.gold,marginBottom:10,textAlign:"center"}}>
        What does this Sanskrit word mean?
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
        {allOpts[si].map((m,i)=>{
          const isOk=m===word.meaning,isPicked=picked===m;
          let bg="white",border="1.5px solid #E2E8F0",color="#1E293B";
          if(picked){
            if(isOk){bg="#FEFCE8";border=`1.5px solid ${P.gold}`;color=P.gold;}
            else if(isPicked){bg="#FEF2F2";border="1.5px solid #EF4444";color="#DC2626";}
          }
          return(
            <button key={i} onClick={()=>answer(m)} style={{
              background:bg,border,borderRadius:14,padding:"14px 16px",cursor:"pointer",
              fontFamily:"inherit",fontWeight:600,fontSize:13,color,textAlign:"left",transition:"all .2s",
            }}>
              <span style={{opacity:.4,marginRight:8}}>{picked?isOk?"✅":isPicked?"❌":"○":"•"}</span>
              {m}
            </button>
          );
        })}
      </div>

      {picked&&(
        <TapBtn onClick={()=>{if(si>=pool.length-1){setDone(true);}else{setSi(i=>i+1);setPicked(null);}}}
          bg={P.gold} style={{width:"100%"}}>
          {si>=pool.length-1?"See Results 🏆":"Next Word →"}
        </TapBtn>
      )}
    </div>
  );
}

/* ─────────── 🎯 DEEP KNOWLEDGE QUIZ ─────────── */
function DeepKnowledge({onBack}){
  const [pool]=useState(()=>shuffle(DEEP_QUESTIONS).slice(0,8));
  const [qi,setQi]=useState(0);
  const [picked,setPicked]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=pool[qi];

  const answer=i=>{if(picked!==null)return;setPicked(i);if(i===q.ok)setScore(s=>s+1);};

  if(done)return(
    <div style={{...root,padding:20,textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.blue}/>
      <div style={{fontSize:56,marginTop:16}}>{score>=7?"🏆":score>=4?"⭐":"📚"}</div>
      <div style={{fontSize:22,fontWeight:800,color:P.maroon,marginTop:8}}>
        {score>=7?"Dharma Scholar!":score>=4?"Good knowledge!":"Study more scriptures!"}
      </div>
      <div style={{fontSize:16,color:P.gold,marginTop:4}}>{score}/{pool.length} correct 🌟</div>
      <TapBtn onClick={()=>{setQi(0);setScore(0);setPicked(null);setDone(false);}} bg={P.blue} style={{marginTop:20}}>
        Play Again! 🎮</TapBtn>
    </div>
  );

  return(
    <div style={{...root,padding:16}}>
      <BackBtn onBack={onBack} col={P.blue}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <Badge text="Deep Knowledge" col={P.blue}/>
        <span style={{fontSize:12,color:"#64748B"}}>Q {qi+1}/{pool.length}</span>
        <span style={{fontSize:12,color:P.gold,marginLeft:"auto"}}>Score: {score} ⭐</span>
      </div>

      <div style={{height:6,background:"#DBEAFE",borderRadius:99,marginBottom:16,overflow:"hidden"}}>
        <div style={{height:"100%",background:P.blue,borderRadius:99,width:`${(qi/pool.length)*100}%`,transition:"width .4s"}}/>
      </div>

      <div style={{background:"white",borderRadius:18,padding:"18px 16px",
        border:"1.5px solid #E2E8F0",boxShadow:"0 4px 16px rgba(0,0,0,.06)",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:800,color:"#1E293B",lineHeight:1.4}}>{q.q}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
        {q.opts.map((opt,i)=>{
          const isOk=i===q.ok,isPicked=picked===i;
          let bg="white",border="1.5px solid #E2E8F0",color="#1E293B";
          if(picked!==null){
            if(isOk){bg="#EFF6FF";border=`1.5px solid ${P.blue}`;color=P.blue;}
            else if(isPicked){bg="#FEF2F2";border="1.5px solid #EF4444";color="#DC2626";}
          }
          return(
            <button key={i} onClick={()=>answer(i)} style={{
              background:bg,border,borderRadius:14,padding:"14px 16px",cursor:"pointer",
              fontFamily:"inherit",fontWeight:600,fontSize:14,color,textAlign:"left",transition:"all .2s",
            }}>
              <span style={{opacity:.4,marginRight:10,fontSize:12,fontFamily:"monospace"}}>
                {picked!==null?isOk?"✅":isPicked?"❌":"○":String.fromCharCode(65+i)+"."}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked!==null&&(
        <>
          <div style={{background:"#F8FAFC",border:"1.5px solid #E2E8F0",borderRadius:14,
            padding:"12px 16px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:800,color:"#94A3B8",marginBottom:4}}>💡 DID YOU KNOW?</div>
            <div style={{fontSize:13,color:"#374151",lineHeight:1.6,fontWeight:600}}>{q.fact}</div>
          </div>
          <TapBtn onClick={()=>{if(qi>=pool.length-1){setDone(true);}else{setQi(i=>i+1);setPicked(null);}}}
            bg={P.blue} style={{width:"100%"}}>
            {qi>=pool.length-1?"See Results 🏆":"Next Question →"}
          </TapBtn>
        </>
      )}
    </div>
  );
}

/* ─────────── 🏠 HOME ─────────── */
function HomeScreen({onSelect}){
  const tiles=[
    {id:"gita",    e:"📖",title:"Gita Wisdom",      sub:"Apply the Gita to life",   col:P.purple, bg:"#FAF5FF"},
    {id:"whosaid", e:"🗣️",title:"Who Said It?",     sub:"Identify epic speakers",   col:P.teal,   bg:"#F0FDFA"},
    {id:"sanskrit",e:"🕉️",title:"Sanskrit Decoder", sub:"Learn ancient vocabulary", col:P.gold,   bg:"#FEFCE8"},
    {id:"deep",    e:"🎯",title:"Deep Knowledge",    sub:"Vedas, epics & philosophy",col:P.blue,   bg:"#EFF6FF"},
  ];
  return(
    <div style={{...root,padding:"20px 14px",textAlign:"center"}}>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:12,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:3,marginBottom:6}}>
          Ages 11–15
        </div>
        <div style={{fontSize:46,margin:"0 0 6px"}}>🕉️</div>
        <h1 style={{margin:0,fontSize:26,fontWeight:800,color:P.maroon,letterSpacing:-1}}>Dharma Scholar</h1>
        <p style={{margin:"6px 0 0",color:"#64748B",fontSize:13,fontWeight:600}}>
          Philosophy · Epics · Sanskrit · Wisdom
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
        {tiles.map(g=>(
          <button key={g.id} onClick={()=>onSelect(g.id)}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e=>e.currentTarget.style.transform="scale(0.93)"}
            onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
            style={{background:g.bg,border:`2px solid ${g.col}44`,borderRadius:20,
              padding:"22px 8px",cursor:"pointer",transition:"transform .12s",
              boxShadow:`0 3px 12px ${g.col}22`,fontFamily:"inherit"}}>
            <div style={{fontSize:34,marginBottom:8}}>{g.e}</div>
            <div style={{fontSize:14,fontWeight:800,color:g.col}}>{g.title}</div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:3,lineHeight:1.3}}>{g.sub}</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:24,color:"#94A3B8",fontSize:12}}>
        Explore the depth of Sanatan Dharma 🕉️
      </div>
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
  if(screen==="gita")     return <GitaWisdom    onBack={()=>setScreen("home")}/>;
  if(screen==="whosaid")  return <WhoSaidIt     onBack={()=>setScreen("home")}/>;
  if(screen==="sanskrit") return <SanskritDecoder onBack={()=>setScreen("home")}/>;
  if(screen==="deep")     return <DeepKnowledge  onBack={()=>setScreen("home")}/>;
  return <HomeScreen onSelect={setScreen}/>;
}
