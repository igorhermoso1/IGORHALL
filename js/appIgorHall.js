// appIgorHall.js — IgorHall v1.4

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
    card.addEventListener("mouseleave",()=>{
        card.style.background="";
    });
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
const eggModal      = document.getElementById("eggModal");
const openEggBtn    = document.getElementById("openEggModal");
const closeEggBtn   = document.getElementById("closeEggModal");
const eggModalBg    = document.getElementById("eggModalBackdrop");

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
if(openEggBtn)   openEggBtn.addEventListener("click", openEggModal);
if(closeEggBtn)  closeEggBtn.addEventListener("click", closeEggModal);
if(eggModalBg)   eggModalBg.addEventListener("click", closeEggModal);

document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
        closeInfoModal();
        closeEggModal();
        closeProfilePanel();
        document.querySelectorAll(".easter-overlay.active").forEach(o=>closeEgg(o));
    }
});

// ============================
// EASTER EGG TRACKER
// ============================
const EGG_IDS=["konami","dragonage","baldur","reddead","fallout","metalgear","witcher","onepiece","batman","starwars","padrino","pokemon","pacman","matrix"];
const EGG_TOTAL=14;

function getUnlockedEggs(){
    try{ return JSON.parse(localStorage.getItem("igorhall_eggs")||"[]"); }catch(e){ return []; }
}
function markEggUnlocked(id){
    const u=getUnlockedEggs();
    if(!u.includes(id)){ u.push(id); try{ localStorage.setItem("igorhall_eggs",JSON.stringify(u)); }catch(e){} }
    refreshEggIndex();
}
function refreshEggIndex(){
    const u=getUnlockedEggs();
    const n=u.length;
    // Modal count + progress
    const mc=document.getElementById("eggModalCount");
    const pf=document.getElementById("eggProgressFill");
    if(mc) mc.textContent=n;
    if(pf) pf.style.width=(n/EGG_TOTAL*100)+"%";
    // Card counter
    const cc=document.getElementById("eggCardCount");
    if(cc) cc.textContent=n+" / "+EGG_TOTAL+" desbloqueados";
    // List items
    document.querySelectorAll(".egg-item").forEach(item=>{
        const id=item.dataset.eggId;
        if(id && u.includes(id)){
            item.classList.remove("locked");
            item.classList.add("unlocked");
        }
    });
}

// ============================
// EASTER EGG OVERLAYS
// ============================
const EGG_ID_MAP={
    "konamiFlash":"konami","eggDragonAge":"dragonage","eggBaldur":"baldur",
    "eggRedDead":"reddead","eggFallout":"fallout","eggMetalGear":"metalgear",
    "eggWitcher":"witcher","eggOnePiece":"onepiece",
    "eggBatman":"batman","eggStarWars":"starwars","eggPadrino":"padrino",
    "eggPokemon":"pokemon","eggPacman":"pacman","eggMatrix":"matrix"
};

function showEgg(id, duration=4500){
    const el=document.getElementById(id);
    if(!el) return;
    document.querySelectorAll(".easter-overlay.active").forEach(o=>closeEgg(o));
    el.classList.add("active");
    el.setAttribute("aria-hidden","false");
    if(!el.querySelector(".egg-dismiss")){
        const d=document.createElement("span");
        d.className="egg-dismiss";
        d.textContent="[ CLICK O ESC PARA CERRAR ]";
        el.querySelector(".egg-content")?.appendChild(d);
    }
    const t=setTimeout(()=>closeEgg(el),duration);
    el.dataset.timer=t;
    el.addEventListener("click",()=>closeEgg(el),{once:true});
    if(EGG_ID_MAP[id]) markEggUnlocked(EGG_ID_MAP[id]);
}
function closeEgg(el){
    el.classList.remove("active");
    el.setAttribute("aria-hidden","true");
    clearTimeout(Number(el.dataset.timer));
}

// ============================
// SISTEMA COMPLETO DE EASTER EGGS
// ============================
(function initEasterEggs(){

    // 1. KONAMI CODE
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

    // 2. ESCRITURA DE PALABRAS CLAVE
    let typed="";
    document.addEventListener("keydown",e=>{
        if(e.key.length!==1) return;
        typed=(typed+e.key.toLowerCase()).slice(-18);
        // Dragon Age
        if(typed.includes("darkspawn")||typed.includes("inquisition")||typed.includes("solas"))
            { typed=""; showEgg("eggDragonAge",5000); }
        // Baldur's Gate
        else if(typed.includes("dice")||typed.includes("baldur")||typed.includes("shadowheart")||typed.includes("laezel"))
            { typed=""; showEgg("eggBaldur",5000); }
        // Red Dead
        else if(typed.includes("arthur")||typed.includes("reddead")||typed.includes("rdrd"))
            { typed=""; showEgg("eggRedDead",5000); }
        // Fallout
        else if(typed.includes("vault")||typed.includes("fallout")||typed.includes("special"))
            { typed=""; showEgg("eggFallout",5000); }
        // Metal Gear
        else if(typed.includes("snake")||typed.includes("bigboss")||typed.includes("codec")||typed.includes("otacon"))
            { typed=""; showEgg("eggMetalGear",5000); }
        // Witcher
        else if(typed.includes("geralt")||typed.includes("rivia")||typed.includes("witcher")||typed.includes("yennefer"))
            { typed=""; showEgg("eggWitcher",5000); }
        // One Piece
        else if(typed.includes("nakama")||typed.includes("luffy")||typed.includes("onepiece")||typed.includes("zoro"))
            { typed=""; showEgg("eggOnePiece",5000); }
        // Baldur's Gate (añadido también aquí)
        else if(typed.includes("baldur")||typed.includes("laezel")||typed.includes("astarion")||typed.includes("gale"))
            { typed=""; showEgg("eggBaldur",5000); }
        // Batman / DC
        else if(typed.includes("batman")||typed.includes("joker")||typed.includes("gotham")||typed.includes("darknight"))
            { typed=""; showEgg("eggBatman",5000); }
        // Star Wars
        else if(typed.includes("jedi")||typed.includes("yoda")||typed.includes("sith")||typed.includes("lightsaber")||typed.includes("starwars"))
            { typed=""; showEgg("eggStarWars",5000); }
        // El Padrino
        else if(typed.includes("corleone")||typed.includes("padrino")||typed.includes("godfather")||typed.includes("mafia"))
            { typed=""; showEgg("eggPadrino",5000); }
        // Pokemon
        else if(typed.includes("pikachu")||typed.includes("pokemon")||typed.includes("charizard")||typed.includes("bulbasaur"))
            { typed=""; showEgg("eggPokemon",5000); }
        // Pac-Man
        else if(typed.includes("pacman")||typed.includes("waka")||typed.includes("blinky")||typed.includes("inky"))
            { typed=""; showEgg("eggPacman",5000); }
        // Matrix
        else if(typed.includes("matrix")||typed.includes("morpheus")||typed.includes("redpill")||typed.includes("bluepill")||typed.includes("neo"))
            { typed=""; showEgg("eggMatrix",5000); }
    });

    // 3. Fallout → 3 clicks en el reloj
    let clkC=0,clkT;
    document.getElementById("clock")?.addEventListener("click",()=>{
        clkC++; clearTimeout(clkT); clkT=setTimeout(()=>clkC=0,1000);
        if(clkC>=3){ clkC=0; showEgg("eggFallout",5000); }
    });

    // 4. Baldur → click en card-number 03 (Hardware)
    document.querySelectorAll(".card-number").forEach(el=>{
        if(el.textContent.trim()==="03"){
            el.style.cursor="pointer";
            el.addEventListener("click",e=>{ e.preventDefault(); e.stopPropagation(); showEgg("eggBaldur",5000); });
        }
    });

    // 5. Dragon Age → hover 3s en el footer
    let footerT;
    document.querySelector(".footer")?.addEventListener("mouseenter",()=>{ footerT=setTimeout(()=>showEgg("eggDragonAge",5000),3000); });
    document.querySelector(".footer")?.addEventListener("mouseleave",()=>clearTimeout(footerT));

})();

// ============================
// PARTÍCULAS
// ============================
(function spawnParticles(){
    const c=document.getElementById("particles");
    if(!c) return;
    const colors=["rgba(127,220,255,0.7)","rgba(255,159,67,0.65)","rgba(255,79,216,0.6)","rgba(139,92,255,0.65)","rgba(71,245,208,0.6)","rgba(109,255,143,0.55)"];
    const n=window.innerWidth<700?18:38;
    for(let i=0;i<n;i++){
        const p=document.createElement("div");
        p.className="particle";
        const size=Math.random()*3+1.5, left=Math.random()*100, delay=Math.random()*18, dur=Math.random()*14+10, col=colors[Math.floor(Math.random()*colors.length)];
        p.style.cssText=`width:${size}px;height:${size}px;left:${left}%;background:${col};box-shadow:0 0 ${size*3}px ${col};animation-duration:${dur}s;animation-delay:${delay}s`;
        c.appendChild(p);
    }
})();

// ============================
// SCROLL PROGRESS
// ============================
(function(){
    const bar=document.createElement("div");
    bar.className="scroll-progress";
    document.body.prepend(bar);
    window.addEventListener("scroll",()=>{
        const max=document.documentElement.scrollHeight-window.innerHeight;
        bar.style.width=(max>0?(window.scrollY/max*100):0)+"%";
    },{passive:true});
})();

// ============================
// CONTADOR DE MÓDULOS
// ============================
(function(){
    const el=document.getElementById("moduleCounter");
    if(!el) return;
    const total=document.querySelectorAll(".menu-container .card").length;
    let cur=0;
    const iv=setInterval(()=>{ cur++; el.textContent=cur+" MÓDULOS"; if(cur>=total) clearInterval(iv); },120);
})();

// ============================
// PERFIL — VERIFICACIÓN
// ============================
const profilePanel   = document.getElementById("profilePanel");
const profileOverlay = document.getElementById("profilePanelOverlay");
const openProfileBtn = document.getElementById("openProfilePanel");
const closeProfileBtn= document.getElementById("closeProfilePanel");
const saveProfileBtn = document.getElementById("saveProfile");
const clearProfileBtn= document.getElementById("clearProfile");
const profileError   = document.getElementById("profileError");
const greetingBadge  = document.getElementById("greetingBadge");

function hashEmail(e){ let h=5381; for(let i=0;i<e.length;i++) h=((h<<5)+h)^e.charCodeAt(i); return (h>>>0).toString(16).padStart(8,"0"); }
function getRegistered(){ try{ return JSON.parse(localStorage.getItem("igorhall_registered")||"{}"); }catch(e){ return {}; } }
function isEmailRegistered(email){ const r=getRegistered(); return !!r[hashEmail(email.toLowerCase().trim())]; }
function registerEmail(email,uid){ const r=getRegistered(); r[hashEmail(email.toLowerCase().trim())]={uid,ts:Date.now()}; try{ localStorage.setItem("igorhall_registered",JSON.stringify(r)); }catch(e){} }
function generateUID(){ return "IGH-"+Math.random().toString(36).substr(2,4).toUpperCase()+"-"+Date.now().toString(36).toUpperCase().slice(-4); }
function generateCode(){ return String(Math.floor(100000+Math.random()*900000)); }

let _pendingCode=null, _pendingData=null;

function openProfilePanel(){
    if(!profilePanel) return;
    profilePanel.classList.add("is-open");
    profileOverlay.classList.add("is-open");
    profilePanel.setAttribute("aria-hidden","false");
    refreshProfileUI();
}
function closeProfilePanel(){
    if(!profilePanel) return;
    profilePanel.classList.remove("is-open");
    profileOverlay.classList.remove("is-open");
    profilePanel.setAttribute("aria-hidden","true");
    const vs=document.getElementById("verifyStep");
    if(vs) vs.classList.remove("is-active");
}
function refreshProfileUI(){
    try{
        const s=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
        const sr=document.getElementById("profileStatusRow");
        const ud=document.getElementById("profileUidDisplay");
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
        const s=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
        if(!s) return;
        const set=(id,v)=>{ const el=document.getElementById(id); if(el&&v) el.value=v; };
        set("profileName",s.name); set("profileEmail",s.email); set("profilePhone",s.phone);
        set("profileLocation",s.location); set("profileSource",s.source); set("profileContact",s.contact);
        if(s.name) showGreeting(s.name);
    }catch(e){}
}

if(openProfileBtn)  openProfileBtn.addEventListener("click",openProfilePanel);
if(closeProfileBtn) closeProfileBtn.addEventListener("click",closeProfilePanel);
if(profileOverlay)  profileOverlay.addEventListener("click",closeProfilePanel);

if(saveProfileBtn){
    saveProfileBtn.addEventListener("click",()=>{
        if(!profileError) return;
        profileError.textContent="";
        const name=(document.getElementById("profileName")?.value||"").trim();
        const email=(document.getElementById("profileEmail")?.value||"").trim();
        const phone=(document.getElementById("profilePhone")?.value||"").trim();
        const location=(document.getElementById("profileLocation")?.value||"").trim();
        const source=document.getElementById("profileSource")?.value||"";
        const contact=(document.getElementById("profileContact")?.value||"").trim();
        if(!name){ profileError.textContent="⚠ El nombre es obligatorio."; document.getElementById("profileName")?.focus(); return; }
        if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ profileError.textContent="⚠ Email no válido."; document.getElementById("profileEmail")?.focus(); return; }
        if(!phone||phone.replace(/\D/g,"").length<9){ profileError.textContent="⚠ Teléfono con al menos 9 dígitos."; document.getElementById("profilePhone")?.focus(); return; }
        const cur=JSON.parse(localStorage.getItem("igorhall_profile")||"null");
        const curEmail=cur?.email?.toLowerCase().trim()||"";
        if(isEmailRegistered(email)&&email.toLowerCase().trim()!==curEmail){ profileError.textContent="⚠ Este email ya está registrado."; document.getElementById("profileEmail")?.focus(); return; }
        if(cur?.verified&&email.toLowerCase().trim()===curEmail){
            const upd={...cur,name,phone,location,source,contact};
            try{ localStorage.setItem("igorhall_profile",JSON.stringify(upd)); }catch(e){}
            showGreeting(name); profileError.style.color="var(--cyan)"; profileError.textContent="✓ Perfil actualizado.";
            setTimeout(()=>{ profileError.textContent=""; profileError.style.color=""; closeProfilePanel(); },1500);
            return;
        }
        _pendingCode=generateCode(); _pendingData={name,email,phone,location,source,contact};
        const cd=document.getElementById("verifyCodeDisplay");
        const vs=document.getElementById("verifyStep");
        const vi=document.getElementById("verifyInput");
        if(cd) cd.textContent=_pendingCode;
        if(vs) vs.classList.add("is-active");
        if(vi){ vi.value=""; vi.focus(); }
        profilePanel.scrollTo({top:profilePanel.scrollHeight,behavior:"smooth"});
    });
}

const verifyConfirmBtn=document.getElementById("verifyConfirmBtn");
const verifyResendBtn =document.getElementById("verifyResendBtn");
const verifyError     =document.getElementById("verifyError");

if(verifyConfirmBtn){
    verifyConfirmBtn.addEventListener("click",()=>{
        if(!verifyError) return;
        const input=(document.getElementById("verifyInput")?.value||"").trim();
        if(input!==_pendingCode){ verifyError.textContent="⚠ Código incorrecto."; document.getElementById("verifyInput")?.focus(); return; }
        const uid=generateUID();
        const profile={..._pendingData,verified:true,uid,ts:Date.now()};
        try{ localStorage.setItem("igorhall_profile",JSON.stringify(profile)); }catch(e){}
        registerEmail(_pendingData.email,uid);
        showGreeting(_pendingData.name);
        _pendingCode=null; _pendingData=null;
        const vs=document.getElementById("verifyStep");
        if(vs) vs.classList.remove("is-active");
        refreshProfileUI();
        if(profileError){ profileError.style.color="var(--cyan)"; profileError.textContent="✓ ¡Cuenta verificada!"; }
        setTimeout(()=>{ if(profileError){ profileError.textContent=""; profileError.style.color=""; } closeProfilePanel(); },1600);
    });
}
document.getElementById("verifyInput")?.addEventListener("input",function(){ this.value=this.value.replace(/\D/g,"").slice(0,6); if(this.value.length===6) verifyConfirmBtn?.click(); });
if(verifyResendBtn){
    verifyResendBtn.addEventListener("click",()=>{
        _pendingCode=generateCode();
        const cd=document.getElementById("verifyCodeDisplay");
        if(cd) cd.textContent=_pendingCode;
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

function setMode(mode,dur=0){
    aMode=mode; aFrame=0;
    clearTimeout(aTalkTimer);
    if(dur) aTalkTimer=setTimeout(()=>{ aMode="idle"; aFrame=0; },dur);
}

setInterval(()=>{
    if(!assistantSprite) return;
    const fr=frames[aMode]||frames.idle;
    assistantSprite.src=fr[aFrame%fr.length];
    aFrame++;
},280);

function openAssistant(){
    if(!assistant) return;
    assistant.classList.add("is-open");
    if(assistantChat) assistantChat.setAttribute("aria-hidden","false");
    setMode("talk",900);
    setTimeout(()=>assistantInput?.focus(),150);
}

// FIX: el avatar abre/cierra el chat
if(assistantAvatar){
    assistantAvatar.addEventListener("click",()=>{
        if(!assistant) return;
        const isOpen=assistant.classList.contains("is-open");
        if(isOpen){
            assistant.classList.remove("is-open");
            if(assistantChat) assistantChat.setAttribute("aria-hidden","true");
            setMode("idle");
        } else {
            openAssistant();
        }
    });
}
if(assistantClose){
    assistantClose.addEventListener("click",()=>{
        if(!assistant) return;
        assistant.classList.remove("is-open");
        if(assistantChat) assistantChat.setAttribute("aria-hidden","true");
        setMode("idle");
    });
}

function addMsg(text,type="bot"){
    if(!assistantMessages) return;
    const m=document.createElement("p");
    m.className="assistant-message "+type;
    m.textContent=text;
    assistantMessages.appendChild(m);
    assistantMessages.scrollTop=assistantMessages.scrollHeight;
}

// ============================
// MOTOR DEL CHATBOT
// ============================
function normalizeText(t){
    return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s#+.\/-]/g," ").replace(/\s+/g," ").trim();
}
function buildRegex(k){
    const e=normalizeText(k).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    return new RegExp("(?<![a-z0-9])"+e+"(?![a-z0-9])","i");
}
function scoreEntry(entry,q){ let s=0; for(const k of entry.keywords){ if(buildRegex(k).test(q)) s++; } return s; }
function getAnswer(question){
    const q=normalizeText(question);
    let best=null,bestS=0;
    for(const e of assistantKnowledge){
        const s=scoreEntry(e,q);
        if(s>bestS){ bestS=s; best=e; }
        else if(s===bestS&&s>0&&e.priority>(best?best.priority:-Infinity)) best=e;
    }
    return (bestS>0&&best)?best.answer:"";
}


// ============================
// BASE DE CONOCIMIENTO
// ============================
const assistantKnowledge = [

    // CONVERSACIONAL
    {priority:1100,keywords:["hola","buenas","ey","saludos","hello","hey"],answer:"¡Hola! Soy IgorBot 👾 Pregúntame por cualquier módulo: HTML, CSS, JavaScript, Hardware, Redes, Server, SQL, Excel, Unity, Ciberseguridad, Linux, Python o React."},
    {priority:1099,keywords:["gracias","thank","perfecto","genial","guay","mola","crack"],answer:"¡De nada! Para eso estoy 😎 ¿Algo más en lo que pueda ayudarte?"},
    {priority:1098,keywords:["adios","hasta luego","bye","chao","nos vemos"],answer:"¡Hasta pronto! El hall siempre estará aquí cuando lo necesites 👋"},
    {priority:1097,keywords:["quien eres","que eres","eres un bot","eres ia","te llamas"],answer:"Soy IgorBot, el asistente de IgorHall. Especialista en orientarte por los módulos de esta plataforma. No soy una IA general — conozco este hall al dedillo 🤖"},
    {priority:1096,keywords:["quien es igor","igor hermoso","de quien es","creador","autor"],answer:"IgorHall es la plataforma creada por Igor Hermoso: un espacio para aprender informática, programación, redes y más con estética retro arcade. Todo alojado en GitHub Pages."},

    // ORIENTACIÓN
    {priority:1090,keywords:["recomiendas","recomienda","que estudio","que hago","consejo","orientame","perdido","no se que","por donde empiezo","que deberia"],answer:"Depende de tu objetivo: webs → HTML+CSS+JS → React. Infraestructura → Hardware+Redes+Server+Linux. Datos → SQL+Python. Videojuegos → Unity. Ciberseguridad → empieza por Redes y Server. ¿Tienes experiencia previa?"},
    {priority:1089,keywords:["principiante","soy nuevo","nunca he programado","cero conocimientos","desde cero","sin experiencia"],answer:"Si partes de cero: 1→ HTML & CSS (visual, ves resultados enseguida) · 2→ JavaScript · 3→ Hardware o Redes según si te atrae más el software o la infra. Empieza por IGORCADEMIA."},
    {priority:1088,keywords:["quiero programar","aprender a programar","primer lenguaje","que lenguaje","lenguaje para empezar"],answer:"Para empezar a programar desde cero: JavaScript es la mejor opción. Funciona en el navegador, ves el resultado al instante y abre las puertas de React, Node.js y mucho más. Luego puedes añadir Python."},
    {priority:1087,keywords:["trabajo","trabajar","empleo","salida laboral","mercado","futuro","sueldo","demanda","dedicarme"],answer:"Las salidas más demandadas 2025/2026: Frontend (HTML+CSS+JS+React), SysAdmin (Server+Linux+Redes), Data Engineer (SQL+Python), Unity Developer y Analista de Ciberseguridad. Todos los módulos de IgorHall cubren estas rutas."},
    {priority:1086,keywords:["cuanto tiempo","tiempo aprender","cuanto tarda","meses","semanas","duracion"],answer:"Con 1-2h diarias: HTML & CSS → 4-6 semanas · JavaScript básico → 8-12 semanas · SQL o Redes → 6-8 semanas · Unity básico → 3-4 meses. Lo importante es practicar cada día."},
    {priority:1085,keywords:["gratis","precio","cuesta","pago","gratuito","libre"],answer:"Todo el contenido de IgorHall es gratuito y de acceso libre en GitHub Pages. Solo necesitas el enlace."},
    {priority:1084,keywords:["que hay","que tiene","que puedo aprender","contenido","modulos","secciones","encontrar","cuantos"],answer:"IgorHall tiene 13 módulos: HTML & CSS, JavaScript, Hardware, Redes, Server, Ciberseguridad, SQL, Excel, Unity, IA, Linux, Python y React. Más la zona de juego APALACHES. Pulsa el botón 'I' para el detalle de cada uno."},
    {priority:1083,keywords:["es dificil","cuesta","complicado","me rindo","no entiendo","motivacion","aburre"],answer:"Aprender tecnología es un proceso. Lo normal es atascarse: busca el ejercicio más pequeño que puedas resolver. En IgorHall los módulos van de menor a mayor dificultad y el chatbot está aquí para cuando te bloqueas. ¡No abandones!"},
    {priority:1082,keywords:["por donde empezar","empezar","ruta","itinerario","secuencia","orden","roadmap"],answer:"Ruta completa: 1→ HTML/CSS · 2→ JavaScript · 3→ Hardware · 4→ Redes · 5→ Server · 6→ Linux · 7→ Python · 8→ SQL · 9→ Ciberseguridad · 10→ React · 11→ Unity · 12→ IA."},

    // HTML & CSS
    {priority:900,keywords:["html css","igorcademia","diseno web","maquetacion","pagina web","frontend"],answer:"IGORCADEMIA cubre HTML & CSS desde cero: 70+ ejercicios en 17 módulos, editores en vivo, IgorPoints, logros y retos visuales. → igorhermoso1.github.io/IGORCADEMIA"},
    {priority:895,keywords:["estructura html","doctype","etiqueta html","head","body","charset","viewport","metadatos"],answer:"Estructura HTML: DOCTYPE, html con lang, head (charset UTF-8, viewport, title, meta), body y jerarquía correcta. Documentos HTML válidos desde la primera línea."},
    {priority:890,keywords:["semantica html","header tag","nav tag","article","section","footer tag","aside","accesibilidad html"],answer:"Semántica HTML: header, nav, main, article, section, footer, aside, figure. Código que entienden navegadores, lectores de pantalla y Google."},
    {priority:885,keywords:["formulario html","form","etiqueta input","textarea","select html","checkbox","radio button","validacion html"],answer:"Formularios: form, input (text, email, number, password, date), select, textarea, checkbox, radio, required, pattern y validación nativa sin JS."},
    {priority:880,keywords:["selectores css","box model","margin css","padding css","border css","especificidad css"],answer:"CSS base: selectores (tipo, clase, ID, combinadores), especificidad, cascada, herencia y box model completo (content, padding, border, margin)."},
    {priority:875,keywords:["colores css","hex css","rgb css","hsl css","gradiente css","linear gradient"],answer:"Colores CSS: HEX, RGB, RGBA, HSL. Gradientes con linear-gradient, radial-gradient y conic-gradient con múltiples paradas."},
    {priority:870,keywords:["flexbox","display flex","justify content","align items","flex direction","flex wrap"],answer:"Flexbox: display:flex, flex-direction, justify-content, align-items, flex-wrap, gap, order, flex-grow/shrink/basis. Layouts en una dimensión."},
    {priority:865,keywords:["css grid","display grid","grid template","grid area","auto fit","minmax"],answer:"CSS Grid: display:grid, grid-template-columns/rows, grid-area, auto-fit, minmax(), fr, gap. Layouts bidimensionales complejos."},
    {priority:860,keywords:["responsive css","media query","mobile first","clamp css","unidades fluidas"],answer:"Responsive: mobile-first con media queries, clamp() para tipografía adaptable, unidades fluidas (vw, vh, %, em, rem)."},
    {priority:855,keywords:["hover css","transicion css","transformacion css","keyframes","animacion css"],answer:"Interacción visual: :hover, :focus, transiciones, transformaciones (rotate, scale, translate) y @keyframes + animation."},
    {priority:850,keywords:["variables css","custom property","var css","dark mode css","tema css"],answer:"Variables CSS: :root{ --color: #7fdcff; } y úsalas con var(--color). Base para temas dinámicos y dark mode."},
    {priority:845,keywords:["filter css","backdrop filter","mix blend mode","clip path","efecto visual css"],answer:"Efectos CSS: filter (blur, brightness, contrast), backdrop-filter para glassmorphism, clip-path para recortes, mix-blend-mode para capas."},

    // JAVASCRIPT
    {priority:800,keywords:["javascript","igorscript","programacion javascript","aprender javascript"],answer:"IGORSCRIPT: 124 ejercicios en 12 módulos. De variables y tipos hasta APIs reales (PokéAPI, SuperHero API). → igorhermoso1.github.io/IGORSCRIPT"},
    {priority:795,keywords:["variables javascript","let","const","typeof","template literal","string js"],answer:"Variables JS: let (bloque scope), const (no reasignable). Tipos: string, number, boolean, null, undefined. typeof para verificar. Template literals con backticks."},
    {priority:790,keywords:["operadores javascript","operador aritmetico","operador comparacion","ternario javascript","nullish coalescing"],answer:"Operadores JS: aritméticos (+,-,*,/,%,**), comparación (===,!==,>,<), lógicos (&&,||,!), ternario (?:), nullish (??) y optional chaining (?.)."},
    {priority:785,keywords:["dom javascript","queryselector","getelementbyid","innerhtml","textcontent","dataset"],answer:"DOM: querySelector, querySelectorAll, getElementById. Leer/modificar con innerHTML, textContent, getAttribute, setAttribute, dataset."},
    {priority:780,keywords:["eventos javascript","addeventlistener","evento click","evento submit","keydown","preventdefault"],answer:"Eventos: addEventListener('click',fn), input, change, submit, keydown. event.preventDefault() y stopPropagation()."},
    {priority:775,keywords:["condicionales javascript","if else","switch javascript"],answer:"Control de flujo: if/else if/else, switch/case/default, operador ternario para asignaciones cortas."},
    {priority:770,keywords:["bucles javascript","for javascript","while javascript","foreach javascript","for of"],answer:"Bucles: for clásico, while, do...while, forEach, for...of, for...in. break y continue para controlar el flujo."},
    {priority:765,keywords:["funciones javascript","arrow function","parametros js","return js","scope javascript","closure javascript"],answer:"Funciones: declaration, expression, arrow functions (=>). Parámetros con defaults, rest (...args), return, scope léxico y closures."},
    {priority:760,keywords:["arrays javascript","map javascript","filter javascript","find javascript","reduce javascript","push js","pop js"],answer:"Arrays: push/pop/shift/unshift; map() transformar; filter() filtrar; find() buscar; reduce() acumular; splice, slice, sort."},
    {priority:755,keywords:["objetos javascript","spread operator","destructuring javascript","object keys"],answer:"Objetos: creación literal {}, acceso con punto/[]; spread ({...obj}); destructuring ({name}=obj); Object.keys(), values(), entries()."},
    {priority:750,keywords:["classlist javascript","classlist add","classlist toggle","createelement","appendchild"],answer:"DOM dinámico: classList.add/remove/toggle/contains(), element.style, createElement, appendChild, prepend, remove()."},
    {priority:745,keywords:["fetch javascript","async await","promesas javascript","promise js","then catch","peticion http"],answer:"Asincronía: fetch(url) → Promise. async/await o .then/.catch. response.json() para parsear. try/catch para errores."},
    {priority:740,keywords:["pokeapi","pokemon api","superhero api","api publica javascript","proyecto javascript"],answer:"Proyectos JS: PokéAPI para Pokémon con stats e imágenes, SuperHero API para héroes. Buscadores visuales con fetch y cards dinámicas."},
    {priority:735,keywords:["localstorage javascript","sessionstorage","persistencia javascript","setitem","getitem"],answer:"localStorage: setItem/getItem/removeItem. JSON.stringify para guardar objetos, JSON.parse para leerlos. sessionStorage solo dura la sesión."},

    // HARDWARE
    {priority:700,keywords:["hardware","igorhardware","componentes pc","montar pc","ensamblar pc","piezas pc"],answer:"IGORHARDWARE: componentes, montaje, diagnóstico, BIOS, SO, virtualización y laboratorio 2026. → igorhermoso1.github.io/IGORHARDWARE"},
    {priority:695,keywords:["cpu","procesador","intel core","amd ryzen","nucleos cpu","socket cpu"],answer:"CPU: núcleos, hilos, caché, velocidad GHz. Intel (i3/i5/i7/i9) y AMD (Ryzen 3/5/7/9). Sockets LGA1700 y AM5."},
    {priority:690,keywords:["memoria ram","ddr4","ddr5","frecuencia ram","dual channel","xmp ram"],answer:"RAM: DDR4 y DDR5, frecuencias (3200-6400 MHz), latencias CL, dual channel para más rendimiento, XMP/EXPO en BIOS."},
    {priority:685,keywords:["ssd nvme","disco duro","ssd sata","almacenamiento pc","hdd","m2 nvme"],answer:"Almacenamiento: HDD (lento/barato), SSD SATA (550 MB/s), SSD NVMe M.2 (hasta 7000 MB/s). NVMe para el SO."},
    {priority:680,keywords:["gpu","tarjeta grafica","nvidia rtx","amd rx","vram gpu"],answer:"GPU: integrada para ofimática, dedicada para gaming/diseño. NVIDIA RTX y AMD RX. VRAM GDDR6/GDDR7. Cuidado con el cuello de botella."},
    {priority:675,keywords:["placa base","motherboard","chipset placa","formato atx","ranura pcie"],answer:"Placa base: chipsets Intel (B760, Z790) y AMD (B650, X670), sockets, formatos ATX/mATX/ITX, ranuras PCIe x16 y M.2."},
    {priority:670,keywords:["fuente alimentacion","psu","certificacion 80plus","vatios psu"],answer:"PSU: 80 Plus Bronze/Gold/Platinum, modular vs semimodular, calcular vatios con margen del 20%."},
    {priority:665,keywords:["refrigeracion pc","cooler cpu","pasta termica","temperatura cpu","refrigeracion liquida","aio"],answer:"Refrigeración: disipadores de torre, AIO 240/360 mm, pasta térmica, control PWM. Temperaturas seguras según CPU."},
    {priority:660,keywords:["bios uefi","post bios","arranque pc","boot order","actualizar bios","xmp bios"],answer:"BIOS/UEFI: POST al encender, boot order, activar XMP/EXPO para la RAM, Q-Flash/EZ Flash para actualizar, jumper CMOS para resetear."},
    {priority:655,keywords:["compatibilidad pc","cuello botella","presupuesto pc","pcpartpicker"],answer:"Compatibilidad: socket CPU con placa base, generación RAM, cuello de botella GPU/CPU, TDP cooler vs CPU, vatios PSU."},
    {priority:650,keywords:["diagnostico pc","pc no enciende","pantalla negra pc","pitido bios","bsod"],answer:"Diagnóstico: no enciende → PSU/RAM/CPU; pantalla negra → GPU/RAM/SO; pitidos BIOS → manual placa; BSOD → driver/RAM/temperatura. Usa HWiNFO64."},
    {priority:645,keywords:["pc builder","simulador pc","armar pc virtual"],answer:"PC Builder de IGORHARDWARE: elige piezas reales, comprueba compatibilidad, calcula consumo y ajusta presupuesto."},

    // REDES
    {priority:600,keywords:["redes","igorredes","networking","red informatica"],answer:"IGORREDES: TCP/IP, subnetting, WiFi, VLANs, routing, simulador drag&drop, mapas lógicos y CLI Cisco. → igorhermoso1.github.io/IGORREDES"},
    {priority:595,keywords:["modelo osi","capas osi","capa fisica","capa transporte","capa aplicacion"],answer:"OSI 7 capas: Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación. Cada capa tiene protocolos específicos."},
    {priority:590,keywords:["protocolo tcp","protocolo udp","protocolo icmp","suite tcp ip","protocolo dhcp","protocolo dns"],answer:"TCP/IP: TCP (fiable, orientado conexión), UDP (rápido, sin confirmación), ICMP (ping), ARP, DNS, DHCP, HTTP/HTTPS, SSH."},
    {priority:585,keywords:["direccion ip","ipv4","mascara subred","clase red","red privada","cidr"],answer:"IPv4: clases A/B/C, privadas (10.x, 172.16-31.x, 192.168.x), loopback (127.0.0.1), CIDR /24 = 255.255.255.0."},
    {priority:580,keywords:["subnetting","subneteo","calcular subredes","vlsm","dividir red","hosts por subred"],answer:"Subnetting: dividir redes con CIDR, calcular hosts (2ⁿ-2), subredes (2ᵐ), VLSM para tamaños distintos. Usa la calculadora visual de IGORREDES."},
    {priority:575,keywords:["wifi redes","inalambrico","802.11","banda 2.4ghz","banda 5ghz","wpa3"],answer:"WiFi: 802.11ax (WiFi 6), bandas 2.4 GHz (alcance) vs 5/6 GHz (velocidad), WPA3, APs, mesh y planificación de cobertura."},
    {priority:570,keywords:["vlan","segmentacion red","trunk vlan","dot1q","switch gestionable"],answer:"VLANs: segmentación lógica sin cambiar cableado. Puertos access vs trunk (802.1Q). Inter-VLAN routing con router-on-a-stick."},
    {priority:565,keywords:["router redes","routing","enrutamiento","tabla enrutamiento","ruta estatica","ospf","nat"],answer:"Routing: tablas de enrutamiento, rutas estáticas (manuales), OSPF, BGP. NAT para IPs privadas, gateway por defecto."},
    {priority:560,keywords:["switch redes","switching","tabla mac","spanning tree","stp redes"],answer:"Switching: capa 2, tabla MACs dinámica, flooding/forwarding/filtering. STP/RSTP para evitar bucles. Full-duplex elimina colisiones."},
    {priority:555,keywords:["simulador red","topologia red","mapa red","plano red"],answer:"Simulador IGORREDES: arrastra routers, switches y PCs, conecta con cables, asigna IPs y haz ping. Editor de planos para planificar instalaciones."},
    {priority:550,keywords:["cisco ios","cli cisco","enable cisco","configure terminal","show running config"],answer:"CLI Cisco: enable → configure terminal → interface gi0/0 → ip address x.x.x.x mask → no shutdown → show ip interface brief."},

    // SERVER
    {priority:500,keywords:["server","igorserver","servidor","administracion sistemas","windows server"],answer:"IGORSERVER: Windows Server, Active Directory, DNS, DHCP, GPOs, PowerShell, VirtualBox, RAID, backups, Ubuntu Server y Nagios. → igorhermoso1.github.io/IGORSERVER"},
    {priority:495,keywords:["windows server rol","server manager","roles servidor","escritorio remoto servidor"],answer:"Windows Server: instalación, Server Manager, roles (AD DS, DNS, DHCP, IIS, Hyper-V), RDP para gestión remota."},
    {priority:490,keywords:["active directory","ad ds","directorio activo","controlador dominio","unirse dominio"],answer:"Active Directory: instalar AD DS, promover a DC, dominio, árbol/bosque, unir equipos, ADUC y ADSI Edit."},
    {priority:485,keywords:["usuarios active directory","grupos ad","ou active directory","unidad organizativa","resetear password ad"],answer:"AD – Usuarios: crear/modificar/deshabilitar cuentas, grupos de seguridad, OUs para delegar, reseteo de contraseñas."},
    {priority:480,keywords:["gpo","politica grupo","group policy","gpupdate","gpresult","politica contrasena"],answer:"GPOs: GPMC para crear y vincular, gpupdate /force para aplicar, gpresult /r para verificar. Políticas de contraseña, bloqueo y escritorio."},
    {priority:475,keywords:["dns servidor","zona dns","registro dns","registro a","nslookup"],answer:"DNS: zonas directas e inversas, registros A, CNAME, MX, PTR. Reenviadores. Diagnóstico con nslookup y ipconfig /flushdns."},
    {priority:470,keywords:["dhcp servidor","concesion dhcp","ambito dhcp","reserva dhcp"],answer:"DHCP: ámbito con rango IP, exclusiones, reservas por MAC, opciones (gateway, DNS), autorización en AD."},
    {priority:465,keywords:["virtualbox servidor","maquina virtual server","snapshot server"],answer:"VirtualBox: VMs de Windows Server, Windows 10/11 y Ubuntu. Adaptadores (NAT, Red Interna, Bridged), snapshots y exportación OVA."},
    {priority:460,keywords:["raid servidor","raid 0","raid 1","raid 5","raid 10","redundancia raid"],answer:"RAID: 0 (velocidad sin redundancia), 1 (espejo), 5 (paridad, mín. 3 discos), 10 (mirror+stripe). RAID software vs hardware."},
    {priority:455,keywords:["backup servidor","backup","copia seguridad servidor","acronis servidor","wbadmin"],answer:"Backups: regla 3-2-1, Windows Server Backup (wbadmin), Acronis True Image, tipos incremental/diferencial/completa, pruebas de restauración."},
    {priority:450,keywords:["powershell server","get-aduser","new-aduser","script powershell server"],answer:"PowerShell: Get-ADUser, New-ADUser, Set-ADUser -Enabled $false, Get-Service, pipeline |, scripts .ps1 y módulo ActiveDirectory."},
    {priority:445,keywords:["ubuntu server","linux en server","apache server","samba server","systemctl server"],answer:"Ubuntu Server: headless, systemctl, Apache/Nginx, Samba+AD para compartir carpetas con Windows, NTP y cron."},
    {priority:440,keywords:["nagios","monitorizacion server","snmp nagios","uptime server"],answer:"Nagios: monitoriza hosts y servicios (HTTP, SSH, CPU, disco), umbrales warning/critical, notificaciones email y plugins NRPE."},

    // CIBERSEGURIDAD
    {priority:400,keywords:["ciberseguridad","seguridad informatica","seguridad digital","ciber","hacking etico","pentest"],answer:"🔜 Ciberseguridad en IgorHall (PRÓXIMAMENTE): enfoque defensivo. Amenazas, higiene digital, firewall, hardening, ingeniería social, análisis de riesgos e incidentes con labs éticos."},
    {priority:395,keywords:["triada cia","confidencialidad","integridad dato","disponibilidad sistema","amenaza ciberseguridad","vulnerabilidad"],answer:"Tríada CIA: Confidencialidad (solo acceden quienes deben), Integridad (datos no modificados sin autorización), Disponibilidad (sistemas accesibles cuando se necesitan)."},
    {priority:390,keywords:["contrasena segura","gestor contrasenas","bitwarden","keepass","mfa","2fa","autenticacion doble"],answer:"Higiene digital: contraseñas únicas 16+ chars con gestor (Bitwarden, KeePass). MFA/2FA con TOTP (Aegis, Google Authenticator). Nunca reutilices contraseñas."},
    {priority:385,keywords:["phishing","smishing","vishing","ingenieria social ciberseguridad","correo falso"],answer:"Ingeniería social: phishing (email), smishing (SMS), vishing (llamada). Señales: urgencia, remitente extraño, link acortado. Protocolo: no clicar, verificar, reportar."},
    {priority:380,keywords:["firewall ciberseguridad","cortafuegos","reglas firewall","ufw linux","ids sistema"],answer:"Firewall: filtra por IP, puerto y protocolo. UFW (Linux), Windows Defender Firewall. IDS detecta intrusiones, IPS las bloquea. WAF protege apps web."},
    {priority:375,keywords:["hardening sistema","superficie ataque","minimo privilegio","parchear sistema"],answer:"Hardening: deshabilitar servicios no usados, cerrar puertos, mínimo privilegio, parches al día, cifrado de disco y auditoría."},
    {priority:370,keywords:["logs seguridad","analizar logs","event viewer","siem","wazuh","splunk seguridad"],answer:"Logs: Event Viewer (4624 login, 4625 fallido, 4720 nueva cuenta), journalctl en Linux. SIEMs como Wazuh o Splunk para centralizar y alertar."},
    {priority:365,keywords:["respuesta incidente","incident response","contencion incidente","recuperacion incidente"],answer:"Respuesta a incidentes: Identificación → Contención → Erradicación → Recuperación → Lecciones aprendidas."},

    // SQL
    {priority:300,keywords:["sql","igor sql","base datos","bases datos","sqlite","sgbd","base datos relacional"],answer:"IGOR SQL Academy: SQLite, DDL, DML, SELECT, JOINs, normalización y BDs temáticas (Pokémon, Marvel, hospital). → igorhermoso1.github.io/IGORSQL"},
    {priority:295,keywords:["tabla sql","columna sql","primary key","foreign key","not null sql","unique sql"],answer:"Modelo: tablas con columnas (TEXT, INTEGER, REAL), PRIMARY KEY para identificar filas, FOREIGN KEY para relaciones, NOT NULL, UNIQUE, DEFAULT, CHECK."},
    {priority:290,keywords:["create table sql","drop table","alter table","ddl sql"],answer:"DDL: CREATE TABLE con columnas y restricciones, ALTER TABLE (ADD/MODIFY/DROP COLUMN), DROP TABLE, TRUNCATE, CREATE INDEX."},
    {priority:285,keywords:["insert sql","update sql","delete sql","dml sql"],answer:"DML: INSERT INTO tabla (col) VALUES (v), UPDATE tabla SET col=val WHERE cond, DELETE FROM tabla WHERE cond. ¡Nunca UPDATE/DELETE sin WHERE en producción!"},
    {priority:280,keywords:["select sql","where sql","order by","limit sql","distinct sql","like sql","between sql"],answer:"SELECT: FROM, WHERE, ORDER BY ASC/DESC, LIMIT, DISTINCT, alias AS, LIKE '%texto%', BETWEEN, IN(), IS NULL."},
    {priority:275,keywords:["count sql","sum sql","avg sql","group by","having sql","funcion agregada"],answer:"Agregaciones: COUNT(*), SUM(), AVG(), MIN(), MAX(). GROUP BY para agrupar, HAVING para filtrar grupos (como WHERE sobre el resultado del GROUP BY)."},
    {priority:270,keywords:["join sql","inner join","left join","right join","subconsulta sql","union sql"],answer:"JOINs: INNER (coincidentes), LEFT (todos izq + coincidentes), RIGHT, FULL OUTER. Subconsultas en WHERE/FROM. UNION para combinar resultados."},
    {priority:265,keywords:["normalizacion sql","primera forma normal","segunda forma normal","tercera forma normal","1fn","2fn","3fn"],answer:"Normalización: 1FN (sin grupos repetidos, PK), 2FN (sin dependencias parciales de PK), 3FN (sin dependencias transitivas). Elimina redundancia."},
    {priority:260,keywords:["vista sql","create view","transaccion sql","commit sql","rollback sql","indice sql"],answer:"Avanzado: vistas (CREATE VIEW), transacciones (BEGIN/COMMIT/ROLLBACK) para operaciones atómicas, índices para acelerar consultas."},
    {priority:255,keywords:["db browser","dbeaver","sqliteonline","herramienta sql","cliente sql"],answer:"Herramientas SQL: DB Browser (gratuito, visual), DBeaver (multi-SGBD, profesional), SQLiteOnline.com (sin instalación), DataGrip (avanzado)."},

    // EXCEL
    {priority:200,keywords:["excel","hoja calculo","hoja de calculo","spreadsheet","microsoft excel","aprender excel"],answer:"🔜 Excel (PRÓXIMAMENTE en IgorHall): fórmulas avanzadas (BUSCARX, INDICE+COINCIDIR), tablas dinámicas, Power Query, gráficos y macros VBA. La herramienta ofimática más usada en empresas."},
    {priority:210,keywords:["formula excel","formulas excel","suma excel","si excel","buscarv","buscarx","indice coincidir","sumar si"],answer:"Fórmulas Excel: SUMA, PROMEDIO, CONTAR, SI anidado, BUSCARV (vertical), BUSCARX (moderno y flexible), INDICE+COINCIDIR (bidireccional), SUMAR.SI.CONJUNTO."},
    {priority:209,keywords:["tabla dinamica","tablas dinamicas","pivot table","segmentador","campo calculado","tabla excel","tablas excel"],answer:"Tablas dinámicas: resume miles de filas sin fórmulas. Agrupar datos, campos calculados, segmentadores interactivos y actualización con un clic."},
    {priority:208,keywords:["power query","importar datos excel","transformar datos","limpiar datos excel","etl excel","query excel"],answer:"Power Query: importa desde Excel, CSV, web o BD; limpia columnas, elimina duplicados, combina tablas y actualiza automáticamente. ETL sin código."},
    {priority:207,keywords:["macro excel","vba excel","visual basic excel","automatizar excel","grabadora macros","automatizar hoja"],answer:"Macros VBA: grabadora de macros, editor VBA, bucles, condicionales, formularios de usuario y automatización completa de informes con un botón."},
    {priority:206,keywords:["grafico excel","graficos excel","dashboard excel","panel control excel","sparklines"],answer:"Gráficos y dashboards: barras, líneas, circular, combinados, sparklines, ejes secundarios y paneles interactivos con tablas dinámicas + segmentadores."},

    // UNITY
    {priority:180,keywords:["unity","igorunity","videojuego unity","desarrollar videojuego","unity hub"],answer:"🔜 Unity (PRÓXIMAMENTE en IgorHall como módulo activo): hoja de ruta con 82 temas en 7 niveles, 91 assets, 10+ vídeos. Del editor y C# hasta multiplayer y VR. Próximamente disponible directamente desde el hall."},
    {priority:179,keywords:["scene unity","game view unity","hierarchy unity","inspector unity","ventanas unity"],answer:"Editor Unity: Scene (diseño), Game (previsualización), Hierarchy (árbol de objetos), Inspector (propiedades), Project (archivos) y Console (logs)."},
    {priority:178,keywords:["gameobject","gameobject unity","transform unity","componente unity","prefab","parenting unity","instantiate unity"],answer:"GameObjects: todo es un GO con Transform. Componentes añaden comportamiento. Prefabs = plantillas reutilizables. Instantiate(prefab, pos, rot)."},
    {priority:177,keywords:["csharp unity","c# unity","monobehaviour","start unity","update unity","awake unity","fixedupdate"],answer:"C# Unity: Awake() → OnEnable() → Start() → Update() (cada frame) → FixedUpdate() (física, 50 Hz) → LateUpdate(). El Game Loop es la base."},
    {priority:176,keywords:["rigidbody","rigidbody unity","collider unity","colision unity","trigger unity","oncollisionenter","fisica unity"],answer:"Física: Rigidbody activa gravedad y fuerzas; Collider (Box, Sphere, Capsule, Mesh) para geometría; OnCollisionEnter/Stay/Exit; OnTriggerEnter para zonas."},
    {priority:175,keywords:["movimiento unity","mover personaje unity","charactercontroller unity","lerp unity","input unity"],answer:"Movimiento: Input.GetAxis('Horizontal'/'Vertical'), Vector3 para dirección, CharacterController.Move() o Rigidbody.MovePosition(). Lerp para suavizar."},
    {priority:174,keywords:["animator unity","animacion unity","blend tree unity","state machine unity","settrigger unity"],answer:"Animator: máquina de estados, transiciones por condiciones (bool, float, trigger), Blend Trees para mezcla (caminar↔correr). Animator.SetBool/SetTrigger desde C#."},
    {priority:173,keywords:["ui unity","canvas unity","button unity","textmeshpro","hud unity"],answer:"UI Unity: Canvas (Overlay/Camera/World), Button, TextMeshPro, Image, Slider, Toggle, InputField. Layout Groups. OnClick() desde Inspector."},
    {priority:172,keywords:["navmesh unity","ia enemigo unity","pathfinding unity","navmeshagent","enemigo sigue jugador"],answer:"NavMesh: hornear en Window→AI→Navigation, NavMeshAgent al enemigo, agent.destination=jugador.position. NavMeshObstacle para obstáculos dinámicos."},
    {priority:171,keywords:["shader graph unity","vfx graph unity","particulas unity","particle system unity"],answer:"Gráficos Unity: Shader Graph (URP/HDRP) para shaders visuales, VFX Graph para partículas GPU, Particle System clásico (CPU), post-procesado con Volume."},
    {priority:170,keywords:["multiplayer unity","netcode unity","fishnet unity","networkvariable","clientrpc"],answer:"Multiplayer: Netcode for GameObjects, FishNet o Mirror. Host/Server/Client, NetworkVariable para sincronizar, ClientRpc/ServerRpc, Unity Lobby y Relay."},
    {priority:169,keywords:["vr unity","xr unity","realidad virtual unity","openxr unity","xr toolkit","meta quest unity"],answer:"VR Unity: XR Plugin Management + OpenXR, XR Interaction Toolkit (grab, teleport, UI VR). Meta Quest, PS VR2 y SteamVR desde el mismo proyecto."},
    {priority:168,keywords:["build unity","publicar juego unity","compilar unity","android unity","webgl unity"],answer:"Publicación: Build Settings → plataforma (PC, Android, iOS, WebGL), Player Settings, firmar APK para Android, TestFlight para iOS, Profiler antes del build."},

    // IA
    {priority:120,keywords:["inteligencia artificial","aprender ia","que es ia","llm","modelo lenguaje","chatgpt","claude ia","gemini ia"],answer:"🔜 IA en IgorHall (PRÓXIMAMENTE): cómo funcionan los LLMs, prompts efectivos, asistentes, automatización, datos, contenido generativo y uso responsable."},
    {priority:119,keywords:["prompt engineering","ingenieria prompts","prompts efectivos","chain of thought","few shot"],answer:"Prompt engineering: instrucciones claras, asignar rol, pedir formato (JSON, lista, tabla), chain-of-thought para razonamiento, few-shot con ejemplos."},
    {priority:118,keywords:["alucinacion ia","hallucination ia","inventar ia","sesgo ia","limitaciones ia"],answer:"Limitaciones IA: alucinaciones (inventa con confianza), sesgos del entrenamiento, ventana de contexto limitada. Siempre verifica información crítica."},
    {priority:117,keywords:["automatizar con ia","n8n ia","zapier ia","make ia","workflow ia","api openai","api anthropic"],answer:"Automatización con IA: APIs de OpenAI/Anthropic/Google, plataformas n8n, Zapier o Make para flujos no-code. Resúmenes, clasificaciones y análisis automático."},

    // LINUX
    {priority:100,keywords:["linux","gnu linux","aprender linux","distro linux","ubuntu linux","debian","arch linux","terminal linux"],answer:"🔜 Linux (PRÓXIMAMENTE en IgorHall): terminal, comandos, permisos, paquetes, procesos, red, Bash scripting y administración. Esencial para servidores y DevOps."},
    {priority:99,keywords:["comandos linux","ls linux","cd linux","mkdir linux","rm linux","grep linux","find linux","chmod linux","sudo linux"],answer:"Comandos básicos: ls -la, cd, pwd, mkdir -p, rm -rf, cp, mv, cat, less, tail -f, grep -r, find . -name, chmod, chown, sudo."},
    {priority:98,keywords:["apt linux","apt-get","dnf linux","pacman linux","gestor paquetes linux","instalar paquete linux"],answer:"Paquetes: apt (Debian/Ubuntu), dnf (Fedora), pacman (Arch). apt update && apt upgrade para actualizar, apt install para instalar."},
    {priority:97,keywords:["permisos linux","chmod linux","chown linux","rwx linux","755 linux","644 linux"],answer:"Permisos: rwx para usuario/grupo/otros. chmod 755 (rwxr-xr-x), 644 (rw-r--r--). Notación simbólica: chmod u+x archivo. chown user:group."},
    {priority:96,keywords:["bash scripting","script bash","shebang bash","variable bash","crontab linux","automatizar linux"],answer:"Bash scripting: #!/bin/bash, variables ($VAR), if/elif/else, for/while, funciones, argumentos ($1 $2), pipes (|) y crontab para tareas programadas."},

    // PYTHON
    {priority:80,keywords:["python","aprender python","programacion python","scripting python","pip python"],answer:"🔜 Python (PRÓXIMAMENTE en IgorHall): scripting, automatización, análisis de datos, APIs REST (Flask/FastAPI). El lenguaje más versátil del mercado."},
    {priority:79,keywords:["listas python","diccionario python","tuplas python","set python","comprehension python","lambda python"],answer:"Estructuras Python: listas [], tuplas (), diccionarios {k:v}, sets {}. List/dict comprehension en una línea. zip, enumerate, sorted, map, filter, lambda."},
    {priority:78,keywords:["clases python","poo python","init python","self python","herencia python","metodos especiales python"],answer:"POO Python: class Nombre, __init__(self), atributos, herencia (class Hija(Padre)), super().__init__(), encapsulación con _ y __, __str__, __repr__."},
    {priority:77,keywords:["requests python","beautifulsoup python","pandas python","dataframe python","matplotlib python","numpy python"],answer:"Librerías: requests (HTTP), BeautifulSoup (scraping), pandas (DataFrames, CSV, groupby), numpy (arrays numéricos), matplotlib (gráficas). pip install nombre."},
    {priority:76,keywords:["flask python","fastapi python","django python","api rest python","endpoint python","backend python"],answer:"Backend Python: Flask (micro, simple), FastAPI (async, auto-documentado), Django (full-stack). Aprenderás rutas, JSON, CRUD y conexión a SQLite o PostgreSQL."},

    // REACT
    {priority:60,keywords:["react","reactjs","aprender react","libreria react","jsx react","vite react","componente react"],answer:"🔜 React (PRÓXIMAMENTE en IgorHall): componentes funcionales, hooks, estado, React Router, APIs y despliegue. La librería de UI más demandada."},
    {priority:59,keywords:["props react","children react","composicion react","prop drilling react"],answer:"Props: pasar datos de padre a hijo, desestructurar ({name,age}), valor por defecto, children para componer. Context API para evitar prop drilling."},
    {priority:58,keywords:["usestate react","estado react","setstate react","re-render react"],answer:"useState: const [val, setVal] = useState(inicial). setVal(nuevo) o setVal(prev=>prev+1) para basarse en el estado anterior. Cada cambio dispara re-render."},
    {priority:57,keywords:["useeffect react","efecto react","dependencias useeffect","fetch useeffect","cleanup useeffect"],answer:"useEffect: [] solo al montar, [var] cuando cambia, sin array en cada render. Return para cleanup. Ideal para fetch de APIs."},
    {priority:56,keywords:["usecontext react","context api react","provider react","createcontext react","estado global react"],answer:"Context API: createContext(), <Context.Provider value={...}> envuelve el árbol, useContext(Mi) en cualquier descendiente. Para tema, idioma o usuario global."},
    {priority:55,keywords:["react router","rutas react","route react","link react","useparams react","usenavigator react"],answer:"React Router v6: BrowserRouter → Routes → Route path='/ruta' element={<Comp/>}. Link para navegar, useNavigate() programático, useParams() para :id."},
    {priority:54,keywords:["tailwind react","tailwindcss react","utilidad css react"],answer:"Tailwind en React: clases de utilidad en className ('flex justify-center p-4 bg-blue-500'). Responsive (md:, lg:), dark mode (dark:), hover (hover:)."},

    // CULTURA POP
    {priority:50,keywords:["one piece","luffy","zoro","sanji","nakama","manga","anime","grand line"],answer:"¡NAKAMA! One Piece sigue siendo una obra maestra. El manga de Oda está en la saga final. El live action de Netflix fue mejor de lo esperado 🏴‍☠️ Escribe 'nakama' en el teclado para un easter egg."},
    {priority:49,keywords:["marvel","comics","superheroes","spider man","wolverine","xmen","panini"],answer:"¡Gran gusto! En España Panini trae las mejores colecciones. El módulo de JavaScript tiene un proyecto con la SuperHero API donde buscas héroes en tiempo real."},
    {priority:48,keywords:["dragon age","darkspawn","inquisition","solas","grey warden","bioware","veilguard"],answer:"Dragon Age Veilguard... polémica aparte, el lore de Thedas es increíble. Escribe 'darkspawn' en el teclado para un easter egg especial 🐉"},
    {priority:47,keywords:["baldur gate","baldurs gate","bg3","larian","dnd","dungeons dragons","shadowheart","astarion"],answer:"BG3 es posiblemente el mejor RPG de los últimos 10 años. Escribe 'dice' en el teclado para activar un easter egg especial 🎲"},
    {priority:46,keywords:["red dead","red dead redemption","arthur morgan","dutch","rockstar","rdr2"],answer:"RDR2 es arte en movimiento. 'I gave you all I had.' Escribe 'arthur' en el teclado para un easter egg homenaje 🤠"},
    {priority:45,keywords:["fallout","vault dweller","wasteland","new vegas","bethesda","nuka cola","brotherhood steel"],answer:"War. War never changes. New Vegas sigue siendo el pináculo. Escribe 'vault' o haz 3 clicks en el reloj para el easter egg ☢️"},
    {priority:44,keywords:["metal gear","solid snake","big boss","otacon","codec","hideo kojima","mgs"],answer:"Kept you waiting, huh? Metal Gear Solid es una saga única. Escribe 'snake' en el teclado para activar el easter egg 📦"},
    {priority:43,keywords:["witcher","geralt","ciri","yennefer","cd projekt","wild hunt"],answer:"The Witcher 3 sigue siendo un referente. Wind's howling. Escribe 'geralt' en el teclado para el easter egg ⚔️"},
    {priority:42,keywords:["elden ring","dark souls","fromsoftware","souls","miyazaki","bloodborne","sekiro"],answer:"Elden Ring es art. La colaboración Miyazaki + GRRM fue brutal. ¿Has llegado a Malenia? APALACHES tiene su propio nivel de dificultad 😏"},
    {priority:41,keywords:["zelda","link","hyrule","nintendo","breath of wild","tears kingdom"],answer:"La saga Zelda es intemporal. Tears of the Kingdom llevó la física de BOTW a otro nivel. Si te interesa el desarrollo de juegos, el módulo de Unity es tu camino."},
    {priority:40,keywords:["cine","pelicula","cartelera","estreno","netflix","disney","hbo","series","serie"],answer:"Mi conocimiento llega hasta agosto de 2025, así que para estrenos recientes mejor busca en Filmaffinity o JustWatch. Para cine de ciencia ficción, el módulo de IA tiene cosas que parecen sacadas de una peli de Spielberg."},
    // Cultura pop extra
    {priority:39,keywords:["batman","joker","dc comics","gotham","bruce wayne","dark knight","arkham"],answer:"I am Batman. La trilogía de Nolan es cine de superhéroes al máximo nivel. Escribe 'joker' o 'batman' en el teclado para un easter egg especial 🦇"},
    {priority:38,keywords:["star wars","jedi","sith","yoda","darth vader","luke","lightsaber","fuerza"],answer:"May the Force be with you. Star Wars es un universo sin fin. La saga de Skywalker, los mandalorianos, Andor... Escribe 'yoda' para un easter egg 🌟"},
    {priority:37,keywords:["el padrino","padrino","godfather","corleone","mafia","vito","michael corleone"],answer:"An offer you can't refuse. El Padrino (1972) de Coppola es la película más influyente del cine moderno. Escribe 'corleone' en el teclado 🌹"},
    {priority:36,keywords:["pokemon","pikachu","ash","charizard","bulbasaur","squirtle","misty","pokedex"],answer:"Gotta catch 'em all! ¿Sabías que en IGORSCRIPT hay un proyecto completo que conecta con la PokéAPI y te muestra stats, imágenes y tipos? Escribe 'pikachu' en el teclado ⚡"},
    {priority:35,keywords:["pacman","pac-man","arcade","waka","fantasma","blinky","namco"],answer:"Waka waka waka! Pac-Man (1980) es el videojuego arcade más icónico de la historia. Y por supuesto IgorHall tiene su propia zona arcade. Escribe 'pacman' en el teclado 🟡"},
    {priority:34,keywords:["matrix","neo","morfeo","morpheus","trinity","pastilla roja","red pill","blue pill","spoon"],answer:"There is no spoon. The Matrix (1999) redefinió la ciencia ficción y sigue siendo relevante. Escribe 'redpill' o 'matrix' en el teclado para activar el easter egg 💊"},
    {priority:33,keywords:["baldur","bg3","baldurs gate","dnd","dungeons dragons","shadowheart","astarion","gale","wyll"],answer:"¡A Critical Hit! BG3 es el RPG de la generación. Larian Studios lo dio todo. ¿Cuántas partidas llevas ya? Escribe 'baldur' o 'astarion' en el teclado 🎲"},
];

if(assistantForm){
    assistantForm.addEventListener("submit",e=>{
        e.preventDefault();
        const q=assistantInput.value.trim();
        if(!q) return;
        addMsg(q,"user");
        assistantInput.value="";
        const ans=getAnswer(q);
        setTimeout(()=>{
            setMode("talk",2000);
            addMsg(ans||"No tengo info específica sobre eso. Prueba con: 'qué hay en JavaScript', 'subnetting', 'Unity', 'Excel', 'por dónde empezar'…");
        },220);
    });
}

