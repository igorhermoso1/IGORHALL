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
// CHATBOT — MOTOR CONVERSACIONAL
// Conversación fluida con contexto, memoria de sesión
// y respuestas orgánicas variadas
// ============================

// Estado conversacional
let chatHistory    = [];   // [{role, text}]  — últimos turnos
let chatTopic      = null; // módulo mencionado recientemente
let userName       = null; // nombre del usuario si lo menciona
let sessionMsgCount= 0;    // cuántos mensajes llevamos

// Cargar nombre si hay perfil guardado
try {
    const profile = JSON.parse(localStorage.getItem("igorhall_profile") || "null");
    if(profile?.name) userName = profile.name.split(" ")[0];
} catch(e){}

// ── UTILIDADES ────────────────────────────────────────────────────────────────

function norm(t) {
    return t.toLowerCase().normalize("NFD")
        .replace(/[̀-ͯ]/g,"")
        .replace(/[^a-z0-9\s]/g," ")
        .replace(/\s+/g," ").trim();
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function contains(text, ...words) {
    const n = norm(text);
    const toks = n.split(" ");
    return words.some(w => {
        const nw = norm(w);
        if(nw.includes(" ")) return n.includes(nw);
        return toks.some(t => t === nw);
    });
}

// ── ANÁLISIS DE INTENCIÓN ─────────────────────────────────────────────────────

function detectTopic(text) {
    if(contains(text,"html","css","maquetacion","diseño web","igorcademia","frontend","pagina web","web")) return "html";
    if(contains(text,"javascript","igorscript","js","dom","fetch","promise","async","array","funcion")) return "js";
    if(contains(text,"hardware","igorhardware","cpu","gpu","ram","ssd","placa","ordenador","pc","montar")) return "hardware";
    if(contains(text,"redes","igorredes","subnetting","tcp","vlan","router","switch","wifi","cidr","dhcp","dns","osi")) return "redes";
    if(contains(text,"server","igorserver","windows server","active directory","powershell","gpo","virtualbox","nagios","samba")) return "server";
    if(contains(text,"sql","igorsql","base de datos","select","join","tabla","consulta","sqlite")) return "sql";
    if(contains(text,"ciberseguridad","seguridad","phishing","malware","hacker","firewall","pentest","hacking","cifrado","mfa","ransomware")) return "cyber";
    if(contains(text,"excel","hoja de calculo","formula","buscarv","buscarx","tabla dinamica","power query","vba","macro")) return "excel";
    if(contains(text,"unity","videojuego","gameobject","prefab","rigidbody","csharp","monobehaviour","navmesh")) return "unity";
    if(contains(text,"inteligencia artificial","ia","llm","chatgpt","prompt","machine learning","openai")) return "ia";
    if(contains(text,"linux","ubuntu","debian","bash","terminal","chmod","apt","sudo","script shell")) return "linux";
    if(contains(text,"python","pandas","flask","fastapi","pip","scripting","automatizacion")) return "python";
    if(contains(text,"react","reactjs","jsx","usestate","useeffect","hooks","componente react")) return "react";
    return null;
}

function detectIntent(text) {
    const n = norm(text);
    if(contains(text,"hola","buenas","hey","saludos","hello","buenos dias","buenas tardes","que tal","como estas")) return "greeting";
    if(contains(text,"adios","hasta luego","bye","chao","nos vemos","hasta pronto","me voy")) return "goodbye";
    if(contains(text,"gracias","thank","perfecto","genial","guay","mola","crack","excelente","muy bien")) return "thanks";
    if(contains(text,"quien eres","que eres","como te llamas","eres bot","eres ia","que sabes","que puedes hacer")) return "whoami";
    if(contains(text,"igorhall","igor hermoso","quien creo","de quien es","que es esto","que es la web")) return "aboutigor";
    if(contains(text,"no se por donde","no se que estudiar","que me recomiendas","perdido","por donde empiezo","que hago","orienta","ayudame","consejo","recomendacion","que elijo","que estudiar")) return "guidance";
    if(contains(text,"soy principiante","nunca he programado","cero conocimientos","desde cero","sin experiencia","empezar desde cero","quiero aprender a programar","primer lenguaje")) return "beginner";
    if(contains(text,"trabajo","empleo","salida laboral","dedicarme","ganar dinero","profesion","sueldo","demanda","mercado laboral","salidas informatica")) return "career";
    if(contains(text,"cuanto tiempo","cuanto tarda","meses","semanas","duracion","cuanto dura")) return "time";
    if(contains(text,"gratis","cuesta","precio","pago","gratuito","es de pago")) return "price";
    if(contains(text,"que hay","que modulos","cuantos modulos","que se aprende","que tiene","que ofrece","que puedo","que encontrare")) return "modules";
    if(contains(text,"dificil","complicado","no entiendo","no puedo","me rindo","me cuesta","frustracion","atascado","no me sale")) return "difficulty";
    if(contains(text,"easter egg","secreto","secretos","oculto","pista","como desbloquear","hay secretos")) return "eggs";
    if(contains(text,"apalaches","juego","play","jugar")) return "apalaches";
    // Pop culture
    if(contains(text,"one piece","luffy","zoro","sanji","nakama","manga","anime","grand line")) return "onepiece";
    if(contains(text,"dragon age","darkspawn","inquisition","solas","thedas","veilguard")) return "dragonage";
    if(contains(text,"baldur gate","bg3","larian","dnd","dungeons dragons","shadowheart","astarion")) return "baldur";
    if(contains(text,"red dead","arthur morgan","rdr2","rockstar","vaquero","oeste")) return "reddead";
    if(contains(text,"fallout","vault","wasteland","new vegas","brotherhood steel")) return "fallout";
    if(contains(text,"metal gear","solid snake","big boss","hideo kojima","mgs")) return "metalgear";
    if(contains(text,"witcher","geralt","ciri","yennefer","wild hunt","brujo")) return "witcher";
    if(contains(text,"elden ring","dark souls","fromsoftware","miyazaki","bloodborne","sekiro")) return "elden";
    if(contains(text,"batman","bruce wayne","joker","gotham","dark knight")) return "batman";
    if(contains(text,"star wars","jedi","sith","yoda","darth vader","luke","lightsaber","mandalorian")) return "starwars";
    if(contains(text,"pokemon","pikachu","ash","charizard","gengar","pokedex")) return "pokemon";
    if(contains(text,"matrix","neo","morfeo","morpheus","pastilla roja","red pill","spoon")) return "matrix";
    if(contains(text,"marvel","xmen","avengers","spider man","wolverine","ironman","comic")) return "marvel";
    if(contains(text,"el padrino","godfather","corleone","mafia","vito")) return "padrino";
    if(contains(text,"pacman","pac-man","waka","arcade clasico","atari","mspacman")) return "pacman";
    if(contains(text,"videojuego","gaming","gamer","steam","ps5","xbox","nintendo")) return "gaming";
    if(contains(text,"pelicula","cine","serie","estreno","netflix","disney","hbo")) return "movies";
    return null;
}

// ── GENERADOR DE RESPUESTAS ───────────────────────────────────────────────────

const RESPONSES = {

    greeting: [
        () => userName
            ? `¡Hola de nuevo, ${userName}! 👾 ¿En qué te puedo ayudar hoy?`
            : "¡Hola! Soy IgorBot, el asistente de IgorHall 👾 ¿Buscas orientación sobre los módulos, tienes dudas sobre tecnología, o simplemente quieres charlar un rato?",
        () => "¡Buenas! ¿Qué tal? Estoy aquí para lo que necesites — orientación sobre los cursos, dudas técnicas, recomendaciones... o simplemente hablar de videojuegos y cultura geek 🎮",
        () => userName
            ? `¡${userName}! ¿Qué te trae por aquí hoy?`
            : "¡Hola! Dime, ¿por dónde quieres empezar?",
    ],

    goodbye: [
        () => "¡Hasta pronto! Cuando quieras seguir aprendiendo, aquí estaré 👋",
        () => "¡Nos vemos! Recuerda: cada día que dedicas a aprender es una inversión que nadie te puede quitar. ¡Ánimo! 🚀",
        () => "¡Cuídate! Y si te quedas bloqueado con algún concepto, ya sabes dónde encontrarme 👾",
    ],

    thanks: [
        () => "¡De nada! Para eso estoy 😄 ¿Algo más en lo que pueda ayudarte?",
        () => "¡Me alegra haber ayudado! Si tienes más dudas, pregunta sin miedo 🎮",
        () => "¡A ti! ¿Hay algo más que quieras saber?",
    ],

    whoami: [
        () => "Soy IgorBot, el asistente virtual que Igor Hermoso metió en el hall 🤖 Conozco todos los módulos de la plataforma, puedo orientarte según tu nivel o tus objetivos, y también me gusta hablar de videojuegos, cine y cómics. Pregúntame lo que quieras.",
        () => "Soy el asistente de IgorHall. Conozco el contenido de cada módulo, puedo recomendarte una ruta de aprendizaje según lo que buscas, y si quieres hablar de One Piece o Metal Gear también puedo 😄",
    ],

    aboutigor: [
        () => "IgorHall es la plataforma educativa de Igor Hermoso: aprendizaje de tecnología con estética retro arcade, todo gratuito en GitHub Pages. Tienes módulos activos de HTML, CSS, JavaScript, Hardware, Redes, Server y SQL, y varios más llegando pronto.",
        () => "Igor Hermoso construyó este hall para que aprender tecnología sea accesible y visualmente potente. Sin registro obligatorio, sin pago, sin excusas. Solo entras y empiezas 🕹️",
    ],

    guidance: [
        () => "Todo depende de lo que quieras conseguir 🎯 ¿Te llama más el mundo del diseño web y la programación, o prefieres la parte de redes e infraestructura? ¿O quizás te interesa algo más concreto como bases de datos o videojuegos?",
        () => "Antes de recomendarte algo, cuéntame: ¿tienes alguna base previa o partes desde cero? Y, ¿qué quieres hacer con lo que aprendas — trabajar en tech, hacer proyectos propios, o simplemente entender cómo funciona todo?",
        () => "Hay varias rutas posibles y depende de ti cuál tiene más sentido. Lo más importante es que la primera tecnología que aprendas te dé resultados visibles rápido — eso es lo que mantiene la motivación. Cuéntame qué te llama más y te oriento.",
    ],

    beginner: [
        () => "Si partes desde cero, empieza por HTML & CSS sin dudarlo. Construyes cosas que se ven en el navegador desde el primer día, y eso engancha mucho. Luego das el salto a JavaScript para añadir lógica e interactividad. Eso te da una base sólida desde la que puedes ir a donde quieras.",
        () => "El mejor punto de entrada es HTML & CSS — en IGORCADEMIA tienes 70+ ejercicios que escalan poco a poco, con editores en vivo para que veas el resultado al momento. Es el módulo más visual y el que da más satisfacción al principio. ¿Te animas?",
        () => "Empezar desde cero es la mejor situación porque no tienes que desaprender nada malo 😄 Mi recomendación: HTML & CSS primero, JavaScript después. Ambos se ven en el navegador, los resultados son inmediatos y la curva de aprendizaje es progresiva.",
    ],

    career: [
        () => "Las salidas con más demanda ahora mismo son: Frontend Developer (HTML+CSS+JS+React), SysAdmin/DevOps (Server+Linux+Redes), Data Engineer (SQL+Python) y Analista de Ciberseguridad. Todos están cubiertos en IgorHall. ¿Cuál te llama más?",
        () => "En tecnología hay trabajo, y mucho. El perfil más demandado en 2025/2026 sigue siendo el desarrollador frontend — y la ruta empieza aquí mismo con HTML, CSS y JavaScript. ¿Tienes claro si quieres ir más por el lado del código o por el de sistemas e infraestructura?",
        () => "Depende de lo que te guste. Si te va la parte visual y de código, frontend con React es lo más demandado. Si prefieres la infraestructura, la ruta Server+Linux+Redes tiene mucha salida. Y si te gustan los datos, SQL+Python es una combinación muy potente.",
    ],

    time: [
        () => "Depende de tu dedicación. Con 1h diaria: HTML & CSS básico en 4-6 semanas, JavaScript funcional en 2-3 meses. Lo importante no es la velocidad, es la constancia. Mejor 30 minutos cada día que 4 horas un sábado.",
        () => "No hay un tiempo fijo — depende de cuánto practiques y de cómo de cómodo te sientas con cada concepto. Una referencia realista: con dedicación seria, en 6 meses puedes tener una base sólida en frontend o en sistemas.",
    ],

    price: [
        () => "Todo en IgorHall es completamente gratuito 🎉 Sin registro obligatorio, sin suscripciones, sin contenido de pago. Solo entras y aprendes.",
        () => "Gratis al 100%. Igor lo tiene todo en GitHub Pages sin ningún tipo de muro de pago. Sin anuncios, sin trampa.",
    ],

    modules: [
        () => "Activos ahora mismo: HTML & CSS, JavaScript, Hardware, Redes, Server y SQL. Próximamente: Ciberseguridad, Excel, Unity, IA, Linux, Python y React. Y en la zona de ocio está APALACHES, el juego de Igor. Pulsa el botón 'I' para el detalle de cada módulo.",
        () => "IgorHall tiene 13 módulos de tecnología. Los que están activos: HTML+CSS, JavaScript, Hardware, Redes, Server y SQL. El resto llegará pronto: Ciberseguridad, Excel, Unity, IA, Linux, Python y React. ¿Alguno en particular te interesa?",
    ],

    difficulty: [
        () => "Atascarse es parte del proceso, absolutamente normal 💪 Lo que funciona es reducir el problema al mínimo: si no entiendes algo grande, intenta reproducir solo esa parte en un ejemplo pequeño. ¿En qué módulo o concepto concreto te estás bloqueando?",
        () => "El 'no entiendo nada' es una fase por la que pasa todo el mundo al aprender tech. El truco está en no intentar entenderlo todo de golpe. Un concepto cada vez, con práctica inmediata. ¿Qué es lo que te está dando más guerra?",
        () => "La frustración es una señal de que estás aprendiendo cosas que todavía no dominas — eso es bueno, aunque no lo parezca. Cuéntame qué es lo que no te está saliendo y lo vemos juntos.",
    ],

    eggs: [
        () => "¡El hall tiene 14 easter eggs ocultos! 🥚 Pulsa la card 'EASTER EGGS' en la zona de ocio para ver las pistas. Algunos se activan escribiendo palabras clave directamente en el teclado — nombres de personajes de juegos, películas... Otros tienen triggers más creativos.",
        () => "Los easter eggs se desbloquean de formas distintas: el código Konami (↑↑↓↓←→←→BA), escribir nombres de personajes icónicos en el teclado, hacer clicks especiales en elementos de la página... La card de Easter Eggs en la zona de ocio tiene las pistas.",
    ],

    apalaches: [
        () => "APALACHES es el juego survival/horror creado por Igor Hermoso 🎮 Está en la zona de ocio al final del hall. Sobrevive en las montañas. ¿Cuánto aguantas?",
        () => "¡El juego de Igor! APALACHES tiene toda la paranoia personal de su creador. Puedes acceder desde la zona de ocio abajo del todo. Y sí, está pensado para que no sea fácil 😏",
    ],

    // ── MÓDULOS ───────────────────────────────────────────────────────────────

    html: [
        () => "IGORCADEMIA es el módulo de HTML & CSS: 70+ ejercicios, 17 módulos con editores en vivo, IgorPoints y logros. Cubre desde la estructura básica hasta Flexbox, Grid, animaciones y responsive design. Está en igorhermoso1.github.io/IGORCADEMIA",
        () => "En HTML & CSS aprenderás a construir páginas reales desde cero. La parte más motivadora es que ves los resultados al instante en el navegador. IGORCADEMIA tiene una progresión muy bien pensada — empieza por la estructura, luego los estilos, luego el layout y acabas con efectos visuales avanzados.",
        () => "HTML & CSS es el lenguaje de la web. En IGORCADEMIA hay 70+ ejercicios organizados para que cada día notes progreso. Lo mejor: todo con editores en vivo donde escribes y ves el resultado en tiempo real. →igorhermoso1.github.io/IGORCADEMIA",
    ],

    js: [
        () => "IGORSCRIPT tiene 124 ejercicios en 12 módulos. Empiezas con variables y tipos, pasas por DOM y eventos, y terminas conectando con APIs reales como PokéAPI y SuperHero API. Es la mejor ruta para aprender a programar en el navegador. →igorhermoso1.github.io/IGORSCRIPT",
        () => "JavaScript es el lenguaje que hace que las páginas web cobren vida. En IGORSCRIPT lo aprendes de forma progresiva — sin saltar pasos — hasta llegar a proyectos con APIs externas. 124 ejercicios que escalan bien en dificultad.",
        () => "Si ya tienes base de HTML y CSS, JavaScript es el siguiente paso natural. IGORSCRIPT te lleva de variables básicas hasta fetch y async/await con proyectos reales. Una de las rutas más completas del hall.",
    ],

    hardware: [
        () => "IGORHARDWARE te enseña a entender y montar un PC desde cero: CPU, RAM, GPU, almacenamiento, placa base, PSU y refrigeración. Incluye simulador PC Builder, diagnóstico de averías y laboratorio 2026. →igorhermoso1.github.io/IGORHARDWARE",
        () => "En Hardware aprenderás a elegir componentes compatibles, montar un PC paso a paso, entender BIOS/UEFI y diagnosticar problemas reales. El simulador PC Builder te permite practicar presupuestos sin comprar nada.",
    ],

    redes: [
        () => "IGORREDES gamifica el networking: TCP/IP, subnetting con calculadora visual, WiFi, VLANs, routing y switching. Incluye simulador de red drag-and-drop y configurador CLI tipo Cisco. →igorhermoso1.github.io/IGORREDES",
        () => "En Redes aprenderás desde el modelo OSI hasta subnetting, VLANs, routing dinámico y WiFi 6. Lo mejor es el simulador: arrastras dispositivos, los conectas y haces ping sin hardware real.",
    ],

    server: [
        () => "IGORSERVER cubre Windows Server completo: Active Directory, DNS, DHCP, GPOs, PowerShell, VirtualBox para labs virtuales, RAID, backups y Nagios para monitorización. →igorhermoso1.github.io/IGORSERVER",
        () => "En Server montas un dominio completo con Windows Server: AD, usuarios, grupos, GPOs, DNS, DHCP y todo desde laboratorios virtuales con VirtualBox. También Ubuntu Server con Samba para integrarlo con Windows.",
    ],

    sql: [
        () => "IGOR SQL Academy usa SQLite con una consola SQL real en el navegador. Aprendes modelo relacional, SELECT avanzado, JOINs, subconsultas, normalización y practicas con BDs de Pokémon, Marvel y más. →igorhermoso1.github.io/IGORSQL",
        () => "SQL es imprescindible si quieres trabajar con datos. En IGORSQL tienes una consola real donde ejecutas consultas, bases de datos temáticas y una progresión desde CREATE TABLE hasta JOINs y subconsultas complejas.",
    ],

    cyber: [
        () => "Ciberseguridad llega pronto 🔜 Tendrá enfoque defensivo: tríada CIA, higiene digital, phishing y ingeniería social, configuración de firewalls, hardening de sistemas y respuesta a incidentes. Todo dentro del marco ético y legal.",
        () => "El módulo de Ciberseguridad está en construcción. Se centrará en protegerte y proteger sistemas, no en atacar: entender vulnerabilidades, configurar firewalls, detectar phishing, gestionar contraseñas y responder ante incidentes.",
    ],

    excel: [
        () => "Excel llega pronto 🔜 Cubrirá desde fórmulas básicas hasta las potentes BUSCARX e INDICE+COINCIDIR, tablas dinámicas con segmentadores, Power Query para ETL sin código y automatización con macros VBA.",
        () => "El módulo de Excel está en desarrollo. Será una ruta completa para dominar la herramienta ofimática más usada en empresas: funciones avanzadas, tablas dinámicas, Power Query y VBA para automatizar todo.",
    ],

    unity: [
        () => "Unity llega pronto al hall 🔜 La hoja de ruta tiene 82 temas en 7 niveles, 91 assets y 10+ vídeos. Del editor y C# básico hasta sistemas de combate, IA con NavMesh, multiplayer y realidad virtual.",
        () => "El módulo de Unity cubre el camino completo del desarrollador de videojuegos: GameObjects, C# scripting, física, Animator, UI, NavMesh para enemigos, Shader Graph, multiplayer con Netcode y VR. Próximamente disponible.",
    ],

    ia: [
        () => "IA llega pronto 🔜 Se centrará en el uso práctico: cómo funcionan los LLMs, prompt engineering, automatización con APIs (OpenAI, Anthropic), herramientas no-code como n8n y proyectos aplicados reales.",
        () => "El módulo de IA estará enfocado en usarla y construir con ella, sin matemáticas complejas: prompts efectivos, cadena de pensamiento, automatización de flujos y proyectos donde la IA resuelve problemas reales.",
    ],

    linux: [
        () => "Linux llega pronto 🔜 Cubrirá terminal desde cero, comandos básicos y avanzados, permisos, gestión de paquetes, procesos con systemctl, red en Linux y Bash scripting para automatización.",
        () => "El módulo de Linux es esencial para servidores y DevOps. Próximamente: navegación por terminal, permisos chmod, apt/dnf/pacman, scripting Bash y administración avanzada de sistemas.",
    ],

    python: [
        () => "Python llega pronto 🔜 Ruta muy práctica: desde la sintaxis básica hasta proyectos reales de automatización, análisis de datos con pandas, y APIs REST con Flask o FastAPI. El lenguaje más versátil del mercado.",
        () => "El módulo de Python cubrirá fundamentos, POO, librerías populares (pandas, requests, BeautifulSoup) y backend con Flask/FastAPI. Python abre puertas a datos, web y automatización — prácticamente indispensable.",
    ],

    react: [
        () => "React llega pronto 🔜 Aprenderás componentes funcionales, hooks (useState, useEffect, useContext), React Router, consumo de APIs y despliegue en Vercel. El estándar del frontend moderno.",
        () => "El módulo de React te llevará del JSX básico a proyectos completos: hooks, Router v6, estado global con Zustand y Tailwind CSS. La librería de UI más demandada del mercado.",
    ],

    // ── CULTURA GEEK ──────────────────────────────────────────────────────────

    onepiece: [
        () => "¡NAKAMA! One Piece es sin duda una de las obras más épicas del manga 🏴‍☠️ Oda lleva décadas construyendo un mundo increíble y la saga final está siendo brutal. Pssst: escribe 'nakama' en el teclado aquí en el hall para una sorpresa.",
        () => "La saga de Egghead está siendo una locura de nivel. Y el lore del Void Century... Oda es un genio. ¿Cuál es tu arco favorito? Y escribe 'luffy' en el teclado si quieres un easter egg 🏴‍☠️",
    ],

    dragonage: [
        () => "Dragon Age: el lore de Thedas es de los más ricos de los RPGs occidentales. Solas como villain es magistral. ¿Veilguard te convenció o te quedó corto? Escribe 'darkspawn' en el teclado para el easter egg 🐉",
        () => "La historia de los Grey Wardens, los misterios del Fade y el giro de Solas en Inquisition son de los mejores momentos en narrativa de videojuegos. Escribe 'inquisition' aquí 🐉",
    ],

    baldur: [
        () => "BG3 redefinió lo que puede ser un RPG. Larian entregó algo que parecía imposible: 174h de contenido con consecuencias reales en cada decisión. ¿Cuántas partidas llevas? Escribe 'baldur' en el teclado 🎲",
        () => "Shadowheart, Astarion, Gale... los personajes de BG3 son una locura. Y las builds son infinitas. Escribe 'dice' aquí para un easter egg especial 🎲",
    ],

    reddead: [
        () => "RDR2 es posiblemente el videojuego con la narrativa más redonda jamás creada. Arthur Morgan consigue lo que pocas veces logra un juego: emocionarte de verdad. 'I gave you all I had.' Escribe 'arthur' 🤠",
        () => "La forma en que Dutch se desintegra como personaje a lo largo del juego... es magistral. Rockstar tardó años pero entregó una obra maestra. Escribe 'reddead' para el easter egg 🤠",
    ],

    fallout: [
        () => "War. War never changes ☢️ New Vegas sigue siendo el pináculo de la saga para muchos. La libertad de decisiones y el mundo moralmente complejo... Escribe 'vault' en el teclado, o haz 3 clicks en el reloj del hall.",
        () => "La serie de Amazon Prime le dio visibilidad brutal a Fallout. Pero nada como New Vegas para los fans. ¿Cuál es tu Fallout favorito? Escribe 'fallout' para el easter egg ☢️",
    ],

    metalgear: [
        () => "Kept you waiting, huh? 📦 Metal Gear Solid es una saga única: sigilo, filosofía y narrativa rompedora. El codec de MGS1 es iconico. Escribe 'snake' en el teclado.",
        () => "Kojima predijo las fake news y las cámaras de eco en MGS2, en 2001. Una obra absolutamente adelantada a su tiempo. Escribe 'otacon' para el easter egg 📦",
    ],

    witcher: [
        () => "The Witcher 3 sigue siendo un referente del mundo abierto narrativo. Wind's howling. Y Blood & Wine como cierre casi perfecto. Escribe 'geralt' en el teclado ⚔️",
        () => "El dilema Ciri Emperatriz vs Ciri Bruja sigue siendo de los finales más discutidos de los videojuegos. Escribe 'rivia' aquí ⚔️",
    ],

    elden: [
        () => "Elden Ring es arte. La colaboración Miyazaki + GRRM resultó en el mundo abierto más denso en lore que se haya creado. ¿Has llegado a Malenia? APALACHES también tiene su nivel de dificultad 😏",
        () => "FromSoftware tiene una capacidad única para crear satisfacción a través de la dificultad. Cada boss derrotado se siente como un logro real. ¿Bloodborne o Elden Ring? El debate eterno.",
    ],

    batman: [
        () => "I am Batman 🦇 La trilogía de Nolan es cine de superhéroes al máximo nivel. El Joker de Heath Ledger es uno de los mejores villanos de la historia. Escribe 'joker' en el teclado.",
        () => "La saga Arkham de Rocksteady sigue siendo el estándar de los juegos de superhéroes. Y DC tiene algunos de los mejores villanos del cómic. Escribe 'batman' en el teclado 🦇",
    ],

    starwars: [
        () => "May the Force be with you ⭐ Andor es probablemente la mejor historia de Star Wars desde El Imperio Contraataca. ¿Qué era de la saga te gusta más? Escribe 'yoda' en el teclado.",
        () => "El debate entre trilogías de Star Wars podría durar años 😄 Pero Andor como serie es brillante. Escribe 'jedi' para un easter egg ⭐",
    ],

    pokemon: [
        () => "¡Gotta catch 'em all! ⚡ Pokémon es la franquicia de mayor éxito comercial de la historia. Y en IGORSCRIPT hay un proyecto real con la PokéAPI. Escribe 'pikachu' en el teclado.",
        () => "Mewtwo, Charizard, Gengar... cada generación tiene sus iconos. ¿Eres de la primera gen o de las más modernas? Escribe 'charizard' para el easter egg ⚡",
    ],

    matrix: [
        () => "There is no spoon 💊 The Matrix (1999) es una de esas películas que te cambia la perspectiva. Su influencia en la cultura digital sigue siendo enorme. Escribe 'redpill' en el teclado.",
        () => "La Matrix popularizó conceptos filosóficos complejos en un blockbuster de acción. 25 años después sigue siendo relevante. Escribe 'matrix' aquí 💊",
    ],

    marvel: [
        () => "¡Marvel! 🦸 Los cómics de la era Hickman (House of X, Powers of X) son de los mejores de los últimos años. Y en IGORSCRIPT hay un proyecto con la SuperHero API donde buscas héroes en tiempo real.",
        () => "El universo Marvel en cómics tiene capas que el MCU nunca ha llegado a explorar. ¿Eres más de X-Men o de Avengers? En España Panini trae las mejores colecciones.",
    ],

    padrino: [
        () => "An offer you can't refuse 🌹 El Padrino (1972) de Coppola es la película más influyente del cine moderno. Escribe 'corleone' en el teclado para un easter egg.",
        () => "'Leave the gun. Take the cannoli.' Una frase que lo dice todo. La trilogía del Padrino es cine de obligado visionado. Escribe 'padrino' en el teclado 🌹",
    ],

    pacman: [
        () => "Waka waka waka 🟡 Pac-Man (1980) es el videojuego arcade más icónico de la historia. ¡Y el hall tiene su propia zona arcade! Escribe 'pacman' en el teclado.",
        () => "Blinky, Pinky, Inky y Clyde... los cuatro fantasmas más famosos de la historia de los videojuegos. Clásico absoluto. Escribe 'waka' aquí 🟡",
    ],

    gaming: [
        () => "¡Me encantan los videojuegos! 🎮 El hall tiene su zona arcade con APALACHES. Y si te interesa crear tus propios juegos, el módulo de Unity tiene una hoja de ruta brutalmente completa. ¿Qué tipo de juegos son los que más te van?",
        () => "Los videojuegos son el arte más completo — combinan narrativa, música, diseño visual e interactividad. ¿Eres más de RPGs, shooters, estrategia...? ¡Cuéntame!",
    ],

    movies: [
        () => "Cine y series son otra pasión del hall 🎬 Mi conocimiento tiene fecha de corte (agosto 2025), así que para estrenos recientes mejor Filmaffinity o JustWatch. ¿Qué tipo de cine te va más?",
        () => "Para recomendaciones de cine clásico o ciencia ficción, pregunta sin miedo. Para estrenos de esta semana no soy el más actualizado 😄 ¿Qué estás buscando?",
    ],

};

// Respuesta genérica si no hay intención clara
const FALLBACK = [
    () => "No estoy seguro de haber pillado bien lo que me preguntas 🤔 ¿Puedes contarme un poco más? Puedo ayudarte con los módulos del hall, orientarte sobre por dónde empezar, o simplemente charlar de tecnología y cultura geek.",
    () => "Hmm, no tengo una respuesta clara para eso. Si me cuentas qué quieres conseguir — aprender algo concreto, trabajar en tech, hacer un proyecto... — te puedo orientar mucho mejor.",
    () => "No he pillado exactamente lo que buscas. ¿Me lo reformulas? O si prefieres, dime directamente qué módulo del hall te interesa y te cuento todo sobre él.",
];

// ── MOTOR PRINCIPAL ────────────────────────────────────────────────────────────

function buildReply(userText) {
    sessionMsgCount++;

    // Detectar nombre si el usuario lo dice
    const nameMatch = norm(userText).match(/(?:me llamo|soy|mi nombre es)\s+([a-z]+)/);
    if(nameMatch) userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);

    // Detectar intención y tema
    const intent  = detectIntent(userText);
    const topic   = detectTopic(userText);

    // Actualizar contexto de tema
    if(topic) chatTopic = topic;

    // Obtener respuesta
    let responseArr = null;

    if(intent && RESPONSES[intent]) {
        responseArr = RESPONSES[intent];
    } else if(topic && RESPONSES[topic]) {
        responseArr = RESPONSES[topic];
    } else if(chatTopic && sessionMsgCount > 1) {
        // Seguimiento contextual: el usuario sigue hablando del mismo tema
        const followups = {
            "html":  ["¿Qué parte del HTML o CSS te genera más dudas?","¿Ya estás dentro de IGORCADEMIA o quieres el enlace directo?"],
            "js":    ["¿En qué parte de JavaScript estás ahora mismo?","¿Tienes ya base de HTML y CSS o empiezas desde cero?"],
            "sql":   ["¿Qué concepto de SQL te está costando más?","¿Ya has probado la consola SQL de IGORSQL?"],
            "redes": ["¿En qué parte de redes te estás quedando bloqueado?","¿Has probado el simulador de red de IGORREDES?"],
            "server":["¿Qué parte de Server te interesa más: Active Directory, PowerShell, backups...?","¿Estás montando el laboratorio en VirtualBox?"],
            "unity": ["Unity cubre muchas áreas — ¿te interesa más el gameplay, la UI, la IA de enemigos o algo concreto?","¿Ya tienes base de C# o partes desde cero?"],
        };
        if(followups[chatTopic]) {
            return pick(followups[chatTopic]);
        }
    }

    if(!responseArr) responseArr = FALLBACK;

    // Rotar respuestas para no repetir
    const key = intent || topic || "fallback";
    if(!buildReply._idx) buildReply._idx = {};
    const idx = buildReply._idx[key] || 0;
    buildReply._idx[key] = (idx + 1) % responseArr.length;
    const fn = responseArr[idx % responseArr.length];

    return fn();
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

        // Pequeño delay para naturalidad
        setTimeout(() => {
            setMode("talk", 2200);
            addMsg(buildReply(userText));
        }, 280);
    });
}
