import { useState, useEffect, useMemo } from "react";

/* ── Palette ─────────────────────────────────────── */
const P = {
  saffron:"#FF6B35", gold:"#F59E0B", pink:"#EC4899",
  maroon:"#991B1B", purple:"#7C3AED", green:"#059669",
  teal:"#0D9488", blue:"#2563EB", orange:"#D97706",
};

/* ── Data ─────────────────────────────────────────── */
const MEMORY_ITEMS = [
  {id:"ganesh",    e:"🐘", name:"Ganesh"},
  {id:"krishna",   e:"🦚", name:"Krishna"},
  {id:"hanuman",   e:"💪", name:"Hanuman"},
  {id:"lakshmi",   e:"🪔", name:"Lakshmi"},
  {id:"rama",      e:"🏹", name:"Rama"},
  {id:"shiva",     e:"🔱", name:"Shiva"},
  {id:"durga",     e:"⚔️",  name:"Durga"},
  {id:"saraswati", e:"🎵", name:"Saraswati"},
];

const ALL_QUIZ = [
  {q:"Who has an elephant head? 🐘",       a:[{e:"🐘",t:"Ganesh",ok:true}, {e:"🦚",t:"Krishna",ok:false}],     fact:"Ganesh is the son of Shiva & Parvati! 🙏"},
  {q:"Which festival has diyas (lamps)? 🪔", a:[{e:"🌈",t:"Holi",ok:false}, {e:"🪔",t:"Diwali",ok:true}],      fact:"Diwali is the Festival of Lights! ✨"},
  {q:"Who lifted a whole mountain? ⛰️",     a:[{e:"💪",t:"Hanuman",ok:true},{e:"🏹",t:"Rama",ok:false}],       fact:"Hanuman is the strongest devotee! 💪"},
  {q:"Which festival has colors? 🌈",       a:[{e:"🪔",t:"Diwali",ok:false},{e:"🌈",t:"Holi",ok:true}],        fact:"Holi celebrates good over evil! 🎨"},
  {q:"Who plays the flute? 🎵",             a:[{e:"🐘",t:"Ganesh",ok:false},{e:"🦚",t:"Krishna",ok:true}],     fact:"Krishna's flute music is magical! 🎵"},
  {q:"Goddess of knowledge & learning? 📚", a:[{e:"🎵",t:"Saraswati",ok:true},{e:"🪔",t:"Lakshmi",ok:false}],  fact:"Pray to Saraswati before studying! 📖"},
  {q:"Who holds the Trishul (trident)? 🔱", a:[{e:"🔱",t:"Shiva",ok:true},{e:"🦚",t:"Krishna",ok:false}],     fact:"Lord Shiva protects the whole universe! 🔱"},
  {q:"What is Ganesh's tiny vehicle? 🐭",   a:[{e:"🐭",t:"Mouse",ok:true},{e:"🦚",t:"Peacock",ok:false}],     fact:"The tiny mouse carries mighty Ganesh! 🐭"},
  {q:"What is Rama's weapon? 🏹",           a:[{e:"🏹",t:"Bow & Arrow",ok:true},{e:"⚔️",t:"Sword",ok:false}], fact:"Rama was the greatest archer! 🏹"},
  {q:"Ganesh's birthday festival? 🐘",      a:[{e:"🐘",t:"Ganesh Chaturthi",ok:true},{e:"🪔",t:"Diwali",ok:false}], fact:"Ganesh Chaturthi is in August–September! 🎊"},
  {q:"Krishna's birthday festival? 🦚",     a:[{e:"🦚",t:"Janmashtami",ok:true},{e:"🐘",t:"Ganesh Chaturthi",ok:false}], fact:"We dance and fast on Janmashtami! 🎊"},
  {q:"What sacred sound do we chant? 🕉️",  a:[{e:"🕉️",t:"OM",ok:true},{e:"🔔",t:"DONG",ok:false}],           fact:"OM is the sound of the whole universe! 🕉️"},
  {q:"Who saved Prahlad from fire? ✨",     a:[{e:"🌀",t:"Vishnu",ok:true},{e:"🔱",t:"Shiva",ok:false}],      fact:"Lord Vishnu always protects his devotees! 🙏"},
  {q:"Goddess of wealth & prosperity? 💰",  a:[{e:"🪔",t:"Lakshmi",ok:true},{e:"🎵",t:"Saraswati",ok:false}], fact:"Lakshmi brings happiness and riches! 🌸"},
  {q:"Navratri celebrates which goddess? ⚔️", a:[{e:"⚔️",t:"Durga",ok:true},{e:"🦚",t:"Krishna",ok:false}],  fact:"Durga is the powerful mother goddess! ⚔️"},
];

const SHLOKAS = [
  {title:"Ganesh Mantra", deity:"🐘", col:P.saffron,
   hindi:"वक्रतुण्ड महाकाय\nसूर्यकोटि समप्रभ\nनिर्विघ्नं कुरु मे देव",
   roman:"Vakratunda Mahakaya\nSuryakoti Samaprabha\nNirvighnam Kuru Me Deva",
   meaning:"O Lord Ganesha, please remove all\nmy obstacles, always and everywhere!"},
  {title:"Gayatri Mantra", deity:"☀️", col:P.gold,
   hindi:"ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यम्\nभर्गो देवस्य धीमहि",
   roman:"Om Bhur Bhuva Swah\nTat Savitur Varenyam\nBhargo Devasya Dhimahi",
   meaning:"Dear Sun God, fill our minds\nwith your divine light and wisdom!"},
  {title:"Om Namah Shivaya", deity:"🔱", col:P.purple,
   hindi:"ॐ नमः शिवाय\nॐ नमः शिवाय\nॐ नमः शिवाय",
   roman:"Om Namah Shivaya\nOm Namah Shivaya\nOm Namah Shivaya",
   meaning:"I bow to Lord Shiva with love.\nShiva protects and blesses us all!"},
  {title:"Saraswati Vandana", deity:"🎵", col:P.pink,
   hindi:"या कुन्देन्दुतुषार-\nहारधवला\nया शुभ्रवस्त्रावृता",
   roman:"Ya Kundendu Tusharahara\nDhavala\nYa Shubhravastravrita",
   meaning:"Goddess Saraswati, pure as a lotus,\nplease bless me with great knowledge!"},
  {title:"Mangal Shloka", deity:"🌟", col:P.teal,
   hindi:"मंगलम् भगवान विष्णु\nमंगलम् गरुडध्वजः\nमंगलम् पुण्डरीकाक्षः",
   roman:"Mangalam Bhagwan Vishnu\nMangalam Garudadhwajah\nMangalam Pundarikakshah",
   meaning:"Lord Vishnu brings good luck to all.\nMay everyone be happy and healthy!"},
  {title:"Hanuman Chalisa (First Verse)", deity:"💪", col:"#DC2626",
   hindi:"जय हनुमान ज्ञान गुण सागर\nजय कपीस तिहुँ लोक उजागर",
   roman:"Jai Hanuman Gyan Gun Sagar\nJai Kapis Tihun Lok Ujaagar",
   meaning:"Victory to Hanuman, ocean of wisdom!\nHe lights up all three worlds with his glory!"},
];

const STORIES = [
  {title:"Rama & Ravana", emoji:"🏹", col:P.saffron, slides:[
    {e:"👑", t:"Rama was a kind, brave, and honest prince loved by all!"},
    {e:"👿", t:"Evil Ravana kidnapped Rama's wife Sita and took her away! 😢"},
    {e:"🐒", t:"Mighty Hanuman leapt across the ocean to find Sita!"},
    {e:"🔥", t:"Hanuman set Ravana's Lanka on fire! Rama's army attacked!"},
    {e:"⚔️", t:"Rama defeated Ravana with his powerful bow and arrows!"},
    {e:"🪔", t:"Rama returned home! People lit diyas to welcome him — this became Diwali! 🎉"},
  ]},
  {title:"Baby Krishna & Butter", emoji:"🦚", col:P.purple, slides:[
    {e:"👶", t:"Baby Krishna loved makhan (butter) more than anything!"},
    {e:"🏺", t:"Mama Yashoda kept butter high up so Krishna couldn't reach!"},
    {e:"🧗", t:"Clever Krishna climbed on his friends to reach the pot!"},
    {e:"🙈", t:"He hid and ate all the butter with his friends! 😄"},
    {e:"🤝", t:"Krishna always shared the butter with everyone — even the monkeys!"},
    {e:"💙", t:"Sharing is caring! That's why everyone in Vrindavan loves Krishna! 🦚"},
  ]},
  {title:"Ganesha Wins the Race", emoji:"🐘", col:P.orange, slides:[
    {e:"🏆", t:"Lord Shiva announced a race: who circles the world wins first, wins a prize!"},
    {e:"🦚", t:"Kartikeya jumped on his peacock and flew around the entire world FAST! 💨"},
    {e:"🤔", t:"Ganesha thought carefully. He can't run that fast on his little legs..."},
    {e:"🐘", t:"Ganesha slowly walked around his parents Shiva and Parvati — just once!"},
    {e:"❤️", t:"Ganesha said: For me, my parents ARE the entire world!"},
    {e:"🏆", t:"Shiva declared Ganesha the winner! Always love and respect your parents! 🙏"},
  ]},
  {title:"Prahlad & Holi", emoji:"🌈", col:P.pink, slides:[
    {e:"👦", t:"Little Prahlad was a great devotee of Lord Vishnu. He prayed always!"},
    {e:"😡", t:"His father Hiranyakashipu was a demon king who hated Vishnu!"},
    {e:"🔥", t:"His evil aunt Holika tried to burn Prahlad in a huge bonfire!"},
    {e:"✨", t:"Vishnu protected Prahlad — he came out safe! Holika was burned!"},
    {e:"🌈", t:"People celebrated with joy — throwing colors everywhere!"},
    {e:"🎊", t:"Today we celebrate Holi to remember: good always wins over evil! 🌸"},
  ]},
  {title:"Dhruva — The Star Boy", emoji:"⭐", col:P.teal, slides:[
    {e:"👦", t:"Little Prince Dhruva wanted to sit on his father the King's lap!"},
    {e:"😢", t:"His stepmother refused and said go away! Dhruva was heartbroken."},
    {e:"🌲", t:"Dhruva went alone to the forest and began praying to Lord Vishnu!"},
    {e:"🙏", t:"For months, Dhruva meditated without eating, drinking only water!"},
    {e:"🌀", t:"Vishnu was deeply moved by Dhruva's devotion and appeared before him!"},
    {e:"⭐", t:"Vishnu blessed Dhruva and made him the North Star — shining forever! ✨"},
  ]},
  {title:"Hanuman Crosses the Ocean", emoji:"💪", col:"#DC2626", slides:[
    {e:"😔", t:"Sita was missing! Rama's whole army was very worried."},
    {e:"🌊", t:"The ocean was HUGE — 100 miles across. How to cross it?"},
    {e:"💪", t:"Hanuman remembered his divine strength and grew GIGANTIC in size!"},
    {e:"🦁", t:"He leaped across the entire ocean in one mighty jump! WHOOSH! 🌊"},
    {e:"🪷", t:"Hanuman found Sita in Lanka and gave her Rama's ring as proof!"},
    {e:"🏆", t:"Hanuman showed us: with faith and love, nothing is impossible! 🙏"},
  ]},
];

/* ── Festivals Section ──────────────────────────── */
const FESTIVALS = [
  {name:"Diwali", emoji:"🪔", col:P.gold,    desc:"Festival of Lights! We light diyas and burst crackers. Goddess Lakshmi visits clean homes!"},
  {name:"Holi",   emoji:"🌈", col:P.pink,    desc:"Festival of Colors! We throw colored powders & celebrate good winning over evil!"},
  {name:"Navratri",emoji:"⚔️", col:P.saffron,desc:"9 nights of worship for Goddess Durga! We dance Garba and Dandiya with joy!"},
  {name:"Ganesh Chaturthi",emoji:"🐘",col:P.orange,desc:"Ganesh's birthday! We make clay Ganesh idols and worship for 10 days!"},
  {name:"Janmashtami",emoji:"🦚",col:P.purple,desc:"Krishna's birthday! We fast, dance, sing, and break the dahi-handi pot!"},
  {name:"Raksha Bandhan",emoji:"🪡",col:P.teal,desc:"Sisters tie Rakhi on brothers' wrists. Brothers promise to protect them always!"},
];

/* ── Helpers ──────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const root = {
  fontFamily:"'Baloo 2', 'Comic Sans MS', cursive",
  minHeight:"100vh",
  background:"radial-gradient(ellipse at top, #FEF3C7 0%, #FFFBEB 60%, #FEF9EE 100%)",
  userSelect:"none", WebkitUserSelect:"none",
};

/* ── Reusable ─────────────────────────────────────── */
function BackBtn({ label="← Home", onBack, col=P.saffron }) {
  return (
    <button onClick={onBack} style={{
      background:"white", border:`2.5px solid ${col}`, borderRadius:14,
      padding:"8px 18px", fontFamily:"inherit", fontSize:14,
      fontWeight:800, color:col, cursor:"pointer", marginBottom:16, display:"block",
    }}>{label}</button>
  );
}

function Stars({ count, total=5 }) {
  return (
    <div style={{fontSize:24, letterSpacing:3, marginTop:6}}>
      {Array.from({length:total},(_,i) => (
        <span key={i} style={{opacity: i<count ? 1 : 0.18}}>⭐</span>
      ))}
    </div>
  );
}

function TapBtn({ onClick, bg, children, style={} }) {
  return (
    <button onClick={onClick}
      onMouseDown={e => e.currentTarget.style.transform="scale(0.94)"}
      onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
      onTouchStart={e => e.currentTarget.style.transform="scale(0.94)"}
      onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
      style={{background:bg, border:"none", borderRadius:18,
        padding:"14px 28px", fontFamily:"inherit", fontSize:17,
        fontWeight:800, color:"white", cursor:"pointer",
        transition:"transform 0.12s", ...style}}>
      {children}
    </button>
  );
}

/* ── HOME SCREEN ─────────────────────────────────── */
function HomeScreen({ onSelect }) {
  const tiles = [
    {id:"memory",    e:"🃏", title:"Match Cards",    sub:"Find the pairs!",   col:P.saffron, bg:"#FFF5EE"},
    {id:"quiz",      e:"❓", title:"Quiz Time!",     sub:"Test your knowledge!",col:P.purple, bg:"#F5F0FF"},
    {id:"shlokas",   e:"🕉️", title:"Shlokas",        sub:"Chant & learn!",    col:P.pink,   bg:"#FFF0F7"},
    {id:"stories",   e:"📖", title:"Epic Stories",   sub:"Brave tales!",      col:P.green,  bg:"#EEFAF5"},
    {id:"festivals", e:"🎊", title:"Festivals",      sub:"Celebrate India!",   col:P.teal,   bg:"#EEFAFA"},
    {id:"gods",      e:"🙏", title:"Know Your Gods", sub:"Meet the deities!",  col:P.orange, bg:"#FFF8EE"},
  ];

  return (
    <div style={{...root, padding:"20px 14px", textAlign:"center"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:50, marginBottom:4}}>🕉️</div>
        <h1 style={{margin:0, fontSize:30, fontWeight:800, color:P.maroon, letterSpacing:-1}}>
          Dharma Seekho!
        </h1>
        <p style={{margin:"5px 0 0", color:"#B45309", fontSize:14, fontWeight:700}}>
          Learn • Play • Grow 🌸
        </p>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:400, margin:"0 auto"}}>
        {tiles.map(g => (
          <button key={g.id} onClick={() => onSelect(g.id)}
            onMouseDown={e => e.currentTarget.style.transform="scale(0.93)"}
            onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.93)"}
            onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
            style={{
              background:g.bg, border:`3px solid ${g.col}`, borderRadius:22,
              padding:"18px 8px", cursor:"pointer", transition:"transform 0.12s",
              boxShadow:`0 4px 16px ${g.col}44`, fontFamily:"inherit",
            }}>
            <div style={{fontSize:34, marginBottom:6}}>{g.e}</div>
            <div style={{fontSize:15, fontWeight:800, color:g.col}}>{g.title}</div>
            <div style={{fontSize:11, color:"#6B7280", marginTop:3}}>{g.sub}</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:26, fontSize:20, letterSpacing:10, color:P.gold}}>🌸🪔🌸🪔🌸</div>
      <p style={{color:"#9CA3AF", fontSize:11, marginTop:6}}>Sanatan Dharma for little hearts 🙏</p>
    </div>
  );
}

/* ── MEMORY GAME (8 pairs = 16 cards 4×4) ────────── */
function MemoryGame({ onBack }) {
  const makeCards = () =>
    shuffle([
      ...MEMORY_ITEMS.map((c,i) => ({...c, key:`a${i}`, flipped:false, matched:false})),
      ...MEMORY_ITEMS.map((c,i) => ({...c, key:`b${i}`, flipped:false, matched:false})),
    ]);

  const [cards, setCards] = useState(() => makeCards());
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const flip = idx => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;
    const next = cards.map((c,i) => i===idx ? {...c, flipped:true} : c);
    const sel = [...selected, idx];
    setCards(next);
    if (sel.length === 2) {
      setLocked(true);
      setMoves(m => m+1);
      const [a,b] = sel;
      if (next[a].id === next[b].id) {
        setTimeout(() => {
          setCards(c => {
            const u = c.map((card,i) => (i===a||i===b) ? {...card,matched:true} : card);
            if (u.every(x => x.matched)) setWon(true);
            return u;
          });
          setSelected([]); setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards(c => c.map((card,i) => (i===a||i===b) ? {...card,flipped:false} : card));
          setSelected([]); setLocked(false);
        }, 900);
      }
    } else { setSelected(sel); }
  };

  const reset = () => { setCards(makeCards()); setMoves(0); setWon(false); setSelected([]); setLocked(false); };

  return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} />
      <div style={{textAlign:"center", marginBottom:12}}>
        <div style={{fontSize:22, fontWeight:800, color:P.maroon}}>🃏 Match the Cards!</div>
        <div style={{color:"#B45309", fontSize:13}}>Tap two matching cards! Moves: {moves} 🌟</div>
      </div>

      {won ? (
        <div style={{textAlign:"center", padding:"28px 16px"}}>
          <div style={{fontSize:68}}>🏆</div>
          <div style={{fontSize:24, fontWeight:800, color:P.green, marginTop:8}}>शाबाश! Shabash!</div>
          <div style={{color:"#6B7280", marginTop:4, fontSize:15}}>All pairs found in {moves} moves!</div>
          <Stars count={moves<=10?5:moves<=14?4:moves<=18?3:2} />
          <TapBtn onClick={reset} bg={P.saffron} style={{marginTop:20, boxShadow:`0 4px 14px ${P.saffron}66`}}>
            Play Again! 🎮
          </TapBtn>
        </div>
      ) : (
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:7, maxWidth:400, margin:"0 auto"}}>
          {cards.map((card,idx) => {
            const show = card.flipped || card.matched;
            return (
              <div key={card.key} onClick={() => flip(idx)} style={{
                aspectRatio:"1", borderRadius:12, cursor:"pointer",
                background: card.matched ? "#D1FAE5" : show ? "#FFF8EE"
                  : `linear-gradient(135deg, ${P.saffron}, ${P.gold})`,
                border:`2.5px solid ${card.matched ? P.green : show ? P.saffron : "#FF6B3555"}`,
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.09)",
                transition:"all 0.18s",
              }}>
                {show ? (
                  <>
                    <div style={{fontSize:22}}>{card.e}</div>
                    <div style={{fontSize:8, fontWeight:800, color:"#374151", marginTop:2}}>{card.name}</div>
                  </>
                ) : (
                  <div style={{fontSize:20}}>🕉️</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── QUIZ GAME (6 random from 15 questions) ──────── */
function QuizGame({ onBack }) {
  const [pool] = useState(() => shuffle(ALL_QUIZ).slice(0, 7));
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const q = pool[qi];

  const answer = opt => {
    if (picked) return;
    setPicked(opt);
    if (opt.ok) setScore(s => s+1);
  };

  const next = () => {
    if (qi >= pool.length-1) { setDone(true); return; }
    setQi(i => i+1); setPicked(null);
  };

  if (done) return (
    <div style={{...root, padding:"20px", textAlign:"center"}}>
      <BackBtn onBack={onBack} col={P.purple} />
      <div style={{marginTop:20}}>
        <div style={{fontSize:60}}>{score>=6?"🏆":score>=4?"⭐":"💪"}</div>
        <div style={{fontSize:24, fontWeight:800, color:P.maroon, marginTop:10}}>
          {score>=6?"शाबाश! Excellent!":score>=4?"Well done!":"Keep learning!"}
        </div>
        <div style={{fontSize:19, color:"#B45309", marginTop:8}}>{score} / {pool.length} correct! 🌟</div>
        <Stars count={score} total={pool.length} />
        <div style={{display:"flex", flexDirection:"column", gap:10, marginTop:22, maxWidth:300, margin:"22px auto 0"}}>
          <TapBtn bg={P.purple} onClick={() => { setQi(0); setScore(0); setPicked(null); setDone(false); }}>
            Play Again! 🎮
          </TapBtn>
          <button onClick={onBack} style={{
            background:"white", color:P.purple, border:`2px solid ${P.purple}`,
            borderRadius:18, padding:"12px", fontSize:15, fontWeight:800,
            cursor:"pointer", fontFamily:"inherit",
          }}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} col={P.purple} />
      <div style={{textAlign:"center", marginBottom:6}}>
        <span style={{color:"#B45309", fontSize:13, fontWeight:700}}>
          Q {qi+1}/{pool.length} · Score: {score} ⭐
        </span>
      </div>
      <div style={{height:10, background:"#FDE68A", borderRadius:99, marginBottom:18, overflow:"hidden"}}>
        <div style={{height:"100%", background:P.gold, borderRadius:99, width:`${(qi/pool.length)*100}%`, transition:"width 0.35s"}} />
      </div>

      <div style={{background:"white", borderRadius:22, padding:"20px 16px",
        border:"2.5px solid #FDE68A", boxShadow:"0 4px 16px rgba(0,0,0,0.07)",
        textAlign:"center", marginBottom:18}}>
        <div style={{fontSize:21, fontWeight:800, color:"#1F2937", lineHeight:1.4}}>{q.q}</div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14}}>
        {q.a.map((opt,i) => {
          let bg="white", border=`2.5px solid #E5E7EB`, textCol="#374151";
          if (picked) {
            if (opt.ok) { bg="#D1FAE5"; border=`2.5px solid ${P.green}`; textCol=P.green; }
            else if (picked===opt) { bg="#FEE2E2"; border="2.5px solid #DC2626"; textCol="#DC2626"; }
          }
          return (
            <button key={i} onClick={() => answer(opt)} style={{
              background:bg, border, borderRadius:22, padding:"20px 8px",
              cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
              boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <div style={{fontSize:44}}>{opt.e}</div>
              <div style={{fontSize:15, fontWeight:800, color:textCol, marginTop:7}}>{opt.t}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <>
          <div style={{
            background: picked.ok ? "#ECFDF5" : "#FFF3EE",
            border:`2px solid ${picked.ok ? P.green : P.saffron}`,
            borderRadius:16, padding:"12px 14px", textAlign:"center", marginBottom:14,
          }}>
            <div style={{fontSize:20}}>{picked.ok ? "🎉" : "💡"}</div>
            <div style={{fontSize:13, color:"#374151", marginTop:4, fontWeight:700}}>{q.fact}</div>
          </div>
          <TapBtn onClick={next} bg={P.purple} style={{width:"100%"}}>
            {qi >= pool.length-1 ? "See Results! 🏆" : "Next Question →"}
          </TapBtn>
        </>
      )}
    </div>
  );
}

/* ── SHLOKAS ─────────────────────────────────────── */
function ShlokasScreen({ onBack }) {
  const [si, setSi] = useState(0);
  const [chanting, setChanting] = useState(false);
  const s = SHLOKAS[si];

  const chant = () => { setChanting(true); setTimeout(() => setChanting(false), 2500); };

  return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} col={P.pink} />
      <div style={{textAlign:"center", marginBottom:14}}>
        <div style={{fontSize:20, fontWeight:800, color:P.maroon}}>🕉️ Sacred Shlokas</div>
        <div style={{fontSize:12, color:"#B45309"}}>{si+1} of {SHLOKAS.length} — Tap and chant!</div>
      </div>

      <div style={{
        background:"white", borderRadius:26, padding:"22px 18px",
        border:`3px solid ${s.col}`, boxShadow:`0 8px 28px ${s.col}44`,
        textAlign:"center", marginBottom:18,
      }}>
        <div style={{
          fontSize: chanting ? 62 : 54, marginBottom:8,
          display:"inline-block", transition:"all 0.25s",
          transform: chanting ? "scale(1.18)" : "scale(1)",
        }}>{s.deity}</div>
        {chanting && (
          <div style={{fontSize:13, fontWeight:700, color:s.col, marginBottom:8, letterSpacing:3}}>
            🔔 ॐ ॐ ॐ 🔔
          </div>
        )}
        <div style={{fontSize:16, fontWeight:800, color:s.col, marginBottom:12}}>{s.title}</div>
        <div style={{
          fontSize:16, color:"#1F2937", fontWeight:700, lineHeight:2.1,
          whiteSpace:"pre-line", marginBottom:10,
          fontFamily:"'Noto Sans Devanagari', 'Mangal', serif",
        }}>{s.hindi}</div>
        <div style={{fontSize:12, color:"#6B7280", lineHeight:1.8, whiteSpace:"pre-line", marginBottom:10}}>{s.roman}</div>
        <div style={{
          background:"#FEF3C7", borderRadius:12, padding:"10px 12px",
          fontSize:13, color:"#92400E", lineHeight:1.6, whiteSpace:"pre-line",
        }}>💡 {s.meaning}</div>
      </div>

      <TapBtn onClick={chant} bg={chanting ? P.green : s.col}
        style={{width:"100%", marginBottom:14, fontSize:16,
          boxShadow:`0 4px 16px ${s.col}55`,
          transform: chanting ? "scale(0.97)" : "scale(1)", transition:"all 0.2s"}}>
        {chanting ? "🔔 Chanting... 🙏" : "🙏 Tap to Chant!"}
      </TapBtn>

      {/* Nav */}
      <div style={{display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap"}}>
        {SHLOKAS.map((sh,i) => (
          <button key={i} onClick={() => { setSi(i); setChanting(false); }} style={{
            fontSize:22, background: i===si ? sh.col : "#FEF3C7",
            border:`2.5px solid ${sh.col}`, borderRadius:"50%",
            width:46, height:46, cursor:"pointer", transition:"all 0.2s",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>{sh.deity}</button>
        ))}
      </div>
    </div>
  );
}

/* ── STORIES ─────────────────────────────────────── */
function StoriesScreen({ onBack }) {
  const [story, setStory] = useState(null);
  const [slide, setSlide] = useState(0);

  if (!story) return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} col={P.green} />
      <div style={{textAlign:"center", marginBottom:18}}>
        <div style={{fontSize:20, fontWeight:800, color:P.maroon}}>📖 Epic Stories</div>
        <div style={{fontSize:12, color:"#B45309"}}>{STORIES.length} stories — choose one!</div>
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:12, maxWidth:400, margin:"0 auto"}}>
        {STORIES.map((st,i) => (
          <button key={i} onClick={() => { setStory(st); setSlide(0); }} style={{
            background:"white", border:`3px solid ${st.col}`, borderRadius:20,
            padding:"16px 18px", cursor:"pointer", display:"flex",
            alignItems:"center", gap:14, boxShadow:`0 4px 14px ${st.col}33`,
            fontFamily:"inherit",
          }}>
            <div style={{fontSize:38}}>{st.emoji}</div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:16, fontWeight:800, color:st.col}}>{st.title}</div>
              <div style={{fontSize:11, color:"#6B7280"}}>{st.slides.length} slides · Tap to start! 📖</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const s = story.slides[slide];
  const isLast = slide === story.slides.length - 1;

  return (
    <div style={{...root, padding:"14px", textAlign:"center"}}>
      <button onClick={() => setStory(null)} style={{
        background:"white", border:`2.5px solid ${story.col}`, borderRadius:14,
        padding:"8px 18px", fontFamily:"inherit", fontSize:14,
        fontWeight:800, color:story.col, cursor:"pointer", marginBottom:14, display:"block",
      }}>← Stories</button>

      <div style={{fontSize:16, fontWeight:800, color:story.col, marginBottom:14}}>
        {story.emoji} {story.title}
      </div>

      <div style={{
        background:"white", borderRadius:26, padding:"32px 22px",
        border:`3px solid ${story.col}`, boxShadow:`0 8px 28px ${story.col}44`,
        minHeight:210, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", marginBottom:18,
      }}>
        <div style={{fontSize:70, marginBottom:16}}>{s.e}</div>
        <div style={{fontSize:18, fontWeight:700, color:"#1F2937", lineHeight:1.5, maxWidth:300}}>{s.t}</div>
      </div>

      <div style={{display:"flex", gap:8, justifyContent:"center", marginBottom:18}}>
        {story.slides.map((_,i) => (
          <div key={i} style={{
            width:11, height:11, borderRadius:"50%",
            background: i<=slide ? story.col : "#E5E7EB", transition:"background 0.3s",
            cursor:"pointer",
          }} onClick={() => setSlide(i)} />
        ))}
      </div>

      {isLast ? (
        <>
          <div style={{fontSize:18, fontWeight:800, color:P.green, marginBottom:12}}>🎉 The End! Great job!</div>
          <div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap"}}>
            <TapBtn bg={story.col} onClick={() => setSlide(0)}>Read Again 🔄</TapBtn>
            <button onClick={() => setStory(null)} style={{
              background:"white", color:story.col, border:`2px solid ${story.col}`,
              borderRadius:18, padding:"14px 22px", fontSize:15, fontWeight:800,
              cursor:"pointer", fontFamily:"inherit",
            }}>More Stories 📖</button>
          </div>
        </>
      ) : (
        <TapBtn bg={story.col} onClick={() => setSlide(p => p+1)}
          style={{padding:"16px 56px", fontSize:19, boxShadow:`0 4px 16px ${story.col}55`}}>
          Next →
        </TapBtn>
      )}
    </div>
  );
}

/* ── FESTIVALS ───────────────────────────────────── */
function FestivalsScreen({ onBack }) {
  const [chosen, setChosen] = useState(null);

  return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} col={P.teal} />
      <div style={{textAlign:"center", marginBottom:18}}>
        <div style={{fontSize:20, fontWeight:800, color:P.maroon}}>🎊 Indian Festivals</div>
        <div style={{fontSize:12, color:"#B45309"}}>Tap a festival to learn about it!</div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:400, margin:"0 auto"}}>
        {FESTIVALS.map((f,i) => (
          <button key={i} onClick={() => setChosen(chosen?.name===f.name ? null : f)}
            style={{
              background: chosen?.name===f.name ? f.col : "white",
              border:`3px solid ${f.col}`, borderRadius:20, padding:"16px 10px",
              cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
              boxShadow:`0 4px 14px ${f.col}33`,
            }}>
            <div style={{fontSize:32, marginBottom:6}}>{f.emoji}</div>
            <div style={{fontSize:13, fontWeight:800, color: chosen?.name===f.name ? "white" : f.col}}>
              {f.name}
            </div>
          </button>
        ))}
      </div>

      {chosen && (
        <div style={{
          background:"white", border:`3px solid ${chosen.col}`,
          borderRadius:20, padding:"18px 16px", marginTop:16, textAlign:"center",
          boxShadow:`0 6px 20px ${chosen.col}44`, maxWidth:400, margin:"16px auto 0",
        }}>
          <div style={{fontSize:44, marginBottom:8}}>{chosen.emoji}</div>
          <div style={{fontSize:17, fontWeight:800, color:chosen.col, marginBottom:8}}>{chosen.name}</div>
          <div style={{fontSize:14, color:"#374151", lineHeight:1.6}}>{chosen.desc}</div>
        </div>
      )}
    </div>
  );
}

/* ── KNOW YOUR GODS ──────────────────────────────── */
const GODS_INFO = [
  {name:"Ganesh",    e:"🐘", col:P.saffron, title:"Remover of Obstacles", vehicle:"🐭 Mouse",    weapon:"🪄 Modak (sweet)", desc:"Ganesh is always prayed to FIRST! He removes problems and gives wisdom. Son of Shiva and Parvati."},
  {name:"Krishna",   e:"🦚", col:P.purple,  title:"The Divine Protector",  vehicle:"🦚 Peacock",  weapon:"🎵 Flute + Sudarshana Chakra", desc:"Krishna loves butter, plays the flute, and protects all his devotees! He taught us the Bhagavad Gita."},
  {name:"Hanuman",   e:"💪", col:"#DC2626",  title:"The Mighty Devotee",   vehicle:"✈️ Himself!",  weapon:"💪 Mace (Gada)", desc:"Hanuman is the strongest! He is the greatest devotee of Rama. He can fly and grow big or small!"},
  {name:"Lakshmi",   e:"🪔", col:P.gold,    title:"Goddess of Wealth",    vehicle:"🦉 Owl",       weapon:"🪷 Lotus flower", desc:"Lakshmi brings wealth, happiness, and good luck! She visits clean homes on Diwali night."},
  {name:"Saraswati", e:"🎵", col:P.pink,    title:"Goddess of Knowledge",  vehicle:"🦢 Swan",      weapon:"📚 Books + Veena", desc:"Saraswati gives us intelligence and creativity! Students pray to her before exams and studies."},
  {name:"Shiva",     e:"🔱", col:P.purple,  title:"The Great Destroyer",   vehicle:"🐂 Nandi Bull",weapon:"🔱 Trishul (Trident)", desc:"Shiva is very powerful and kind. He destroys evil. He lives on Mount Kailash with Parvati."},
  {name:"Durga",     e:"⚔️",  col:P.pink,    title:"The Warrior Goddess",  vehicle:"🦁 Lion",      weapon:"⚔️ Many weapons!", desc:"Durga has 8 arms and fights evil! She defeated the great demon Mahishasura. We worship her in Navratri."},
  {name:"Rama",      e:"🏹", col:P.green,   title:"The Ideal King",        vehicle:"🌺 Pushpak",   weapon:"🏹 Bow & Arrows",  desc:"Rama is the perfect son, husband, and king! He is the hero of Ramayana. We celebrate Diwali for him."},
];

function GodsScreen({ onBack }) {
  const [chosen, setChosen] = useState(null);

  if (chosen) return (
    <div style={{...root, padding:"14px"}}>
      <button onClick={() => setChosen(null)} style={{
        background:"white", border:`2.5px solid ${chosen.col}`, borderRadius:14,
        padding:"8px 18px", fontFamily:"inherit", fontSize:14,
        fontWeight:800, color:chosen.col, cursor:"pointer", marginBottom:14, display:"block",
      }}>← All Gods</button>

      <div style={{
        background:"white", borderRadius:26, padding:"28px 20px",
        border:`3px solid ${chosen.col}`, boxShadow:`0 8px 28px ${chosen.col}44`,
        textAlign:"center", maxWidth:400, margin:"0 auto",
      }}>
        <div style={{fontSize:72, marginBottom:10}}>{chosen.e}</div>
        <div style={{fontSize:22, fontWeight:800, color:chosen.col}}>{chosen.name}</div>
        <div style={{fontSize:13, color:"#6B7280", marginBottom:16}}>{chosen.title}</div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16}}>
          <div style={{background:"#FEF3C7", borderRadius:14, padding:"10px 8px"}}>
            <div style={{fontSize:11, color:"#92400E", fontWeight:700}}>VEHICLE (Vahana)</div>
            <div style={{fontSize:16, marginTop:4}}>{chosen.vehicle}</div>
          </div>
          <div style={{background:"#FEF3C7", borderRadius:14, padding:"10px 8px"}}>
            <div style={{fontSize:11, color:"#92400E", fontWeight:700}}>WEAPON / SYMBOL</div>
            <div style={{fontSize:16, marginTop:4}}>{chosen.weapon}</div>
          </div>
        </div>

        <div style={{background:"#F0FDF4", border:`1.5px solid ${P.green}`, borderRadius:14, padding:"12px 14px"}}>
          <div style={{fontSize:14, color:"#374151", lineHeight:1.6}}>{chosen.desc}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{...root, padding:"14px"}}>
      <BackBtn onBack={onBack} col={P.orange} />
      <div style={{textAlign:"center", marginBottom:18}}>
        <div style={{fontSize:20, fontWeight:800, color:P.maroon}}>🙏 Know Your Gods</div>
        <div style={{fontSize:12, color:"#B45309"}}>Tap a deity to learn more!</div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10, maxWidth:400, margin:"0 auto"}}>
        {GODS_INFO.map((g,i) => (
          <button key={i} onClick={() => setChosen(g)} style={{
            background:"white", border:`2.5px solid ${g.col}`, borderRadius:16,
            padding:"14px 6px", cursor:"pointer", fontFamily:"inherit",
            transition:"transform 0.12s", boxShadow:`0 3px 10px ${g.col}33`,
          }}
            onMouseDown={e => e.currentTarget.style.transform="scale(0.93)"}
            onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.93)"}
            onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{fontSize:28, marginBottom:4}}>{g.e}</div>
            <div style={{fontSize:10, fontWeight:800, color:g.col}}>{g.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── APP ROOT ─────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const go = s => setScreen(s);
  const home = () => setScreen("home");

  if (screen === "memory")    return <MemoryGame    onBack={home} />;
  if (screen === "quiz")      return <QuizGame      onBack={home} />;
  if (screen === "shlokas")   return <ShlokasScreen onBack={home} />;
  if (screen === "stories")   return <StoriesScreen onBack={home} />;
  if (screen === "festivals") return <FestivalsScreen onBack={home} />;
  if (screen === "gods")      return <GodsScreen    onBack={home} />;
  return <HomeScreen onSelect={go} />;
}
