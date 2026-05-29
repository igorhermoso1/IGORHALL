// appIgorHall.js — IgorHall v1.5 — Motor NLP semántico

// ============================
// INTRO + BOOT
// ============================
window.addEventListener("load", () => {
    setTimeout(() => {
        const intro = document.getElementById("introScreen");
        if(intro) intro.classList.add("is-done");
        document.body.classList.add("intro-complete");
        loadProfile();
        refreshEggIndex();
    }, 2600);
});

// ============================
// RELOJ
// ============================
function updateClock(){
    const now = new Date();
    const el = document.getElementById("clock");
    if(el) el.textContent =
        String(now.getHours()).padStart(2,"0")+":"+
        String(now.getMinutes()).padStart(2,"0")+":"+
        String(now.getSeconds()).padStart(2,"0");
}
setInterval(updateClock,1000); updateClock();

// ============================
// TÍTULO DINÁMICO
// ============================
const titles=["IGOR HALL","INSERT COIN","READY PLAYER ONE","LOADING KNOWLEDGE..."];
let ti=0;
setInterval(()=>{ document.title=titles[ti]; ti=(ti+1)%titles.length; },2500);

// ============================
// SPOTLIGHT EN CARDS
// ============================
document.querySelectorAll(".card").forEach((card,idx)=>{
    card.style.setProperty("--card-index",idx+1);
    card.addEventListener("mousemove",e=>{
        const r=card.getBoundingClientRect();
        card.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,var(--spot-color,rgba(127,220,255,0.15)),rgba(255,255,255,0.03) 45%)`;
    });
    card.addEventListener("mouseleave",()=>{ card.style.background=""; });
});

// Cards coming-soon → abrir modal info en su pestaña
document.querySelectorAll("[data-assistant-topic]").forEach(card=>{
    card.addEventListener("click",e=>{
        e.preventDefault();
        const topic=card.dataset.assistantTopic;
        const validTabs=["html","javascript","hardware","redes","server","cyber","sql","excel","unity","ia","linux","python","react"];
        if(validTabs.includes(topic)) openInfoModal(topic);
        else openAssistant();
    });
});

// ============================
// MODAL INFO
// ============================
const infoModal      = document.getElementById("infoModal");
const openInfoButton = document.getElementById("openInfoModal");
const tabButtons     = document.querySelectorAll(".tab-button");
const tabPanels      = document.querySelectorAll(".tab-panel");

function openInfoModal(tabName="html"){
    if(!infoModal) return;
    infoModal.classList.add("is-open");
    infoModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    activateTab(tabName);
}
function closeInfoModal(){
    if(!infoModal) return;
    infoModal.classList.remove("is-open");
    infoModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
}
function activateTab(name){
    tabButtons.forEach(b=>{
        const on=b.dataset.tab===name;
        b.classList.toggle("active",on);
        b.setAttribute("aria-selected",String(on));
    });
    tabPanels.forEach(p=>p.classList.toggle("active",p.id==="tab-"+name));
}
if(openInfoButton) openInfoButton.addEventListener("click",()=>openInfoModal());
document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",closeInfoModal));
tabButtons.forEach(b=>b.addEventListener("click",()=>activateTab(b.dataset.tab)));

// ============================
// MODAL EASTER EGGS
// ============================
const eggModal   = document.getElementById("eggModal");
const openEggBtn = document.getElementById("openEggModal");
const closeEggBtn= document.getElementById("closeEggModal");
const eggModalBg = document.getElementById("eggModalBackdrop");

function openEggModal(){
    if(!eggModal) return;
    eggModal.classList.add("is-open");
    eggModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    refreshEggIndex();
}
function closeEggModal(){
    if(!eggModal) return;
    eggModal.classList.remove("is-open");
    eggModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
}
if(openEggBtn)  openEggBtn.addEventListener("click", openEggModal);
if(closeEggBtn) closeEggBtn.addEventListener("click", closeEggModal);
if(eggModalBg)  eggModalBg.addEventListener("click", closeEggModal);

document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
        closeInfoModal(); closeEggModal(); closeProfileModal();
        document.querySelectorAll(".easter-overlay.active").forEach(o=>closeEgg(o));
    }
});

// ============================
// EASTER EGG TRACKER
// ============================
const EGG_IDS=["konami","dragonage","baldur","reddead","fallout","metalgear","witcher","onepiece","batman","starwars","padrino","pokemon","pacman","matrix"];
const EGG_TOTAL=14;

function getUnlockedEggs(){ try{ return JSON.parse(localStorage.getItem("igorhall_eggs")||"[]"); }catch(e){ return []; } }
function markEggUnlocked(id){
    const u=getUnlockedEggs();
    if(!u.includes(id)){ u.push(id); try{ localStorage.setItem("igorhall_eggs",JSON.stringify(u)); }catch(e){} }
    refreshEggIndex();
}
function refreshEggIndex(){
    const u=getUnlockedEggs(); const n=u.length;
    const mc=document.getElementById("eggModalCount"); if(mc) mc.textContent=n;
    const pf=document.getElementById("eggProgressFill"); if(pf) pf.style.width=(n/EGG_TOTAL*100)+"%";
    const cc=document.getElementById("eggCardCount"); if(cc) cc.textContent=n+" / "+EGG_TOTAL+" desbloqueados";
    document.querySelectorAll(".egg-item").forEach(item=>{
        if(item.dataset.eggId && u.includes(item.dataset.eggId)){ item.classList.remove("locked"); item.classList.add("unlocked"); }
    });
}

// ============================
// EASTER EGG OVERLAYS
// ============================
const EGG_ID_MAP={
    "konamiFlash":"konami","eggDragonAge":"dragonage","eggBaldur":"baldur",
    "eggRedDead":"reddead","eggFallout":"fallout","eggMetalGear":"metalgear",
    "eggWitcher":"witcher","eggOnePiece":"onepiece","eggBatman":"batman",
    "eggStarWars":"starwars","eggPadrino":"padrino","eggPokemon":"pokemon",
    "eggPacman":"pacman","eggMatrix":"matrix"
};
function showEgg(id, duration=4500){
    const el=document.getElementById(id); if(!el) return;
    document.querySelectorAll(".easter-overlay.active").forEach(o=>closeEgg(o));
    el.classList.add("active"); el.setAttribute("aria-hidden","false");
    if(!el.querySelector(".egg-dismiss")){
        const d=document.createElement("span"); d.className="egg-dismiss";
        d.textContent="[ CLICK O ESC PARA CERRAR ]";
        el.querySelector(".egg-content")?.appendChild(d);
    }
    const t=setTimeout(()=>closeEgg(el),duration); el.dataset.timer=t;
    el.addEventListener("click",()=>closeEgg(el),{once:true});
    if(EGG_ID_MAP[id]) markEggUnlocked(EGG_ID_MAP[id]);
}
function closeEgg(el){ el.classList.remove("active"); el.setAttribute("aria-hidden","true"); clearTimeout(Number(el.dataset.timer)); }

// ============================
// EASTER EGGS — TRIGGERS
// ============================
(function initEasterEggs(){
    // Konami code
    const seq=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos=0;
    document.addEventListener("keydown",e=>{
        pos=(e.key===seq[pos])?pos+1:e.key===seq[0]?1:0;
        if(pos===seq.length){ pos=0; showEgg("konamiFlash",3500); }
    });
    // Mobile: 4 taps en el título
    let taps=0,tapT;
    document.querySelector(".title")?.addEventListener("click",()=>{
        taps++; clearTimeout(tapT); tapT=setTimeout(()=>taps=0,700);
        if(taps>=4){ taps=0; showEgg("konamiFlash",3500); }
    });
    // Escritura de palabras clave (buffer 20 chars)
    let typed="";
    const triggers={
        darkspawn:"eggDragonAge",inquisition:"eggDragonAge",solas:"eggDragonAge",
        baldur:"eggBaldur",laezel:"eggBaldur",astarion:"eggBaldur",shadowheart:"eggBaldur",dice:"eggBaldur",
        arthur:"eggRedDead",reddead:"eggRedDead",rdrd:"eggRedDead",
        vault:"eggFallout",fallout:"eggFallout",wasteland:"eggFallout",nuka:"eggFallout",
        snake:"eggMetalGear",bigboss:"eggMetalGear",codec:"eggMetalGear",otacon:"eggMetalGear",
        geralt:"eggWitcher",rivia:"eggWitcher",witcher:"eggWitcher",yennefer:"eggWitcher",
        nakama:"eggOnePiece",luffy:"eggOnePiece",onepiece:"eggOnePiece",zoro:"eggOnePiece",
        batman:"eggBatman",joker:"eggBatman",gotham:"eggBatman",
        jedi:"eggStarWars",yoda:"eggStarWars",sith:"eggStarWars",vader:"eggStarWars",
        corleone:"eggPadrino",padrino:"eggPadrino",godfather:"eggPadrino",
        pikachu:"eggPokemon",charizard:"eggPokemon",bulbasaur:"eggPokemon",
        pacman:"eggPacman",waka:"eggPacman",blinky:"eggPacman",
        matrix:"eggMatrix",morpheus:"eggMatrix",redpill:"eggMatrix",bluepill:"eggMatrix",
    };
    document.addEventListener("keydown",e=>{
        if(e.key.length!==1) return;
        typed=(typed+e.key.toLowerCase()).slice(-20);
        for(const [kw,id] of Object.entries(triggers)){
            if(typed.includes(kw)){ typed=""; showEgg(id,5000); break; }
        }
    });
    // 3 clicks en el reloj → Fallout
    let clkC=0,clkT;
    document.getElementById("clock")?.addEventListener("click",()=>{
        clkC++; clearTimeout(clkT); clkT=setTimeout(()=>clkC=0,1000);
        if(clkC>=3){ clkC=0; showEgg("eggFallout",5000); }
    });
    // Hover 3s en footer → Dragon Age
    let footerT;
    document.querySelector(".footer")?.addEventListener("mouseenter",()=>{ footerT=setTimeout(()=>showEgg("eggDragonAge",5000),3000); });
    document.querySelector(".footer")?.addEventListener("mouseleave",()=>clearTimeout(footerT));
    // Click en card-number 03 → Baldur
    document.querySelectorAll(".card-number").forEach(el=>{
        if(el.textContent.trim()==="03"){
            el.style.cursor="pointer";
            el.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); showEgg("eggBaldur",5000); });
        }
    });
})();

// ============================
// PARTÍCULAS
// ============================
(function spawnParticles(){
    const c=document.getElementById("particles"); if(!c) return;
    const colors=["rgba(127,220,255,0.7)","rgba(255,159,67,0.65)","rgba(255,79,216,0.6)","rgba(139,92,255,0.65)","rgba(71,245,208,0.6)","rgba(109,255,143,0.55)"];
    const n=window.innerWidth<700?18:38;
    for(let i=0;i<n;i++){
        const p=document.createElement("div"); p.className="particle";
        const size=Math.random()*3+1.5, left=Math.random()*100, delay=Math.random()*18, dur=Math.random()*14+10, col=colors[Math.floor(Math.random()*colors.length)];
        p.style.cssText=`width:${size}px;height:${size}px;left:${left}%;background:${col};box-shadow:0 0 ${size*3}px ${col};animation-duration:${dur}s;animation-delay:${delay}s`;
        c.appendChild(p);
    }
})();

// ============================
// SCROLL PROGRESS
// ============================
(function(){
    const bar=document.createElement("div"); bar.className="scroll-progress"; document.body.prepend(bar);
    window.addEventListener("scroll",()=>{ const max=document.documentElement.scrollHeight-window.innerHeight; bar.style.width=(max>0?(window.scrollY/max*100):0)+"%"; },{passive:true});
})();

// ============================
// CONTADOR MÓDULOS
// ============================
(function(){
    const el=document.getElementById("moduleCounter"); if(!el) return;
    const total=document.querySelectorAll(".menu-container .card").length; let cur=0;
    const iv=setInterval(()=>{ cur++; el.textContent=cur+" MÓDULOS"; if(cur>=total) clearInterval(iv); },120);
})();

// ============================
// PERFIL — MODAL CENTRADO
// ============================
const profileModal   = document.getElementById("profileModal");
const openProfileBtn = document.getElementById("openProfilePanel");
const closeProfileBtns = document.querySelectorAll("[data-close-profile]");
const saveProfileBtn = document.getElementById("saveProfile");
const clearProfileBtn= document.getElementById("clearProfile");
const profileError   = document.getElementById("profileError");
const greetingBadge  = document.getElementById("greetingBadge");

function hashEmail(e){ let h=5381; for(let i=0;i<e.length;i++) h=((h<<5)+h)^e.charCodeAt(i); return (h>>>0).toString(16).padStart(8,"0"); }
function getRegistered(){ try{ return JSON.parse(localStorage.getItem("igorhall_registered")||"{}"); }catch(e){ return {}; } }
function isEmailRegistered(email){ return !!getRegistered()[hashEmail(email.toLowerCase().trim())]; }
function registerEmail(email,uid){ const r=getRegistered(); r[hashEmail(email.toLowerCase().trim())]={uid,ts:Date.now()}; try{ localStorage.setItem("igorhall_registered",JSON.stringify(r)); }catch(e){} }
function generateUID(){ return "IGH-"+Math.random().toString(36).substr(2,4).toUpperCase()+"-"+Date.now().toString(36).toUpperCase().slice(-4); }
function generateCode(){ return String(Math.floor(100000+Math.random()*900000)); }

let _pendingCode=null, _pendingData=null;

function openProfileModal(){
    if(!profileModal) return;
    profileModal.classList.add("is-open");
    profileModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    refreshProfileUI();
}
function closeProfileModal(){
    if(!profileModal) return;
    profileModal.classList.remove("is-open");
    profileModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    const vs=document.getElementById("verifyStep"); if(vs) vs.classList.remove("is-active");
}
function refreshProfileUI(){
    try{
        const s=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
        const sr=document.getElementById("profileStatusRow"); const ud=document.getElementById("profileUidDisplay");
        if(s&&s.verified){ if(sr) sr.style.display="flex"; if(ud) ud.textContent=s.uid||""; }
        else { if(sr) sr.style.display="none"; }
    }catch(e){}
}
function showGreeting(name){
    if(!greetingBadge||!name) return;
    greetingBadge.textContent="¡Hola, "+name+"! 👾";
    greetingBadge.classList.add("visible");
}
function loadProfile(){
    try{
        const s=JSON.parse(localStorage.getItem("igorhall_profile")||"null"); if(!s) return;
        const set=(id,v)=>{ const el=document.getElementById(id); if(el&&v) el.value=v; };
        set("profileName",s.name); set("profileEmail",s.email); set("profilePhone",s.phone);
        set("profileLocation",s.location); set("profileSource",s.source); set("profileContact",s.contact);
        if(s.name) showGreeting(s.name);
    }catch(e){}
}

if(openProfileBtn) openProfileBtn.addEventListener("click", openProfileModal);
closeProfileBtns.forEach(b=>b.addEventListener("click", closeProfileModal));
profileModal?.querySelector(".modal-backdrop")?.addEventListener("click", closeProfileModal);

if(saveProfileBtn){
    saveProfileBtn.addEventListener("click",()=>{
        if(!profileError) return; profileError.textContent="";
        const name=(document.getElementById("profileName")?.value||"").trim();
        const email=(document.getElementById("profileEmail")?.value||"").trim();
        const phone=(document.getElementById("profilePhone")?.value||"").trim();
        const location=(document.getElementById("profileLocation")?.value||"").trim();
        const source=document.getElementById("profileSource")?.value||"";
        const contact=(document.getElementById("profileContact")?.value||"").trim();
        if(!name){ profileError.textContent="⚠ El nombre es obligatorio."; return; }
        if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ profileError.textContent="⚠ Email no válido."; return; }
        if(!phone||phone.replace(/\D/g,"").length<9){ profileError.textContent="⚠ Teléfono con al menos 9 dígitos."; return; }
        const cur=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
        const curEmail=cur?.email?.toLowerCase().trim()||"";
        if(isEmailRegistered(email)&&email.toLowerCase().trim()!==curEmail){ profileError.textContent="⚠ Este email ya está registrado."; return; }
        if(cur?.verified&&email.toLowerCase().trim()===curEmail){
            try{ localStorage.setItem("igorhall_profile",JSON.stringify({...cur,name,phone,location,source,contact})); }catch(e){}
            showGreeting(name); profileError.style.color="var(--cyan)"; profileError.textContent="✓ Perfil actualizado.";
            setTimeout(()=>{ profileError.textContent=""; profileError.style.color=""; closeProfileModal(); },1500); return;
        }
        _pendingCode=generateCode(); _pendingData={name,email,phone,location,source,contact};
        const cd=document.getElementById("verifyCodeDisplay"); if(cd) cd.textContent=_pendingCode;
        const vs=document.getElementById("verifyStep"); if(vs) vs.classList.add("is-active");
        const vi=document.getElementById("verifyInput"); if(vi){ vi.value=""; vi.focus(); }
    });
}
const verifyConfirmBtn=document.getElementById("verifyConfirmBtn");
const verifyResendBtn =document.getElementById("verifyResendBtn");
const verifyError     =document.getElementById("verifyError");
if(verifyConfirmBtn){
    verifyConfirmBtn.addEventListener("click",()=>{
        const input=(document.getElementById("verifyInput")?.value||"").trim();
        if(input!==_pendingCode){ if(verifyError) verifyError.textContent="⚠ Código incorrecto."; return; }
        const uid=generateUID();
        try{ localStorage.setItem("igorhall_profile",JSON.stringify({..._pendingData,verified:true,uid,ts:Date.now()})); }catch(e){}
        registerEmail(_pendingData.email,uid); showGreeting(_pendingData.name);
        _pendingCode=null; _pendingData=null;
        const vs=document.getElementById("verifyStep"); if(vs) vs.classList.remove("is-active");
        refreshProfileUI();
        if(profileError){ profileError.style.color="var(--cyan)"; profileError.textContent="✓ ¡Cuenta verificada!"; }
        setTimeout(()=>{ if(profileError){ profileError.textContent=""; profileError.style.color=""; } closeProfileModal(); },1600);
    });
}
document.getElementById("verifyInput")?.addEventListener("input",function(){
    this.value=this.value.replace(/\D/g,"").slice(0,6); if(this.value.length===6) verifyConfirmBtn?.click();
});
if(verifyResendBtn){
    verifyResendBtn.addEventListener("click",()=>{
        _pendingCode=generateCode();
        const cd=document.getElementById("verifyCodeDisplay"); if(cd) cd.textContent=_pendingCode;
        if(verifyError) verifyError.textContent="";
        document.getElementById("verifyInput")?.focus();
    });
}
if(clearProfileBtn){
    clearProfileBtn.addEventListener("click",()=>{
        try{
            const s=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
            if(s?.email){ const r=getRegistered(); delete r[hashEmail(s.email.toLowerCase().trim())]; localStorage.setItem("igorhall_registered",JSON.stringify(r)); }
            localStorage.removeItem("igorhall_profile");
        }catch(e){}
        ["profileName","profileEmail","profilePhone","profileLocation","profileContact"].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=""; });
        const sel=document.getElementById("profileSource"); if(sel) sel.value="";
        const vs=document.getElementById("verifyStep"); if(vs) vs.classList.remove("is-active");
        const sr=document.getElementById("profileStatusRow"); if(sr) sr.style.display="none";
        if(greetingBadge){ greetingBadge.textContent=""; greetingBadge.classList.remove("visible"); }
        if(profileError){ profileError.style.color="var(--orange)"; profileError.textContent="Datos borrados."; setTimeout(()=>{ profileError.textContent=""; profileError.style.color=""; },2500); }
    });
}

// ============================
// ASISTENTE VIRTUAL
// ============================
const assistant        = document.getElementById("virtualAssistant");
const assistantAvatar  = document.getElementById("assistantAvatar");
const assistantSprite  = document.getElementById("assistantSprite");
const assistantChat    = document.getElementById("assistantChat");
const assistantClose   = document.getElementById("assistantClose");
const assistantForm    = document.getElementById("assistantForm");
const assistantInput   = document.getElementById("assistantInput");
const assistantMessages= document.getElementById("assistantMessages");

const frames={
    idle:["assets/avatar/idl1.png","assets/avatar/idl2.png","assets/avatar/idl3.png","assets/avatar/idl2.png"],
    talk:["assets/avatar/saludo1.png","assets/avatar/saludo2.png","assets/avatar/saludo3.png"]
};
let aMode="idle", aFrame=0, aTalkTimer;
function setMode(mode,dur=0){ aMode=mode; aFrame=0; clearTimeout(aTalkTimer); if(dur) aTalkTimer=setTimeout(()=>{ aMode="idle"; aFrame=0; },dur); }
setInterval(()=>{ if(!assistantSprite) return; const fr=frames[aMode]||frames.idle; assistantSprite.src=fr[aFrame%fr.length]; aFrame++; },280);

function openAssistant(){ if(!assistant) return; assistant.classList.add("is-open"); if(assistantChat) assistantChat.setAttribute("aria-hidden","false"); setMode("talk",900); setTimeout(()=>assistantInput?.focus(),150); }

if(assistantAvatar){
    assistantAvatar.addEventListener("click",()=>{
        if(!assistant) return;
        if(assistant.classList.contains("is-open")){ assistant.classList.remove("is-open"); if(assistantChat) assistantChat.setAttribute("aria-hidden","true"); setMode("idle"); }
        else { openAssistant(); }
    });
}
if(assistantClose){
    assistantClose.addEventListener("click",()=>{ if(!assistant) return; assistant.classList.remove("is-open"); if(assistantChat) assistantChat.setAttribute("aria-hidden","true"); setMode("idle"); });
}

let botContext = null; // Contexto de conversación

function addMsg(text, type="bot"){
    if(!assistantMessages) return;
    const m=document.createElement("p"); m.className="assistant-message "+type; m.textContent=text;
    assistantMessages.appendChild(m); assistantMessages.scrollTop=assistantMessages.scrollHeight;
}

// ============================
// CHATBOT — MOTOR NLP SEMÁNTICO
// Motor basado en intención + tokens semánticos + contexto de conversación
// Entiende lenguaje natural sin necesitar palabras exactas
// ============================

// Normalizar: quitar tildes, minúsculas, eliminar stopwords
const STOPWORDS = new Set(["el","la","los","las","un","una","unos","unas","de","del","al","en","con","para","por","que","me","te","se","si","no","es","son","soy","hay","fue","ser","mas","pero","como","cuando","donde","quien","cual","ya","lo","le","y","a","o","e"]);

function nlpProcess(text){
    return text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9\s]/g," ")
        .replace(/\s+/g," ").trim()
        .split(" ")
        .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

// Definición de INTENCIONES — cada intención tiene: aliases semánticos (triggers), respuestas variadas, y context
const INTENTS = [

    // ── SALUDOS Y META ────────────────────────────────────────────────────────
    {
        id:"greeting",
        triggers:["hola","buenas","hey","ey","saludos","hello","hi","buenas tardes","buenas noches","buenos dias","que tal","como estas","como te llamas"],
        responses:[
            "¡Hola! Soy IgorBot, el asistente de IgorHall 👾 Puedo orientarte sobre los módulos de aprendizaje, darte recomendaciones según tu nivel, o hablar sobre tecnología y cultura geek. ¿Por dónde empezamos?",
            "¡Hola! ¿Qué tal? Estoy aquí para ayudarte a encontrar tu camino en IgorHall. Tenemos módulos de programación, redes, bases de datos, videojuegos y más. ¿Qué te apetece explorar?",
            "¡Buenas! Soy IgorBot 🤖 ¿Primera vez por aquí o ya conoces el hall? Cuéntame qué buscas y te oriento."
        ]
    },
    {
        id:"goodbye",
        triggers:["adios","hasta luego","bye","chao","nos vemos","hasta pronto","me voy","hasta otra"],
        responses:[
            "¡Hasta pronto! Cuando quieras seguir aprendiendo, aquí estaré 👋",
            "¡Nos vemos! Recuerda: cada línea de código que escribes hoy es una habilidad que te queda para siempre. 🚀",
            "¡Cuídate! Y si en algún momento te quedas atascado con algún concepto, ya sabes dónde encontrarme 👾"
        ]
    },
    {
        id:"thanks",
        triggers:["gracias","thank","perfecto","genial","guay","mola","eres lo mejor","muy bien","excelente","estupendo","crack","bien"],
        responses:[
            "¡De nada! Es para lo que estoy aquí 😄 ¿Algo más en lo que pueda ayudarte?",
            "¡Me alegra haberte ayudado! Si tienes más dudas sobre cualquier módulo, pregunta sin miedo 🎮",
            "¡A ti! Recuerda que el botón 'I' de arriba tiene el detalle completo de todos los módulos si quieres profundizar más 📚"
        ]
    },
    {
        id:"who_am_i",
        triggers:["quien eres","que eres","eres bot","eres ia","como funciona","te llamas","que sabes","que puedes"],
        responses:[
            "Soy IgorBot, el asistente de IgorHall. Conozco todos los módulos de la plataforma: HTML, CSS, JavaScript, Hardware, Redes, Server, SQL, Excel, Unity, Ciberseguridad, Linux, Python y React. También me van los videojuegos, el cine y los cómics. Pregúntame lo que quieras 🤖",
            "Soy el asistente virtual de Igor Hermoso. Puedo orientarte sobre el contenido de los módulos, darte una ruta de aprendizaje personalizada, o simplemente charlar sobre tecnología y cultura geek. ¡Soy todo tuyo!"
        ]
    },
    {
        id:"about_igorhall",
        triggers:["que es igorhall","igor hermoso","creador","autor","de quien","que es esto","que es la web","plataforma","igorhall"],
        responses:[
            "IgorHall es la plataforma de aprendizaje creada por Igor Hermoso: un espacio con estética retro arcade para aprender informática, programación, redes y más. Todo alojado en GitHub Pages, gratuito y de acceso libre.",
            "Este hall fue construido por Igor Hermoso como una plataforma educativa accesible y visualmente potente. Tiene 13 módulos de tecnología, una zona de juego con APALACHES, easter eggs ocultos y yo, IgorBot, para orientarte. ¡Bienvenido!"
        ]
    },

    // ── ORIENTACIÓN Y RUTA ────────────────────────────────────────────────────
    {
        id:"guidance",
        triggers:["no se por donde empezar","no se que estudiar","que me recomiendas","por donde empiezo","que elijo","que hago","orienta","ayudame","perdido","no tengo idea","consejo","consejos","recomendacion","guia","como empiezo","que deberia","mejor lenguaje","cual aprendo","cual elijo","diferencia entre","que diferencia","que es mejor","cual es mejor"],
        responses:[
            "Todo depende de tu objetivo 🎯 Dime más: ¿quieres crear páginas web, administrar servidores, trabajar con datos, o hacer videojuegos? Con eso te trazo una ruta personalizada.",
            "¡Buena pregunta! Antes de recomendarte nada, cuéntame: ¿tienes algún conocimiento previo de programación o partes desde cero? Y, ¿qué te llama más la atención: el diseño web, la parte de redes y sistemas, o algo como videojuegos o bases de datos?"
        ]
    },
    {
        id:"beginner",
        triggers:["soy principiante","nunca he programado","no se nada","cero","desde cero","sin experiencia","para empezar","primer paso","nuevo","novato","nunca he tocado","quiero aprender a programar","quiero programar","aprender programacion","como programo"],
        responses:[
            "¡Perfecto punto de partida! Si vas desde cero, la ruta ideal es: 1️⃣ HTML & CSS (ves resultados visuales de forma inmediata, muy motivador) → 2️⃣ JavaScript (aquí empieza la magia de la programación) → 3️⃣ Elige tu camino según lo que más te haya gustado. Empieza por IGORCADEMIA, está pensado exactamente para ti.",
            "Empezar desde cero es la mejor situación porque no tienes que desaprender nada malo 😄 Te recomiendo: HTML & CSS primero (construyes páginas reales rápido), luego JavaScript para añadir lógica. Son los módulos más visuales y los que dan más satisfacción al principio."
        ]
    },
    {
        id:"career",
        triggers:["trabajo","empleo","salida laboral","me dedique","ganar dinero","profesion","ofertas","sueldo","demanda","mercado laboral","busco trabajo","insercion","dedicarme informatica","trabajar informatica","salidas informatica","dedicarme programacion","que puedo trabajar","donde trabajo"],
        responses:[
            "Las salidas con más demanda ahora mismo son: Frontend Developer (HTML+CSS+JS+React) 💻, SysAdmin/DevOps (Server+Linux+Redes) 🖥️, Data Engineer (SQL+Python) 📊, Unity Developer 🎮 y Analista de Ciberseguridad 🔒. Todos cubiertos en IgorHall. ¿Cuál te llama más?",
            "Muy buena pregunta desde el punto de vista profesional. En 2025/2026, las tecnologías más demandadas son JavaScript/React para front, Python para datos e IA, y Linux/Server para infraestructura. ¿Tienes alguna de estas en el radar?"
        ]
    },
    {
        id:"learning_time",
        triggers:["cuanto tiempo","cuanto tarda","cuando acabo","meses","semanas","duracion","tiempo","rapido","cuanto dura"],
        responses:[
            "Depende mucho de tu dedicación, pero con 1-2 horas diarias: HTML & CSS → 4-6 semanas para manejarte bien. JavaScript básico → 2-3 meses. SQL o Redes → 6-8 semanas. Unity básico → 3-4 meses. Lo importante no es la velocidad, sino la constancia.",
            "No hay un tiempo fijo, pero una referencia realista: si dedicas 1h al día, en 6 meses puedes tener una base sólida en frontend (HTML+CSS+JS). Lo que sí es seguro: IgorHall tiene los ejercicios ordenados para que cada día notes progreso."
        ]
    },
    {
        id:"price",
        triggers:["gratis","cuesta","precio","pago","de pago","gratuito","cuanto vale","free","licencia","suscripcion"],
        responses:[
            "Todo en IgorHall es completamente gratuito y de acceso libre 🎉 No hay registro obligatorio, ni suscripciones, ni contenido de pago. Solo necesitas el enlace.",
            "¡100% gratuito! Igor Hermoso ha construido toda esta plataforma en GitHub Pages para que cualquiera pueda aprender sin barreras económicas. Sin anuncios, sin muros de pago."
        ]
    },
    {
        id:"route",
        triggers:["ruta","itinerario","orden","secuencia","camino","roadmap","mapa","hoja de ruta","progresion"],
        responses:[
            "La ruta recomendada de IgorHall: 1→ HTML & CSS · 2→ JavaScript · 3→ Hardware · 4→ Redes · 5→ Server · 6→ Linux · 7→ Python · 8→ SQL · 9→ Ciberseguridad · 10→ React · 11→ Unity · 12→ IA. Pero es flexible: si ya sabes programar, puedes saltar directamente a SQL, Unity o Ciberseguridad.",
            "No hay una ruta única, pero la más lógica si partes de cero: primero tecnologías del lado del cliente (HTML→JS), luego del servidor (Server+Linux), luego datos (SQL+Python), luego especialización (React, Unity, IA). El panel 'I' tiene el detalle de cada módulo."
        ]
    },
    {
        id:"difficulty",
        triggers:["es dificil","complicado","cuesta mucho","no entiendo","me pierdo","dificil","complejo","me rindo","frustracion","bloqueo","atascado","no puedo","no me sale"],
        responses:[
            "Atascarse es completamente normal, es parte del proceso 💪 Lo que funciona es reducir el problema al mínimo: si no entiendes una parte, intenta reproducir solo eso en un ejemplo pequeño. ¿En qué módulo o concepto concreto te estás quedando bloqueado?",
            "El 'no entiendo nada' es una fase por la que pasa todo el mundo. El truco está en no tratar de entenderlo todo de golpe: un concepto cada vez, con práctica inmediata. ¿Qué es lo que te está dando más guerra ahora mismo?"
        ]
    },
    {
        id:"what_modules",
        triggers:["que hay","que tiene","que modulos","cuantos modulos","que se aprende","contenido","que ofrece","que puedo","que teneis","que encontrare","que incluye"],
        responses:[
            "IgorHall tiene 13 módulos: 🟣 HTML & CSS · 🟡 JavaScript · 🟤 Hardware · 🔵 Redes · 🟣 Server · 🟢 Ciberseguridad (próx.) · 🔴 SQL · 🟢 Excel (próx.) · 🟢 Unity (próx.) · 🩷 IA (próx.) · ⚪ Linux (próx.) · 🔵 Python (próx.) · 🩵 React (próx.). Pulsa el botón 'I' para el detalle de cada uno.",
            "Desde tecnología web hasta videojuegos, pasando por redes y bases de datos. El hall cubre: HTML+CSS, JavaScript, Hardware, Redes, Server, SQL — todos activos. Y en breve: Ciberseguridad, Excel, Unity, IA, Linux, Python y React. Además de APALACHES, el juego de Igor 🎮"
        ]
    },

    // ── MÓDULOS ACTIVOS ───────────────────────────────────────────────────────
    {
        id:"mod_html",
        triggers:["html","css","html css","igorcademia","diseño web","diseño web","maquetacion","paginas web","webs","crear pagina","aprender html","aprender css","frontend","web"],
        responses:[
            "IGORCADEMIA es el módulo de HTML & CSS: 70+ ejercicios en 17 módulos con editores en vivo, IgorPoints, logros y una ruta completa para construir páginas reales. Cubre desde la estructura básica hasta Flexbox, Grid, animaciones y responsive design. 👉 igorhermoso1.github.io/IGORCADEMIA",
            "HTML & CSS es el mejor punto de entrada al mundo web. En IGORCADEMIA aprenderás estructura semántica, selectores, box model, Flexbox, CSS Grid, media queries, variables CSS y efectos visuales avanzados. Todo con ejercicios interactivos y feedback inmediato."
        ]
    },
    {
        id:"mod_js",
        triggers:["javascript","igorscript","js","programacion web","aprender javascript","aprender js","dom","eventos","fetch","async","api","arrays","objetos","funciones"],
        responses:[
            "IGORSCRIPT tiene 124 ejercicios en 12 módulos. Empiezas con variables y tipos, pasas por DOM, eventos y lógica, y terminas conectando con APIs reales como PokéAPI y SuperHero API. Es el módulo más completo para aprender a programar en el navegador. 👉 igorhermoso1.github.io/IGORSCRIPT",
            "JavaScript es el lenguaje del navegador. En IGORSCRIPT lo aprenderás de forma progresiva: variables, funciones, arrays, objetos, DOM, eventos, asincronía con fetch/async-await y proyectos reales con APIs externas. 124 ejercicios que escalan en dificultad."
        ]
    },
    {
        id:"mod_hardware",
        triggers:["hardware","igorhardware","componentes","montar pc","cpu","gpu","ram","ssd","placa base","procesador","ordenador","pc","piezas","ensamblar"],
        responses:[
            "IGORHARDWARE te enseña a entender y montar un PC desde cero: CPU, RAM, GPU, almacenamiento, placa base, PSU y refrigeración. Incluye un simulador PC Builder, diagnóstico de averías y un laboratorio con las tendencias de 2026. 👉 igorhermoso1.github.io/IGORHARDWARE",
            "En Hardware aprenderás a elegir componentes compatibles, montar un PC paso a paso, entender la BIOS/UEFI, diagnosticar averías (pantallas azules, no arranca, sobrecalentamiento) y usar el simulador PC Builder para prácticar presupuestos reales."
        ]
    },
    {
        id:"mod_redes",
        triggers:["redes","igorredes","networking","red","tcp","ip","subnetting","vlan","router","switch","wifi","cisco","dhcp","dns","osi","protocolo"],
        responses:[
            "IGORREDES gamifica el networking: TCP/IP, subnetting con calculadora visual, WiFi, VLANs, routing, switching. Incluye un simulador de red drag-and-drop, editor de planos de instalación y configurador CLI tipo Cisco IOS. 👉 igorhermoso1.github.io/IGORREDES",
            "En Redes aprenderás desde el modelo OSI hasta subnetting con CIDR, configuración de VLANs, routing estático y dinámico (OSPF), WiFi 6 y seguridad WPA3. El simulador interactivo te permite arrastrar equipos, conectarlos y hacer ping sin hardware real."
        ]
    },
    {
        id:"mod_server",
        triggers:["server","igorserver","servidor","windows server","active directory","powershell","administracion","sysadmin","gpo","raid","backup","virtualbox","nagios","linux server"],
        responses:[
            "IGORSERVER cubre administración de sistemas Windows: Active Directory, DNS, DHCP, GPOs, VirtualBox para laboratorios virtuales, RAID, backups con Acronis y monitorización con Nagios. También Ubuntu Server con Samba. 👉 igorhermoso1.github.io/IGORSERVER",
            "En Server aprenderás a montar un dominio completo con Windows Server: crear el Active Directory, gestionar usuarios y OUs, configurar DNS y DHCP, aplicar GPOs, hacer backups profesionales y monitorizar servidores con Nagios. Todo en laboratorios virtuales con VirtualBox."
        ]
    },
    {
        id:"mod_sql",
        triggers:["sql","base de datos","bases de datos","sqlite","igorsql","consulta","select","join","tabla","registro","dato","dato","normalizar","relacional"],
        responses:[
            "IGOR SQL Academy usa SQLite con una consola SQL real integrada en el navegador. Aprenderás modelo relacional, DDL/DML, SELECT avanzado, JOINs, subconsultas, normalización y trabajarás con bases de datos temáticas de Pokémon, Marvel, hospital y streaming. 👉 igorhermoso1.github.io/IGORSQL",
            "En SQL empiezas por la teoría de bases de datos relacionales y acabas escribiendo consultas complejas con JOINs y subconsultas. La clave de IGORSQL es la práctica con BDs temáticas (¡Pokémon incluido!) y la consola SQL directamente en el navegador."
        ]
    },

    // ── MÓDULOS PRÓXIMAMENTE ──────────────────────────────────────────────────
    {
        id:"mod_cyber",
        triggers:["ciberseguridad","seguridad informatica","hacking etico","pentest","seguridad","ciber","vulnerabilidad","firewall","phishing","malware","virus","ataque","hacker","ransomware","ciberataque","contraseña segura","cifrado","intrusion","mfa","2fa"],
        responses:[
            "🔜 Ciberseguridad está en construcción pero llegará pronto. Tendrá enfoque defensivo: tríada CIA, higiene digital, firewall, hardening, ingeniería social (phishing, smishing), análisis de riesgos y respuesta a incidentes. Todo dentro del marco ético y legal.",
            "🔜 El módulo de Ciberseguridad de IgorHall se centrará en la defensa, no en el ataque: entender vulnerabilidades para protegerse, configurar firewalls, detectar phishing, gestionar contraseñas correctamente y responder ante incidentes. Próximamente disponible."
        ]
    },
    {
        id:"mod_excel",
        triggers:["excel","hoja de calculo","spreadsheet","formula","buscarv","buscarx","tabla dinamica","power query","vba","macro","office","libreoffice"],
        responses:[
            "🔜 Excel llegará pronto a IgorHall. Cubrirá desde fórmulas básicas hasta las potentes BUSCARX e INDICE+COINCIDIR, tablas dinámicas con segmentadores, Power Query para ETL sin código, gráficos y dashboards, y automatización con macros VBA.",
            "🔜 El módulo de Excel está en desarrollo. Será una ruta completa: referencias relativas y absolutas, funciones de búsqueda avanzadas (BUSCARX, INDICE+COINCIDIR), tablas dinámicas, Power Query y macros VBA. La herramienta ofimática más demandada en empresas."
        ]
    },
    {
        id:"mod_unity",
        triggers:["unity","igorunity","videojuego","videojuegos","desarrollar juego","crear juego","gameobject","prefab","csharp unity","monobehaviour","rigidbody","navmesh","vr"],
        responses:[
            "🔜 Unity (próximamente activo en el hall) tiene una hoja de ruta de 82 temas en 7 niveles, 91 assets y más de 10 vídeos. Del editor y C# básico hasta sistemas de combate, IA de enemigos con NavMesh, multiplayer y realidad virtual.",
            "🔜 El módulo de Unity cubre todo el camino del desarrollador de videojuegos: editor, GameObjects, C# scripting, física, UI, animaciones, NavMesh para IA de enemigos, Shader Graph, multiplayer con Netcode y VR con OpenXR. Una ruta brutalmente completa."
        ]
    },
    {
        id:"mod_ia",
        triggers:["inteligencia artificial","ia","llm","chatgpt","claude","gemini","prompt","modelo lenguaje","machine learning","gpt","openai"],
        responses:[
            "🔜 El módulo de IA de IgorHall está en construcción. Se centrará en el uso práctico: cómo funcionan los LLMs, prompt engineering, automatización con APIs de IA (OpenAI, Anthropic), herramientas no-code como n8n/Zapier y proyectos aplicados.",
            "🔜 IA (próximamente). Aprenderás a usar y construir con IA de forma práctica: desde escribir prompts efectivos con chain-of-thought hasta automatizar flujos con APIs. Sin matemáticas complejas, enfocado en aplicaciones reales y uso responsable."
        ]
    },
    {
        id:"mod_linux",
        triggers:["linux","ubuntu","debian","fedora","arch","terminal","bash","comandos","chmod","sudo","apt","permisos","scripting bash","shell"],
        responses:[
            "🔜 Linux llegará pronto a IgorHall. Cubrirá terminal desde cero, comandos básicos y avanzados, permisos y usuarios, gestión de paquetes, procesos con systemctl, red en Linux (ssh, scp, UFW) y Bash scripting para automatización.",
            "🔜 El módulo de Linux es esencial para servidores y DevOps. Cubrirá: navegación por la terminal, permisos chmod/chown, gestión de paquetes con apt/dnf/pacman, scripting con Bash y crontab, y administración avanzada con logs y hardening."
        ]
    },
    {
        id:"mod_python",
        triggers:["python","pip","script","scripting","pandas","flask","fastapi","django","automatizacion","datos","api python"],
        responses:[
            "🔜 Python llegará a IgorHall con un enfoque muy práctico: desde la sintaxis básica hasta proyectos reales de automatización, análisis de datos con pandas y matplotlib, y APIs REST con Flask o FastAPI. El lenguaje más versátil del mercado.",
            "🔜 El módulo de Python cubrirá: fundamentos (tipos, funciones, clases), estructuras de datos, POO, módulos de la librería estándar, librerías populares (pandas, requests, BeautifulSoup) y backend con Flask/FastAPI. Python abre las puertas a datos, web y automatización."
        ]
    },
    {
        id:"mod_react",
        triggers:["react","reactjs","jsx","componente","useState","useEffect","hooks","vite","frontend moderno","libreria ui","spa"],
        responses:[
            "🔜 React (próximamente). Aprenderás componentes funcionales, props, estado con useState, efectos con useEffect, Context API para estado global, React Router para rutas y consumo de APIs. El estándar de facto para interfaces web modernas.",
            "🔜 El módulo de React te llevará del JSX básico hasta proyectos completos: hooks fundamentales (useState, useEffect, useContext), React Router v6, integración con APIs REST, gestión de estado con Zustand y despliegue en Vercel. La librería más demandada en el mercado."
        ]
    },

    // ── CULTURA GEEK ──────────────────────────────────────────────────────────
    {
        id:"pop_onepiece",
        triggers:["one piece","luffy","zoro","sanji","nami","nakama","oda","grand line","sombrero paja","pirata","manga","anime"],
        responses:[
            "¡NAKAMA! One Piece es sin duda una de las obras más épicas del manga. Oda lleva décadas construyendo un mundo increíble y la saga final está siendo brutal 🏴‍☠️ Psst: escribe 'nakama' en el teclado para una sorpresa.",
            "La saga de Egghead está siendo una locura de nivel. Y el lore del Void Century... Oda es un genio. ¿Cuál es tu arco favorito? Y si no lo sabías, escribe 'luffy' en el teclado aquí en el hall 🏴‍☠️"
        ]
    },
    {
        id:"pop_dragonage",
        triggers:["dragon age","dragonage","darkspawn","inquisition","solas","thedas","bioware","grey warden","veilguard"],
        responses:[
            "Dragon Age: el lore de Thedas es de los más ricos de los RPGs de rol occidental. Solas como villain es magistral. ¿Veilguard te convenció o te quedó corto? Escribe 'darkspawn' en el teclado para un easter egg especial 🐉",
            "¡Gran gusto! La historia de los Grey Wardens, los misterios del Fade y el giro de Solas en Inquisition son de los mejores momentos en la narrativa de videojuegos. Escribe 'inquisition' en el teclado 🐉"
        ]
    },
    {
        id:"pop_baldur",
        triggers:["baldur gate","baldurs gate","bg3","larian","dnd","dungeons dragons","faerun","shadowheart","astarion","gale"],
        responses:[
            "BG3 redefinió lo que puede ser un RPG en la era moderna. Larian Studios entregó algo que parecía imposible: 174 horas de contenido con consecuencias reales en cada decisión. ¿Cuántas partidas llevas? Escribe 'baldur' en el teclado 🎲",
            "¡Un crítico! BG3 ha vuelto a poner los RPGs por turnos en el mapa. Shadowheart, Astarion, Gale... los personajes son brutales. Escribe 'dice' en el teclado para una sorpresa 🎲"
        ]
    },
    {
        id:"pop_reddead",
        triggers:["red dead","reddead","arthur morgan","dutch","john marston","rockstar","rdr2","vaquero","oeste"],
        responses:[
            "RDR2 es posiblemente el videojuego con la narrativa más redonda jamás creada. La historia de Arthur Morgan consigue lo que pocas veces logra un juego: emocionarte de verdad. 'I gave you all I had.' Escribe 'arthur' 🤠",
            "Rockstar tardó años pero entregó una obra maestra. La forma en que Dutch se desintegra como personaje a lo largo del juego... es magistral. Escribe 'reddead' en el teclado para un homenaje 🤠"
        ]
    },
    {
        id:"pop_fallout",
        triggers:["fallout","vault","wasteland","new vegas","bethesda","brotherhood steel","nuka cola","ghoul"],
        responses:[
            "War. War never changes. New Vegas sigue siendo el pináculo de la saga para muchos fans. La libertad de decisiones y el mundo moralmente complejo... Escribe 'vault' en el teclado, o haz 3 clicks en el reloj ☢️",
            "La serie de Amazon Prime le dio una inyección de visibilidad brutal a Fallout. Pero nada como New Vegas para los fans de la vieja guardia. ¿Cuál es tu favorito? Escribe 'fallout' para un easter egg ☢️"
        ]
    },
    {
        id:"pop_metalgear",
        triggers:["metal gear","metalgear","snake","solid snake","big boss","otacon","codec","hideo kojima","mgs","phantom pain"],
        responses:[
            "Kept you waiting, huh? Metal Gear Solid es una saga única: acción de sigilo mezclada con filosofía, política y narrativa rompedora. El codec de MGS1 es icónico. Escribe 'snake' en el teclado 📦",
            "Hideo Kojima es un autor, no solo un developer. MGS2 predijo las fake news y las cámaras de eco en 2001. Una obra adelantada a su tiempo. Escribe 'otacon' en el teclado para un easter egg 📦"
        ]
    },
    {
        id:"pop_witcher",
        triggers:["witcher","geralt","ciri","yennefer","cd projekt","wild hunt","gwent","brujo"],
        responses:[
            "The Witcher 3 sigue siendo un referente absoluto del mundo abierto narrativo. 'Wind's howling.' Y la expansión Blood and Wine es casi perfecta como cierre. Escribe 'geralt' en el teclado ⚔️",
            "El mundo de Sapkowski hecho juego. El dilema entre Ciri Emperatriz vs Ciri Bruja sigue siendo uno de los finales más discutidos de los videojuegos. Escribe 'rivia' en el teclado ⚔️"
        ]
    },
    {
        id:"pop_elden",
        triggers:["elden ring","dark souls","fromsoftware","miyazaki","bloodborne","sekiro","souls","boss","erdtree"],
        responses:[
            "Elden Ring es arte. La colaboración Miyazaki + GRRM resultó en el mundo abierto más denso en lore que se haya creado. ¿Has llegado a Malenia? APALACHES también tiene su nivel de dificultad... 😏",
            "FromSoftware tiene una capacidad única para crear satisfacción a través de la dificultad. Cada boss derrotado se siente como un logro real. ¿Bloodborne o Elden Ring? El debate eterno."
        ]
    },
    {
        id:"pop_batman",
        triggers:["batman","bruce wayne","joker","gotham","dark knight","dc","arkham","nolan"],
        responses:[
            "I am Batman 🦇 La trilogía de Nolan redefinió el cine de superhéroes. El Joker de Heath Ledger es uno de los mejores villanos de la historia del cine. Escribe 'joker' en el teclado para un easter egg.",
            "DC tiene algunos de los mejores villanos del cómic: Joker, Lex Luthor, Deathstroke... Y la saga Arkham de Rocksteady sigue siendo el estándar de los juegos de superhéroes. Escribe 'batman' en el teclado 🦇"
        ]
    },
    {
        id:"pop_starwars",
        triggers:["star wars","starwars","jedi","sith","yoda","vader","luke","anakin","fuerza","lightsaber","mandalorian","andor"],
        responses:[
            "May the Force be with you ⭐ Star Wars es un universo sin límites. Andor es probablemente la mejor historia de Star Wars desde El Imperio Contraataca. ¿Qué era de la saga te gusta más? Escribe 'yoda' en el teclado.",
            "El debate entre trilogías de Star Wars podría durar años 😄 Pero lo que sí es indiscutible: Andor como serie es brillante. Escribe 'jedi' en el teclado para una sorpresa ⭐"
        ]
    },
    {
        id:"pop_pokemon",
        triggers:["pokemon","pikachu","ash","charizard","gengar","mewtwo","pokedex","gameboy","nintendods"],
        responses:[
            "¡Gotta catch 'em all! Pokémon es la franquicia de mayor éxito comercial de la historia. Y en IGORSCRIPT hay un proyecto real donde conectas con la PokéAPI para mostrar Pokémon con sus stats. Escribe 'pikachu' en el teclado ⚡",
            "Mewtwo, Charizard, Gengar... cada generación tiene sus iconos. ¿Eres de la primera gen o de las más modernas? Escribe 'charizard' aquí en el hall para un easter egg ⚡"
        ]
    },
    {
        id:"pop_matrix",
        triggers:["matrix","neo","morfeo","morpheus","trinity","pastilla roja","red pill","blue pill","spoon","cucharilla"],
        responses:[
            "There is no spoon 💊 The Matrix (1999) es una de esas películas que te cambia la perspectiva. Y su influencia en la cultura digital y la filosofía ha sido enorme. Escribe 'redpill' en el teclado para un easter egg.",
            "La Matrix tiene como mérito haber popularizado conceptos filosóficos complejos (simulación, libre albedrío) en un blockbuster de acción. 25 años después sigue siendo relevante. Escribe 'matrix' en el teclado 💊"
        ]
    },
    {
        id:"pop_marvel",
        triggers:["marvel","comics","xmen","avengers","spider man","wolverine","ironman","thor","panini","comic"],
        responses:[
            "¡Marvel! En España Panini trae las mejores colecciones. Los cómics de la era de Jonathan Hickman (House of X, Powers of X) son de los mejores de los últimos años. Y en IGORSCRIPT hay un proyecto con la SuperHero API donde puedes buscar héroes en tiempo real 🦸",
            "El universo Marvel en cómics tiene capas que el MCU nunca ha llegado a explorar. Desde la Casa de las Ideas hasta los eventos más épicos como Hickman's Avengers. ¿Eres más de X-Men o de Avengers?"
        ]
    },
    {
        id:"pop_gaming",
        triggers:["videojuego","videojuegos","gaming","juego","juegos","steam","gamer","ps5","xbox","nintendo switch"],
        responses:[
            "¡Me encantan los videojuegos! El hall tiene su propia zona arcade con APALACHES 🎮 Si te interesa el mundo del desarrollo de videojuegos, el módulo de Unity tiene una hoja de ruta brutalmente completa.",
            "Los videojuegos son el arte más completo: combinan narrativa, música, diseño visual e interactividad. Y en IgorHall tienes un módulo de Unity para aprender a crearlos. ¿Qué tipo de juegos son los que más te van?"
        ]
    },
    {
        id:"pop_movies",
        triggers:["pelicula","cine","movie","film","estreno","cartelera","netflix","disney","hbo","serie","series","tv"],
        responses:[
            "El cine y las series son otra pasión de IgorHall 🎬 Mi conocimiento llega hasta agosto de 2025, así que para estrenos recientes busca en Filmaffinity o JustWatch. ¿Qué tipo de cine te va más? ¿Ciencia ficción, terror, acción...?",
            "Para estrenos actuales no soy el más actualizado (mi conocimiento tiene fecha de corte), pero para recomendaciones clásicas o discutir sobre ciencia ficción y fantasía, ¡pregunta sin miedo! 🎬"
        ]
    },

    // ── EASTER EGGS EN CHAT ───────────────────────────────────────────────────
    {
        id:"easteregg_hint",
        triggers:["easter egg","secreto","secretos","oculto","ocultos","huevo","pista","pistas","como desbloquear","que secretos","hay secretos"],
        responses:[
            "¡El hall tiene 14 easter eggs ocultos! 🥚 Para encontrarlos, pulsa la card 'EASTER EGGS' en la zona de ocio. Cada uno tiene una pista. Algunos se activan escribiendo palabras clave en el teclado, otros con clicks en elementos específicos... ¿Cuál quieres desbloquear primero?",
            "Los easter eggs se desbloquean de varias formas: escribiendo palabras clave (nombres de personajes de juegos, películas...) directamente en el teclado, haciendo clicks especiales en elementos de la página, o con el código Konami legendario. ¡Explora el hall!"
        ]
    },

    // ── FALLBACK INTELIGENTE ──────────────────────────────────────────────────
    {
        id:"fallback",
        triggers:[], // Se activa cuando no hay match
        responses:[
            "Interesante pregunta 🤔 No estoy seguro de tener una respuesta concreta para eso. Puedo ayudarte mejor si me preguntas por: algún módulo concreto (HTML, JavaScript, SQL, Unity...), orientación sobre por dónde empezar, o simplemente charlar sobre tecnología y cultura geek.",
            "Hmm, no encuentro exactamente eso en mi base de conocimiento. Pero dime: ¿estás buscando información sobre algún módulo de IgorHall, o quieres orientación sobre qué aprender primero? Con eso te puedo ayudar bien 😊",
            "No he pillado exactamente lo que buscas. ¿Puedes reformularlo? O si prefieres, cuéntame qué quieres conseguir (aprender a programar, trabajar en tecnología, crear un videojuego...) y te oriento yo."
        ]
    }
];

// Motor NLP: tokeniza la pregunta y la compara con los triggers de cada intención
function findIntent(userText){
    const tokens = nlpProcess(userText);
    const userFull = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

    let bestIntent = null;
    let bestScore  = 0;

    for(const intent of INTENTS){
        if(intent.id === "fallback") continue;
        let score = 0;

        for(const trigger of intent.triggers){
            const trigTokens = trigger.split(" ");
            // Coincidencia de frase completa con límites de palabra (evita "hi" en "phishing")
            const trigEsc = trigger.replace(/[-\/\^$*+?.()|[\]{}]/g,"\$&");
            const fullRx = new RegExp("(?:^|\\s|[^a-z])" + trigEsc + "(?:$|\\s|[^a-z])", "i");
            if(fullRx.test(userFull)){
                score += trigTokens.length * 3;
                continue;
            }
            // Coincidencia por tokens individuales (exacta o substring largo)
            for(const tt of trigTokens){
                if(tokens.some(ut => ut === tt || (tt.length > 6 && ut.length > 6 && (ut.includes(tt) || tt.includes(ut))))) score += 1;
            }
        }

        if(score > bestScore){ bestScore = score; bestIntent = intent; }
    }

    return bestScore > 0 ? bestIntent : INTENTS.find(i=>i.id==="fallback");
}

// Rotar respuestas para que no repita siempre la misma
const intentResponseIdx = {};
function getResponse(intent){
    const responses = intent.responses;
    const idx = intentResponseIdx[intent.id] || 0;
    intentResponseIdx[intent.id] = (idx + 1) % responses.length;
    return responses[idx];
}

// Contexto de conversación: recordar el último módulo mencionado
function updateContext(intent){
    const modIds = ["mod_html","mod_js","mod_hardware","mod_redes","mod_server","mod_sql","mod_cyber","mod_excel","mod_unity","mod_ia","mod_linux","mod_python","mod_react"];
    if(modIds.includes(intent.id)) botContext = intent.id;
}

// ============================
// LISTENER DEL CHAT
// ============================
if(assistantForm){
    assistantForm.addEventListener("submit", e => {
        e.preventDefault();
        const userText = assistantInput.value.trim();
        if(!userText) return;
        addMsg(userText, "user");
        assistantInput.value = "";

        setTimeout(() => {
            const intent = findIntent(userText);
            updateContext(intent);
            const response = getResponse(intent);
            setMode("talk", 2200);
            addMsg(response);
        }, 250);
    });
}
