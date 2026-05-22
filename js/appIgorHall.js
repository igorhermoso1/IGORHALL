// appIgorHall.js — IgorHall v1.2

// ============================
// INTRO + BOOT
// ============================

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
    setTimeout(() => {
        const introScreen = document.getElementById("introScreen");
        if(introScreen) introScreen.classList.add("is-done");
        document.body.classList.remove("is-loading");
        document.body.classList.add("intro-complete");
        loadProfile();
    }, 2600);
});

// ============================
// RELOJ DIGITAL
// ============================

function updateClock(){
    const now = new Date();
    document.getElementById("clock").textContent =
        `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
}
setInterval(updateClock, 1000);
updateClock();

// ============================
// TÍTULO DINÁMICO
// ============================

const titles = ["IGOR HALL","INSERT COIN","READY PLAYER ONE","LOADING KNOWLEDGE..."];
let titleIndex = 0;
setInterval(() => {
    document.title = titles[titleIndex];
    titleIndex = (titleIndex + 1) % titles.length;
}, 2500);

// ============================
// EFECTO SPOTLIGHT EN CARDS
// ============================

const cards = document.querySelectorAll(".card");
cards.forEach((card, cardIndex) => {
    card.style.setProperty("--card-index", cardIndex + 1);
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px,var(--spot-color,rgba(127,220,255,0.18)),rgba(255,255,255,0.04) 45%)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.background = `linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))`;
    });
});

// Cards de proximamente abren el modal en su pestaña
document.querySelectorAll("[data-assistant-topic]").forEach(card => {
    card.addEventListener("click", event => {
        event.preventDefault();
        const topic = card.dataset.assistantTopic;
        const validTabs = ["html","javascript","hardware","redes","server","cyber","sql","unity","ia","linux","python","react"];
        if(validTabs.includes(topic)){
            openInfoModal(topic);
        } else {
            openAssistant();
        }
    });
});

// ============================
// MODAL DE INFORMACIÓN
// ============================

const infoModal       = document.getElementById("infoModal");
const openInfoButton  = document.getElementById("openInfoModal");
const closeModalBtns  = document.querySelectorAll("[data-close-modal]");
const tabButtons      = document.querySelectorAll(".tab-button");
const tabPanels       = document.querySelectorAll(".tab-panel");

function openInfoModal(tabName = "html"){
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

function activateTab(tabName){
    tabButtons.forEach(btn => {
        const active = btn.dataset.tab === tabName;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
    });
    tabPanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === `tab-${tabName}`);
    });
}

if(openInfoButton) openInfoButton.addEventListener("click", () => openInfoModal());
closeModalBtns.forEach(btn => btn.addEventListener("click", closeInfoModal));
tabButtons.forEach(btn => btn.addEventListener("click", () => activateTab(btn.dataset.tab)));

document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
        if(infoModal && infoModal.classList.contains("is-open")) closeInfoModal();
        if(profilePanel && profilePanel.classList.contains("is-open")) closeProfilePanel();
    }
});

// ============================
// PERFIL DE USUARIO
// ============================

const profilePanel    = document.getElementById("profilePanel");
const profileOverlay  = document.getElementById("profilePanelOverlay");
const openProfileBtn  = document.getElementById("openProfilePanel");
const closeProfileBtn = document.getElementById("closeProfilePanel");
const saveProfileBtn  = document.getElementById("saveProfile");
const clearProfileBtn = document.getElementById("clearProfile");
const profileError    = document.getElementById("profileError");
const greetingBadge   = document.getElementById("greetingBadge");

function openProfilePanel(){
    if(!profilePanel) return;
    profilePanel.classList.add("is-open");
    profileOverlay.classList.add("is-open");
    profilePanel.setAttribute("aria-hidden","false");
}

function closeProfilePanel(){
    if(!profilePanel) return;
    profilePanel.classList.remove("is-open");
    profileOverlay.classList.remove("is-open");
    profilePanel.setAttribute("aria-hidden","true");
}

function showGreeting(name){
    if(!greetingBadge || !name) return;
    greetingBadge.textContent = `¡Hola, ${name}! 👾`;
    greetingBadge.classList.add("visible");
}

function loadProfile(){
    try {
        const saved = localStorage.getItem("igorhall_profile");
        if(!saved) return;
        const data = JSON.parse(saved);
        if(data.name)     document.getElementById("profileName").value     = data.name;
        if(data.email)    document.getElementById("profileEmail").value    = data.email;
        if(data.phone)    document.getElementById("profilePhone").value    = data.phone;
        if(data.location) document.getElementById("profileLocation").value = data.location;
        if(data.source)   document.getElementById("profileSource").value   = data.source;
        if(data.contact)  document.getElementById("profileContact").value  = data.contact;
        if(data.name) showGreeting(data.name);
    } catch(e){}
}

if(openProfileBtn)  openProfileBtn.addEventListener("click", openProfilePanel);
if(closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfilePanel);
if(profileOverlay)  profileOverlay.addEventListener("click", closeProfilePanel);

if(saveProfileBtn){
    saveProfileBtn.addEventListener("click", () => {
        profileError.textContent = "";
        const name     = document.getElementById("profileName").value.trim();
        const email    = document.getElementById("profileEmail").value.trim();
        const phone    = document.getElementById("profilePhone").value.trim();
        const location = document.getElementById("profileLocation").value.trim();
        const source   = document.getElementById("profileSource").value;
        const contact  = document.getElementById("profileContact").value.trim();

        if(!name){
            profileError.textContent = "⚠ El nombre es obligatorio.";
            document.getElementById("profileName").focus(); return;
        }
        if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            profileError.textContent = "⚠ Introduce un email válido.";
            document.getElementById("profileEmail").focus(); return;
        }
        if(!phone){
            profileError.textContent = "⚠ El teléfono es obligatorio.";
            document.getElementById("profilePhone").focus(); return;
        }
        const profile = { name, email, phone, location, source, contact };
        try { localStorage.setItem("igorhall_profile", JSON.stringify(profile)); } catch(e){}
        showGreeting(name);
        closeProfilePanel();
    });
}

if(clearProfileBtn){
    clearProfileBtn.addEventListener("click", () => {
        try { localStorage.removeItem("igorhall_profile"); } catch(e){}
        ["profileName","profileEmail","profilePhone","profileLocation","profileContact"]
            .forEach(id => { document.getElementById(id).value = ""; });
        document.getElementById("profileSource").value = "";
        if(greetingBadge){ greetingBadge.textContent = ""; greetingBadge.classList.remove("visible"); }
        profileError.textContent = "Datos borrados correctamente.";
        setTimeout(() => { profileError.textContent = ""; }, 2500);
    });
}

// ============================
// ASISTENTE — SPRITES
// ============================

const assistant         = document.getElementById("virtualAssistant");
const assistantAvatar   = document.getElementById("assistantAvatar");
const assistantSprite   = document.getElementById("assistantSprite");
const assistantChat     = document.getElementById("assistantChat");
const assistantClose    = document.getElementById("assistantClose");
const assistantForm     = document.getElementById("assistantForm");
const assistantInput    = document.getElementById("assistantInput");
const assistantMessages = document.getElementById("assistantMessages");

const assistantFrames = {
    idle: ["assets/avatar/idl1.png","assets/avatar/idl2.png","assets/avatar/idl3.png","assets/avatar/idl2.png"],
    talk: ["assets/avatar/saludo1.png","assets/avatar/saludo2.png","assets/avatar/saludo3.png"]
};

let assistantMode       = "idle";
let assistantFrameIndex = 0;
let assistantTalkTimer;

function setAssistantMode(mode, duration = 0){
    assistantMode       = mode;
    assistantFrameIndex = 0;
    if(assistantTalkTimer) clearTimeout(assistantTalkTimer);
    if(duration){
        assistantTalkTimer = setTimeout(() => {
            assistantMode       = "idle";
            assistantFrameIndex = 0;
        }, duration);
    }
}

setInterval(() => {
    if(!assistantSprite) return;
    const frames = assistantFrames[assistantMode] || assistantFrames.idle;
    assistantSprite.src = frames[assistantFrameIndex % frames.length];
    assistantFrameIndex++;
}, 280);

function openAssistant(){
    if(!assistant) return;
    assistant.classList.add("is-open");
    assistantChat.setAttribute("aria-hidden","false");
    setAssistantMode("talk", 900);
    setTimeout(() => { if(assistantInput) assistantInput.focus(); }, 150);
}

function addAssistantMessage(text, type = "bot"){
    if(!assistantMessages) return;
    const msg = document.createElement("p");
    msg.className = `assistant-message ${type}`;
    msg.textContent = text;
    assistantMessages.appendChild(msg);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

// ============================
// MOTOR DE BÚSQUEDA DEL CHATBOT
// Estrategia: coincidencia de palabras completas + score acumulado
// ============================

function normalizeText(text){
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s#+./-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Rodea una keyword con límites de palabra para búsqueda exacta
// Frases compuestas ("css grid") se tratan como secuencia de palabras contiguas
function buildRegex(keyword){
    const escaped = normalizeText(keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Si la keyword tiene espacios, buscamos la secuencia completa
    return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
}

// Devuelve el número de keywords que matchean (score)
function scoreEntry(entry, q){
    let score = 0;
    for(const kw of entry.keywords){
        if(buildRegex(kw).test(q)) score++;
    }
    return score;
}

function getAssistantAnswer(question){
    const q = normalizeText(question);

    let bestEntry = null;
    let bestScore = 0;

    for(const entry of assistantKnowledge){
        const score = scoreEntry(entry, q);
        if(score > bestScore){
            bestScore = score;
            bestEntry = entry;
        }
        // Desempate: si igual score, gana mayor priority
        else if(score === bestScore && score > 0 && entry.priority > (bestEntry ? bestEntry.priority : -Infinity)){
            bestEntry = entry;
        }
    }

    // Exigimos al menos 1 match real
    return (bestScore > 0 && bestEntry) ? bestEntry.answer : "";
}

// ============================
// BASE DE CONOCIMIENTO
// Keywords = términos EXACTOS que deben aparecer como palabras completas
// ============================

const assistantKnowledge = [

    // ── META / SISTEMA ────────────────────────────────────────────────────────
    {
        priority: 1000,
        keywords: ["hola","buenas","ey","saludos","hello","hey","ayuda","igorbot","asistente","chatbot","que puedes","como funciona","preguntar"],
        answer: "¡Hola! Soy IgorBot 👾 Pregúntame por cualquier módulo de IgorHall: HTML, CSS, JavaScript, Hardware, Redes, Server, SQL, Unity, Ciberseguridad, Linux, Python o React. También te puedo decir por dónde empezar."
    },
    {
        priority: 995,
        keywords: ["por donde empezar","empezar","ruta","itinerario","secuencia","orden","primero","recomendacion","hoja de ruta","roadmap","aprender primero"],
        answer: "Ruta recomendada: 1→ HTML & CSS · 2→ JavaScript · 3→ Hardware · 4→ Redes · 5→ Server · 6→ Linux · 7→ Python · 8→ SQL · 9→ Ciberseguridad · 10→ React · 11→ Unity · 12→ IA. Si ya programas puedes saltar a SQL, Unity o React directamente."
    },
    {
        priority: 990,
        keywords: ["que hay","que tiene","contenido","modulos","secciones","igorhall","encontrar","cuantos","cuantas","ofrece","que puedo"],
        answer: "IgorHall tiene 12 módulos: HTML & CSS, JavaScript, Hardware, Redes, Server, Ciberseguridad, SQL, Unity, IA, Linux, Python y React. Más la zona de juego APALACHES. Pulsa el botón 'I' para ver el detalle de cada uno."
    },
    {
        priority: 985,
        keywords: ["gratis","precio","cuesta","pago","gratuito","libre","suscripcion"],
        answer: "Todo el contenido de IgorHall es gratuito y de acceso libre a través de GitHub Pages. Solo necesitas el enlace."
    },
    {
        priority: 980,
        keywords: ["gamificacion","igorpoints","xp","logros","badges","racha","progreso","puntos","recompensas"],
        answer: "Varios módulos tienen gamificación: IgorPoints o XP por ejercicios, rachas, logros y badges. Cada academia gestiona su propio progreso de forma independiente."
    },
    {
        priority: 975,
        keywords: ["perfil","mis datos","guardar datos","registro","nombre usuario"],
        answer: "Pulsa el icono de persona (arriba derecha) para crear tu perfil: nombre, email y teléfono son obligatorios. Al guardar, aparecerá tu nombre en la cabecera con un saludo personalizado."
    },
    {
        priority: 970,
        keywords: ["apalaches","juego","survival","paranoia","descanso","entretenimiento"],
        answer: "APALACHES está al final del hall, en la zona de juego. Porque no todo va a ser estudiar. Entra y descúbrelo 🎮"
    },
    {
        priority: 965,
        keywords: ["boton i","ventana info","modal","informacion","pestanas","tabs","resumen modulo"],
        answer: "El botón 'I' (naranja palpitante, arriba a la derecha) abre la ventana de información con pestañas para cada módulo: descripción, estadísticas y los 8 bloques de contenido de cada uno."
    },

    // ── HTML & CSS ────────────────────────────────────────────────────────────
    {
        priority: 900,
        keywords: ["html css","igorcademia","html y css","diseno web","maquetacion","pagina web","frontend","paginas web"],
        answer: "IGORCADEMIA cubre HTML & CSS desde cero: 70+ ejercicios en 17 módulos, editores en vivo, IgorPoints, logros, retos visuales y una ruta completa para construir páginas reales. → igorhermoso1.github.io/IGORCADEMIA"
    },
    {
        priority: 895,
        keywords: ["estructura html","doctype","etiqueta html","head","body","charset","viewport","metadatos"],
        answer: "Estructura HTML: DOCTYPE, elemento html con lang, head (charset UTF-8, viewport, title, meta description), body y la jerarquía correcta. Aprenderás a escribir documentos HTML válidos desde la primera línea."
    },
    {
        priority: 890,
        keywords: ["semantica html","etiqueta semantica","header tag","nav tag","article","section","footer tag","aside","accesibilidad html"],
        answer: "Semántica HTML: header, nav, main, article, section, footer, aside, figure, figcaption. Código que entienden navegadores, lectores de pantalla y Google. Mejora accesibilidad y SEO."
    },
    {
        priority: 885,
        keywords: ["formulario html","form","etiqueta input","textarea","select html","checkbox","radio button","label","validacion html","required"],
        answer: "Formularios HTML: form, input (text, email, number, password, date, range), select, textarea, checkbox, radio, label, required, pattern y validación nativa del navegador sin JavaScript."
    },
    {
        priority: 880,
        keywords: ["selectores css","especificidad css","cascada css","herencia css","box model","margin css","padding css","border css"],
        answer: "CSS base: selectores (tipo, clase, ID, combinadores >, +, ~), especificidad, cascada, herencia y el box model completo (content, padding, border, margin). La lógica que hay detrás de cada estilo."
    },
    {
        priority: 875,
        keywords: ["colores css","hex css","rgb css","hsl css","rgba css","gradiente css","linear gradient","radial gradient"],
        answer: "Colores CSS: formatos HEX (#ff0000), RGB(255,0,0), RGBA, HSL y HSLA. Gradientes con linear-gradient, radial-gradient y conic-gradient con múltiples paradas y ángulos."
    },
    {
        priority: 870,
        keywords: ["flexbox","display flex","justify content","align items","flex direction","flex wrap","flex grow","flex basis"],
        answer: "Flexbox: display:flex, flex-direction (row/column), justify-content, align-items, align-self, flex-wrap, gap, order, flex-grow/shrink/basis. Layouts en una dimensión de forma sencilla."
    },
    {
        priority: 865,
        keywords: ["css grid","display grid","grid template","grid area","grid column","grid row","auto fit","auto fill","minmax"],
        answer: "CSS Grid: display:grid, grid-template-columns/rows, grid-area con nombres, auto-fit y auto-fill con minmax(), fr, gap. Layouts bidimensionales complejos con pocas líneas."
    },
    {
        priority: 860,
        keywords: ["responsive css","media query","mobile first","breakpoint","clamp css","unidades fluidas","vw css","vh css"],
        answer: "Responsive: mobile-first con media queries (min-width), unidades fluidas (%, vw, vh), clamp() para tipografía adaptable, em/rem. Diseños que funcionan en cualquier dispositivo."
    },
    {
        priority: 855,
        keywords: ["hover css","transicion css","transformacion css","rotate css","scale css","keyframes","animacion css","animation css"],
        answer: "Interacción visual: :hover, :focus, :nth-child, transiciones (transition: all 0.3s ease), transformaciones (rotate, scale, translate, skew) y animaciones con @keyframes + animation."
    },
    {
        priority: 850,
        keywords: ["variables css","custom property","var css","root css","dark mode css","tema css"],
        answer: "Variables CSS: :root{ --color-primary: #7fdcff; } y úsalas con var(--color-primary). Base para sistemas de diseño, temas dinámicos y dark mode sin duplicar código."
    },
    {
        priority: 845,
        keywords: ["filter css","blur css","backdrop filter","mix blend mode","clip path","efecto visual css"],
        answer: "Efectos visuales CSS: filter (blur, brightness, contrast, saturate, drop-shadow), backdrop-filter para glassmorphism, clip-path para recortes y mix-blend-mode para capas creativas."
    },
    {
        priority: 840,
        keywords: ["google fonts","tipografia css","font family","font weight","letter spacing","line height","fuentes web"],
        answer: "Tipografía CSS: Google Fonts con link o @import, font-family stack, font-weight (100-900), line-height, letter-spacing, text-transform y cómo crear jerarquías tipográficas profesionales."
    },

    // ── JAVA (sin confundir con JavaScript) ──────────────────────────────────
    {
        priority: 850,
        keywords: ["java"],
        answer: "IgorHall no tiene módulo de Java. Si buscas JavaScript (JS), el lenguaje del navegador, está en IGORSCRIPT. Si buscas Java (el lenguaje de Oracle), no está disponible aún."
    },

    // ── JAVASCRIPT ────────────────────────────────────────────────────────────
    {
        priority: 800,
        keywords: ["javascript","igorscript","programacion javascript","aprender javascript","js"],
        answer: "IGORSCRIPT enseña JavaScript práctico: 124 ejercicios en 12 módulos, de variables y tipos hasta APIs reales (PokéAPI, SuperHero API). Enfoque visual e interactivo. → igorhermoso1.github.io/IGORSCRIPT"
    },
    {
        priority: 795,
        keywords: ["variables javascript","let","const","var javascript","tipo dato","typeof","template literal","string js","number js","boolean js"],
        answer: "Variables JS: var (función scope, evitar), let (bloque scope), const (no reasignable). Tipos: string, number, boolean, null, undefined, symbol. typeof para verificar. Template literals con backticks y ${}."
    },
    {
        priority: 790,
        keywords: ["operadores javascript","operador aritmetico","operador comparacion","operador logico","ternario javascript","nullish coalescing","operador &&","operador ||"],
        answer: "Operadores JS: aritméticos (+,-,*,/,%,**), comparación (===, !==, >, <, >=, <=), lógicos (&&, ||, !), ternario (cond ? a : b), nullish coalescing (??) y optional chaining (?.)."
    },
    {
        priority: 785,
        keywords: ["dom javascript","queryselector","queryselectorall","getelementbyid","innerhtml","textcontent","dataset","atributo js"],
        answer: "DOM: document.querySelector, querySelectorAll, getElementById, getElementsByClassName. Leer y modificar con innerHTML, textContent, getAttribute, setAttribute y dataset para atributos data-*."
    },
    {
        priority: 780,
        keywords: ["eventos javascript","addeventlistener","evento click","evento submit","evento input","keydown","preventdefault","stoppropagation"],
        answer: "Eventos: addEventListener('click', fn), 'input', 'change', 'submit', 'keydown', 'keyup', 'focus', 'blur'. event.preventDefault() para cancelar defaults. stopPropagation() para detener la burbuja."
    },
    {
        priority: 775,
        keywords: ["condicionales javascript","if else","switch javascript","else if","operador ternario js"],
        answer: "Control de flujo: if/else if/else para condiciones, switch/case/default para múltiples valores. Operador ternario (condicion ? valorSi : valorNo) para asignaciones cortas y concisas."
    },
    {
        priority: 770,
        keywords: ["bucles javascript","for javascript","while javascript","foreach javascript","for of","for in","break js","continue js"],
        answer: "Bucles JS: for clásico (i=0; i<n; i++), while, do...while, forEach para arrays, for...of para iterables, for...in para objetos. break para salir, continue para saltar iteración."
    },
    {
        priority: 765,
        keywords: ["funciones javascript","arrow function","parametros js","return js","scope javascript","closure javascript","callback javascript"],
        answer: "Funciones: function declaration, function expression, arrow functions (=>). Parámetros con defaults, rest (...args), return, scope léxico, closures y callbacks como argumentos de otras funciones."
    },
    {
        priority: 760,
        keywords: ["arrays javascript","metodos array","push js","pop js","map javascript","filter javascript","find javascript","reduce javascript","splice js","slice js"],
        answer: "Arrays JS: push/pop/shift/unshift para añadir y quitar; map() para transformar; filter() para filtrar; find() para buscar el primero; reduce() para acumular; splice para cortar; slice para copiar."
    },
    {
        priority: 755,
        keywords: ["objetos javascript","object js","propiedad objeto","metodo objeto","this javascript","spread operator","destructuring javascript","object keys"],
        answer: "Objetos: creación literal {}, acceso con punto y []; this en métodos; spread ({...obj}) para copiar/combinar; destructuring ({name, age} = obj); Object.keys(), values(), entries() para iterar."
    },
    {
        priority: 750,
        keywords: ["classlist javascript","classlist add","classlist toggle","classlist remove","estilo js","createelement","appendchild","render dinamico"],
        answer: "DOM dinámico: classList.add/remove/toggle/contains(), element.style.property para estilos inline, createElement para crear nodos, appendChild/prepend/insertBefore para insertarlos, remove() para borrarlos."
    },
    {
        priority: 745,
        keywords: ["fetch javascript","fetch","async await","promesas javascript","promesas","promise js","then catch","json javascript","peticion http","api fetch"],
        answer: "Asincronía: fetch(url) devuelve una Promise. Con .then/.catch (clásico) o async/await (moderno). response.json() para parsear. try/catch para errores. Estados de carga para la UI."
    },
    {
        priority: 740,
        keywords: ["pokeapi","pokemon api","superhero api","api publica javascript","proyecto javascript","cards dinamicas"],
        answer: "Proyectos JS con APIs reales: PokéAPI para buscar Pokémon con stats, imágenes y tipos; SuperHero API para héroes con filtros. Tarjetas dinámicas y buscadores visuales construidos desde cero."
    },
    {
        priority: 735,
        keywords: ["localstorage javascript","sessionstorage","persistencia javascript","guardar navegador","setitem","getitem"],
        answer: "Almacenamiento local: localStorage (persiste al cerrar) y sessionStorage (solo sesión). setItem/getItem/removeItem. JSON.stringify para guardar objetos, JSON.parse para leerlos."
    },

    // ── HARDWARE ──────────────────────────────────────────────────────────────
    {
        priority: 700,
        keywords: ["hardware","igorhardware","componentes pc","montar pc","ensamblar pc","ordenador","piezas pc"],
        answer: "IGORHARDWARE: aprende a entender y montar un PC completo. Componentes, compatibilidad, diagnóstico, BIOS, SO, virtualización y laboratorio 2026 con IA integrada. → igorhermoso1.github.io/IGORHARDWARE"
    },
    {
        priority: 695,
        keywords: ["cpu","procesador","intel core","amd ryzen","nucleos cpu","hilos cpu","cache cpu","socket cpu","lga1700","am5"],
        answer: "CPU: núcleos, hilos, caché L1/L2/L3, velocidad GHz, generaciones Intel (i3/i5/i7/i9) y AMD (Ryzen 3/5/7/9), sockets LGA1700 e AM5, TDP y criterios de elección según uso."
    },
    {
        priority: 690,
        keywords: ["memoria ram","ddr4","ddr5","frecuencia ram","latencia ram","dual channel","xmp ram","sodimm"],
        answer: "RAM: DDR4 y DDR5, frecuencias (3200–6400 MHz), latencias CL, configurar dual channel para más ancho de banda, activar XMP/EXPO en BIOS. DIMM para escritorio, SO-DIMM para portátil."
    },
    {
        priority: 685,
        keywords: ["ssd nvme","disco duro","ssd sata","almacenamiento pc","hdd vs ssd","m2 nvme","velocidad disco"],
        answer: "Almacenamiento: HDD (magnético, económico, lento), SSD SATA (550 MB/s), SSD NVMe M.2 (hasta 7000 MB/s). Elige NVMe para el sistema operativo y SSD SATA o HDD para almacenamiento masivo."
    },
    {
        priority: 680,
        keywords: ["gpu","tarjeta grafica","nvidia rtx","amd rx","vram gpu","gddr6","gaming gpu","renderizado gpu"],
        answer: "GPU: integrada (iGPU) para ofimática, dedicada para gaming/diseño. NVIDIA RTX y AMD RX, VRAM GDDR6/GDDR7, resoluciones 1080p/1440p/4K, TDP y cómo detectar cuello de botella con la CPU."
    },
    {
        priority: 675,
        keywords: ["placa base","motherboard","chipset placa","formato atx","formato matx","ranura pcie","slot m2"],
        answer: "Placa base: chipsets Intel (B760, Z790) y AMD (B650, X670), sockets, formatos ATX/mATX/ITX, ranuras PCIe x16 para GPU, slots M.2 para NVMe, fases VRM para estabilidad de la CPU."
    },
    {
        priority: 670,
        keywords: ["fuente alimentacion","psu","certificacion 80plus","fuente modular","vatios psu","conector pcie psu"],
        answer: "PSU: certificaciones 80 Plus (Bronze, Gold, Platinum, Titanium), modular vs semimodular, calcular vatios reales, conector ATX 24 pin, EPS 8 pin CPU, PCIe 8/16 pin para GPU."
    },
    {
        priority: 665,
        keywords: ["refrigeracion pc","cooler cpu","disipador cpu","refrigeracion liquida","aio","pasta termica","temperatura cpu"],
        answer: "Refrigeración: disipadores de torre (Noctua, be quiet!, DeepCool), AIO 240/360 mm, pasta térmica (aplicación correcta), control PWM de ventiladores, temperaturas seguras y límites de throttling."
    },
    {
        priority: 660,
        keywords: ["bios uefi","post bios","arranque pc","boot order","actualizar bios","cmos reset","xmp bios"],
        answer: "BIOS/UEFI: POST al encender, entrar pulsando DEL/F2, boot order para elegir dispositivo de arranque, activar XMP/EXPO para la RAM, Q-Flash/EZ Flash para actualizar firmware, jumper CMOS para resetear."
    },
    {
        priority: 655,
        keywords: ["compatibilidad pc","cuello botella","presupuesto pc","pcpartpicker","socket compatible","generacion ram compatible"],
        answer: "Compatibilidad: socket CPU con placa base, generación de RAM, cuello de botella GPU/CPU (usa GamersNexus o PCPartPicker), TDP del cooler vs la CPU y vatios reales de la PSU con margen del 20%."
    },
    {
        priority: 650,
        keywords: ["diagnostico pc","pc no enciende","pantalla negra pc","pitido bios","bsod windows","temperatura alta","pc se reinicia"],
        answer: "Diagnóstico: no enciende → revisar PSU, RAM y CPU; pantalla negra → GPU, RAM o SO; pitidos BIOS → manual de la placa; BSOD → driver, RAM o sobrecalentamiento; monitorizar con HWiNFO64."
    },
    {
        priority: 645,
        keywords: ["pc builder","simulador pc","armar pc virtual","configurar presupuesto pc"],
        answer: "El simulador PC Builder de IGORHARDWARE te deja elegir piezas de un catálogo real, comprobar compatibilidad, calcular consumo y ajustar el presupuesto antes de comprar nada."
    },
    {
        priority: 640,
        keywords: ["virtualizacion hardware","hipervisor","hyper v","vmware workstation","wsl2","vt-x","amd-v"],
        answer: "Virtualización: hipervisores tipo 1 (Hyper-V, ESXi) y tipo 2 (VMware Workstation, VirtualBox). WSL2 para Linux en Windows. Requiere VT-x (Intel) o AMD-V activado en BIOS."
    },

    // ── REDES ─────────────────────────────────────────────────────────────────
    {
        priority: 600,
        keywords: ["redes","igorredes","networking","red informatica","redes informaticas","conectividad red"],
        answer: "IGORREDES: networking gamificado con fundamentos, TCP/IP, subnetting, WiFi, VLANs, routing, switching, simulador de red drag & drop, mapas lógicos y configurador CLI estilo Cisco. → igorhermoso1.github.io/IGORREDES"
    },
    {
        priority: 595,
        keywords: ["modelo osi","capas osi","capa fisica osi","capa enlace","capa transporte","capa aplicacion osi"],
        answer: "Modelo OSI 7 capas: 1-Física, 2-Enlace de datos, 3-Red, 4-Transporte, 5-Sesión, 6-Presentación, 7-Aplicación. Cada capa tiene protocolos específicos y se relaciona con el modelo TCP/IP de 4 capas."
    },
    {
        priority: 590,
        keywords: ["protocolo tcp","protocolo udp","protocolo icmp","protocolo arp","suite tcp ip","protocolo http","protocolo ftp","protocolo ssh redes"],
        answer: "TCP/IP: TCP (fiable, orientado a conexión, 3-way handshake), UDP (rápido, sin confirmación), ICMP (ping/traceroute), ARP (IP→MAC), HTTP/HTTPS, FTP/SFTP, SSH, DNS, DHCP."
    },
    {
        priority: 585,
        keywords: ["direccion ip","ipv4","ipv6 redes","mascara subred","clase red","red privada","loopback ip","broadcast ip","cidr"],
        answer: "IPv4: clases A/B/C, privadas (10.x.x.x, 172.16-31.x.x, 192.168.x.x), loopback (127.0.0.1), broadcast. Notación CIDR /24 = 255.255.255.0. IPv6 para escasez de direcciones."
    },
    {
        priority: 580,
        keywords: ["subnetting","subneteo","calcular subredes","vlsm","dividir red","mascara variable","hosts por subred"],
        answer: "Subnetting: dividir una red con CIDR, calcular hosts disponibles (2ⁿ-2), número de subredes (2ᵐ), máscara en decimal y binario, VLSM para tamaños distintos. Usa la calculadora visual de IGORREDES."
    },
    {
        priority: 575,
        keywords: ["wifi redes","inalambrico","802.11","banda 2.4ghz","banda 5ghz","wpa3","ssid","punto de acceso","mesh wifi"],
        answer: "WiFi: 802.11n/ac/ax (WiFi 4/5/6), bandas 2.4 GHz (alcance) vs 5/6 GHz (velocidad), SSID, canales, WPA2/WPA3, puntos de acceso, sistemas mesh para cobertura amplia y planificación de señal."
    },
    {
        priority: 570,
        keywords: ["vlan","segmentacion red","trunk vlan","access vlan","dot1q","switch gestionable","intervlan routing"],
        answer: "VLANs: segmentar la red lógicamente sin cambiar el cableado. Puertos access (un dispositivo) vs trunk (etiquetado 802.1Q entre switches). Inter-VLAN routing con router-on-a-stick o switch capa 3."
    },
    {
        priority: 565,
        keywords: ["router redes","routing","enrutamiento","tabla enrutamiento","ruta estatica","protocolo ospf","protocolo rip","nat","gateway"],
        answer: "Routing: el router decide el camino de cada paquete por su tabla de enrutamiento. Rutas estáticas (manuales), dinámicas (RIP, OSPF, BGP), NAT para IPs privadas, gateway por defecto."
    },
    {
        priority: 560,
        keywords: ["switch redes","switching","tabla mac","spanning tree","stp redes","dominio colision"],
        answer: "Switching: operación en capa 2, tabla de MACs aprendida dinámicamente, flooding/forwarding/filtering. Spanning Tree (STP/RSTP) evita bucles. Full-duplex elimina colisiones vs half-duplex."
    },
    {
        priority: 555,
        keywords: ["simulador red","topologia red","arrastrar router","ping simulado","mapa red","plano red"],
        answer: "Simulador de red de IGORREDES: arrastra routers, switches y PCs, conéctalos con cables, asigna IPs y haz ping entre equipos. Editor de planos para planificar instalaciones con WiFi y cableado."
    },
    {
        priority: 550,
        keywords: ["cisco ios","cli cisco","enable cisco","configure terminal","show running config","no shutdown"],
        answer: "Configurador tipo Cisco IOS: enable → configure terminal → interface gi0/0 → ip address x.x.x.x mask → no shutdown → exit → show ip interface brief. Lecciones guiadas y modo libre para practicar."
    },

    // ── SERVER ────────────────────────────────────────────────────────────────
    {
        priority: 500,
        keywords: ["server","igorserver","servidor","administracion sistemas","sysadmin","windows server"],
        answer: "IGORSERVER: Windows Server, Active Directory, DNS, DHCP, GPOs, PowerShell, VirtualBox, RAID, backups, Ubuntu Server, Samba y monitorización con Nagios. → igorhermoso1.github.io/IGORSERVER"
    },
    {
        priority: 495,
        keywords: ["windows server rol","server manager","roles servidor","features servidor","rdp servidor","escritorio remoto servidor"],
        answer: "Windows Server: instalación, Server Manager, roles (AD DS, DNS, DHCP, IIS, File Server, Print Server, Hyper-V), características, RDP para gestión remota y activación de licencias."
    },
    {
        priority: 490,
        keywords: ["active directory","ad ds","directorio activo","controlador dominio","unirse dominio","bosque ad","arbol ad"],
        answer: "Active Directory: instalar rol AD DS, promover a DC, crear dominio, estructura árbol/bosque, unir equipos al dominio con credenciales de admin, herramientas ADUC (usuarios y equipos) y ADSI Edit."
    },
    {
        priority: 485,
        keywords: ["usuarios active directory","grupos ad","ou active directory","unidad organizativa","cuentas ad","deshabilitar cuenta","resetear password ad"],
        answer: "AD – Usuarios y grupos: crear/modificar/deshabilitar cuentas, grupos de seguridad y distribución, OUs para delegar administración, propiedades de cuenta (login, horario, perfil) y reseteo de contraseñas."
    },
    {
        priority: 480,
        keywords: ["gpo","politica grupo","group policy","gpmc","gpupdate","gpresult","politica contrasena","politica bloqueo"],
        answer: "GPOs: GPMC para crear y vincular políticas a OUs, gpupdate /force para aplicar, gpresult /r para verificar. Políticas de contraseña (longitud, complejidad, expiración), bloqueo de cuenta y configuración de escritorio."
    },
    {
        priority: 475,
        keywords: ["dns servidor","zona dns","registro dns","registro a","cname dns","mx dns","nslookup","forwarder dns"],
        answer: "DNS en Server: zonas directas e inversas, registros A (nombre→IP), CNAME (alias), MX (correo), PTR (IP→nombre), NS, SOA. Reenviadores para resolución externa. Diagnóstico con nslookup y ipconfig /flushdns."
    },
    {
        priority: 470,
        keywords: ["dhcp servidor","concesion dhcp","ambito dhcp","reserva dhcp","pool dhcp","opciones dhcp","scope dhcp"],
        answer: "DHCP: ámbito con rango de IPs, exclusiones para IPs manuales, reservas por MAC para IPs fijas, opciones de ámbito (003 gateway, 006 DNS, 015 dominio), autorización en AD y monitoreo de concesiones."
    },
    {
        priority: 465,
        keywords: ["virtualbox servidor","maquina virtual server","vm server","snapshot server","red interna virtualbox","bridged virtualbox"],
        answer: "VirtualBox para laboratorio: crea VMs de Windows Server, Windows 10/11 y Ubuntu Server. Configura adaptadores (NAT, Red Interna, Bridged), snapshots antes de cambios críticos y exporta en OVA."
    },
    {
        priority: 460,
        keywords: ["raid servidor","raid 0","raid 1","raid 5","raid 10","redundancia raid","volumen raid","espejo raid"],
        answer: "RAID en Server: 0 (stripping, velocidad sin redundancia), 1 (mirroring, mitad de capacidad), 5 (paridad distribuida, mínimo 3 discos), 10 (mirror+stripe). RAID software en Windows vs hardware con controladora."
    },
    {
        priority: 455,
        keywords: ["backup servidor","backup","copia seguridad servidor","acronis servidor","wbadmin","recovery server","regla 3-2-1 server"],
        answer: "Backups: regla 3-2-1 (3 copias, 2 medios distintos, 1 fuera del sitio), Windows Server Backup (wbadmin), Acronis True Image, tipos incremental/diferencial/completa, pruebas de restauración periódicas."
    },
    {
        priority: 450,
        keywords: ["powershell server","cmdlet server","get-aduser","new-aduser","set-aduser","script powershell server","pipeline powershell"],
        answer: "PowerShell en Server: Get-ADUser, New-ADUser, Set-ADUser -Enabled $false, Get-Service, Get-EventLog, pipeline con |. Scripts .ps1, Set-ExecutionPolicy RemoteSigned, módulos ActiveDirectory e importación con Import-Module."
    },
    {
        priority: 445,
        keywords: ["ubuntu server","linux en server","apache server","nginx server","samba server","systemctl server","journalctl server"],
        answer: "Ubuntu Server en IGORSERVER: instalación headless, systemctl start/stop/enable, Apache y Nginx como web servers, Samba para integrar Linux con Active Directory y compartir carpetas con Windows."
    },
    {
        priority: 440,
        keywords: ["nagios","monitorizacion server","snmp nagios","alerta servidor","servicio caido","uptime server"],
        answer: "Nagios: monitoriza hosts y servicios (HTTP, SSH, DHCP, ping, CPU, disco), umbrales de alerta (warning/critical), notificaciones por email, plugins NRPE para agentes remotos y paneles de estado web."
    },

    // ── CIBERSEGURIDAD ────────────────────────────────────────────────────────
    {
        priority: 400,
        keywords: ["ciberseguridad","seguridad informatica","seguridad digital","ciber","hacking etico","ethical hacking","pentest"],
        answer: "Ciberseguridad en IgorHall (próximamente): enfoque defensivo. Amenazas, vulnerabilidades, higiene digital, firewall, hardening, ingeniería social, análisis de riesgos y respuesta a incidentes con laboratorios éticos."
    },
    {
        priority: 395,
        keywords: ["triada cia","confidencialidad","integridad dato","disponibilidad sistema","amenaza ciberseguridad","vulnerabilidad sistema","riesgo seguridad"],
        answer: "Tríada CIA: Confidencialidad (solo acceden quienes deben), Integridad (datos no modificados sin autorización) y Disponibilidad (sistemas accesibles cuando se necesitan). Base de cualquier plan de seguridad."
    },
    {
        priority: 390,
        keywords: ["contrasena segura","gestor contrasenas","bitwarden","keepass","mfa","2fa","autenticacion doble","totp"],
        answer: "Higiene digital: contraseñas únicas de 16+ caracteres con gestor (Bitwarden, KeePass, 1Password). MFA/2FA con TOTP (Aegis, Google Authenticator). Nunca reutilices contraseñas ni uses el mismo en todo."
    },
    {
        priority: 385,
        keywords: ["phishing","smishing","vishing","ingenieria social ciberseguridad","correo falso","enlace malicioso","suplantacion identidad"],
        answer: "Ingeniería social: phishing (email), smishing (SMS), vishing (llamada). Señales: urgencia, remitente extraño, link acortado, errores, adjunto inesperado. Protocolo: no clicar, verificar por otro canal, reportar."
    },
    {
        priority: 380,
        keywords: ["firewall ciberseguridad","cortafuegos","reglas firewall","iptables","ufw linux","ids sistema","ips sistema","waf aplicacion"],
        answer: "Firewall: filtra tráfico por IP, puerto y protocolo. UFW (Linux), Windows Defender Firewall. IDS detecta intrusiones, IPS las bloquea activamente. WAF protege aplicaciones web de inyecciones y XSS."
    },
    {
        priority: 375,
        keywords: ["hardening sistema","superficie ataque","minimo privilegio","deshabilitar servicios","parchear sistema","actualizaciones seguridad"],
        answer: "Hardening: deshabilitar servicios no usados, cerrar puertos innecesarios, mínimo privilegio para cada usuario, parches al día, cifrado de disco (BitLocker, LUKS) y auditoría de cambios."
    },
    {
        priority: 370,
        keywords: ["logs seguridad","analizar logs","event viewer","siem","wazuh","splunk seguridad","journalctl seguridad"],
        answer: "Análisis de logs: Event Viewer (4624 login exitoso, 4625 fallido, 4720 nueva cuenta), journalctl en Linux, correlación de eventos. SIEMs como Wazuh o Splunk para centralizar y alertar en tiempo real."
    },
    {
        priority: 365,
        keywords: ["respuesta incidente","incident response","contencion incidente","erradicacion incidente","recuperacion incidente","lecciones aprendidas seguridad"],
        answer: "Respuesta a incidentes: Identificación → Contención (aislar el sistema) → Erradicación (limpiar la amenaza) → Recuperación (restaurar desde backup limpio) → Lecciones aprendidas (documentar y mejorar procesos)."
    },

    // ── SQL ───────────────────────────────────────────────────────────────────
    {
        priority: 300,
        keywords: ["sql","igor sql","base datos","bases datos","sqlite","sgbd","base datos relacional","aprender sql"],
        answer: "IGOR SQL Academy: bases de datos relacionales con SQLite. Modelo relacional, DDL, DML, consultas SELECT, agregaciones, JOINs, normalización y bases temáticas (Pokémon, Marvel, hospital, streaming). → igorhermoso1.github.io/IGORSQL"
    },
    {
        priority: 295,
        keywords: ["tabla sql","columna sql","fila sql","primary key","foreign key","not null sql","unique sql","restriccion sql","tipo dato sql"],
        answer: "Modelo relacional: tablas con columnas (TEXT, INTEGER, REAL, BLOB), PRIMARY KEY para identificar filas, FOREIGN KEY para relaciones, NOT NULL, UNIQUE, DEFAULT, CHECK como restricciones de integridad."
    },
    {
        priority: 290,
        keywords: ["create table sql","drop table","alter table","ddl sql","definicion datos sql","create index sql"],
        answer: "DDL: CREATE TABLE con columnas y restricciones, ALTER TABLE (ADD/MODIFY/DROP COLUMN), DROP TABLE para borrar, TRUNCATE para vaciar, CREATE INDEX para acelerar consultas en columnas muy consultadas."
    },
    {
        priority: 285,
        keywords: ["insert sql","update sql","delete sql","dml sql","insertar registro","actualizar registro","eliminar registro"],
        answer: "DML: INSERT INTO tabla (col1,col2) VALUES (v1,v2), UPDATE tabla SET col=val WHERE condicion, DELETE FROM tabla WHERE condicion. ⚠ NUNCA hagas UPDATE o DELETE sin WHERE en producción."
    },
    {
        priority: 280,
        keywords: ["select sql","where sql","order by","limit sql","distinct sql","alias sql","like sql","between sql","in sql","is null sql"],
        answer: "SELECT: FROM, WHERE (filtrar), ORDER BY col ASC/DESC, LIMIT n (paginar), DISTINCT (sin duplicados), alias con AS, LIKE '%texto%', BETWEEN valor1 AND valor2, IN (val1, val2), IS NULL / IS NOT NULL."
    },
    {
        priority: 275,
        keywords: ["count sql","sum sql","avg sql","min sql","max sql","group by","having sql","funcion agregada sql"],
        answer: "Agregaciones: COUNT(*), SUM(col), AVG(col), MIN(col), MAX(col). GROUP BY para agrupar, HAVING para filtrar grupos (como WHERE pero sobre el resultado del GROUP BY). Imprescindibles para análisis de datos."
    },
    {
        priority: 270,
        keywords: ["join sql","inner join","left join","right join","full outer join","subconsulta sql","subquery","union sql"],
        answer: "JOINs: INNER (solo coincidentes), LEFT (todos de la izq + coincidentes), RIGHT (todos de la der), FULL OUTER (todos de ambas). Subconsultas en WHERE, FROM o SELECT. UNION para combinar resultados."
    },
    {
        priority: 265,
        keywords: ["normalizacion sql","primera forma normal","segunda forma normal","tercera forma normal","1fn","2fn","3fn","dependencia funcional"],
        answer: "Normalización: 1FN (sin grupos repetidos, clave primaria), 2FN (sin dependencias parciales de la PK), 3FN (sin dependencias transitivas). Elimina redundancia y anomalías de inserción, actualización y borrado."
    },
    {
        priority: 260,
        keywords: ["vista sql","create view","transaccion sql","begin sql","commit sql","rollback sql","indice sql","create index"],
        answer: "Avanzado SQL: vistas (CREATE VIEW) para reutilizar consultas complejas; transacciones (BEGIN/COMMIT/ROLLBACK) para operaciones atómicas; índices (CREATE INDEX ON tabla(col)) para consultas más rápidas."
    },
    {
        priority: 255,
        keywords: ["db browser","dbeaver","sqliteonline","datagrip","herramienta sql","cliente sql"],
        answer: "Herramientas SQL: DB Browser for SQLite (gratuito, visual), DBeaver (multi-SGBD, profesional), SQLiteOnline.com (directo en navegador, sin instalación), DataGrip de JetBrains (avanzado, de pago con licencia estudiante gratis)."
    },

    // ── UNITY ─────────────────────────────────────────────────────────────────
    {
        priority: 200,
        keywords: ["unity","igorunity","videojuego unity","desarrollar videojuego","unity hub","editor unity","aprender unity"],
        answer: "IGORUNITY: hoja de ruta completa con 82 temas en 7 niveles, 91 assets incluidos, 10+ vídeos. Del editor y C# hasta multiplayer, VR y publicación en tiendas. → igorhermoso1.github.io/IGORUNITY"
    },
    {
        priority: 195,
        keywords: ["scene unity","game view unity","hierarchy unity","inspector unity","project unity","console unity","ventanas unity"],
        answer: "Editor Unity: Scene View (diseño), Game View (previsualización), Hierarchy (árbol de objetos), Inspector (propiedades), Project (archivos del proyecto) y Console (logs y errores). Dominar el editor es el primer paso."
    },
    {
        priority: 190,
        keywords: ["gameobject","prefab","transform unity","componente unity","prefab unity","prefab variant","parenting unity","instantiate unity"],
        answer: "GameObjects: todo en Unity es un GO con Transform (posición, rotación, escala). Los componentes añaden comportamiento. Prefabs son plantillas reutilizables con Instantiate(prefab, pos, rot). Parenting para jerarquías."
    },
    {
        priority: 185,
        keywords: ["csharp unity","c# unity","monobehaviour","start unity","update unity","awake unity","fixedupdate","gameloop unity","scripting unity"],
        answer: "C# en Unity: scripts heredan de MonoBehaviour. Awake() → OnEnable() → Start() → Update() (cada frame) → FixedUpdate() (física, 50 Hz) → LateUpdate(). El Game Loop es la base de todo en Unity."
    },
    {
        priority: 180,
        keywords: ["rigidbody","collider","colision unity","trigger unity","oncollisionenter","ontriggerenter","fisica unity","gravedad unity"],
        answer: "Física Unity: Rigidbody activa gravedad y fuerzas; Collider (Box, Sphere, Capsule, Mesh) para geometría de colisión; OnCollisionEnter/Stay/Exit para contacto físico; OnTriggerEnter para zonas sin colisión."
    },
    {
        priority: 175,
        keywords: ["movimiento unity","mover personaje unity","charactercontroller unity","lerp unity","vector3 unity","input unity","wasd unity"],
        answer: "Movimiento: Input.GetAxis('Horizontal'/'Vertical'), Vector3 para dirección, CharacterController.Move() o Rigidbody.MovePosition(). Lerp/Slerp para suavizar. Normaliza la dirección diagonal para evitar movimiento más rápido."
    },
    {
        priority: 170,
        keywords: ["animator unity","animacion unity","blend tree unity","state machine unity","mecanim","setbool unity","settrigger unity","transicion animacion"],
        answer: "Animator: máquina de estados con animaciones y transiciones por condiciones (bool, float, trigger, int). Blend Trees para mezcla (caminar↔correr). Animator.SetBool('isWalking', true) desde C#."
    },
    {
        priority: 165,
        keywords: ["ui unity","canvas unity","button unity","textmeshpro","hud unity","slider unity","panel unity","unity events"],
        answer: "UI Unity: Canvas (Screen Space Overlay/Camera/World), Button, Text/TextMeshPro, Image, Slider, Toggle, InputField. Layout Groups para organizar. OnClick() desde Inspector o AddListener() desde código."
    },
    {
        priority: 160,
        keywords: ["navmesh unity","ia enemigo unity","pathfinding unity","navmeshagent","enemigo sigue jugador","bake navmesh"],
        answer: "NavMesh: hornear (bake) en Window→AI→Navigation, añadir NavMeshAgent al enemigo, agent.destination = jugador.position para seguir automáticamente. NavMeshObstacle para obstáculos dinámicos."
    },
    {
        priority: 155,
        keywords: ["shader graph","vfx graph","shader unity","particulas unity","particle system unity","post proceso unity","iluminacion unity"],
        answer: "Gráficos Unity: Shader Graph (URP/HDRP) para shaders visuales sin código HLSL, VFX Graph para partículas GPU masivas, Particle System clásico (CPU), iluminación baked/realtime y Volume para post-proceso."
    },
    {
        priority: 150,
        keywords: ["multiplayer unity","netcode unity","fishnet unity","mirror unity","networkvariable","clientrpc","serverrpc","lobby unity"],
        answer: "Multiplayer: Netcode for GameObjects (oficial), FishNet o Mirror. Conceptos: Host/Server/Client, NetworkVariable para sincronizar datos, ClientRpc (Server→Clients), ServerRpc (Client→Server), Unity Lobby y Relay."
    },
    {
        priority: 145,
        keywords: ["vr unity","xr unity","realidad virtual unity","openxr unity","xr toolkit","meta quest unity","steamvr unity"],
        answer: "VR en Unity: XR Plugin Management + OpenXR para soporte multiplataforma, XR Interaction Toolkit para grab, teleport y UI en VR. Compatible con Meta Quest, PS VR2 y SteamVR desde el mismo proyecto."
    },
    {
        priority: 140,
        keywords: ["build unity","publicar juego unity","compilar unity","android unity","ios unity","webgl unity","google play unity"],
        answer: "Publicación Unity: Build Settings → plataforma (PC, Android, iOS, WebGL), Player Settings (nombre, icono, versión), firmar APK para Android, TestFlight para iOS. Optimiza con Profiler antes del build final."
    },

    // ── INTELIGENCIA ARTIFICIAL ───────────────────────────────────────────────
    {
        priority: 100,
        keywords: ["inteligencia artificial","ia igorhall","llm","modelo lenguaje","chatgpt","claude ia","gemini ia","aprender ia"],
        answer: "IA en IgorHall (próximamente): cómo funcionan los modelos de lenguaje, prompts efectivos, asistentes, automatización, datos, contenido generativo, uso responsable y proyectos aplicados con APIs de IA."
    },
    {
        priority: 95,
        keywords: ["prompt engineering","ingenieria prompts","prompts efectivos","chain of thought","few shot","rol ia","formato salida ia"],
        answer: "Prompt engineering: instrucciones claras y específicas, asignar rol ('actúa como...'), pedir formato (JSON, lista, tabla), chain-of-thought para razonamiento paso a paso, few-shot con ejemplos y gestionar el contexto."
    },
    {
        priority: 90,
        keywords: ["alucinacion ia","hallucination ia","inventar ia","sesgo ia","verificar ia","limitaciones ia"],
        answer: "Limitaciones de IA: alucinaciones (inventa datos con confianza), sesgos del entrenamiento, ventana de contexto limitada, sin acceso real a internet por defecto. Siempre verifica información crítica con fuentes externas."
    },
    {
        priority: 85,
        keywords: ["automatizar con ia","n8n ia","zapier ia","make ia","workflow ia","api openai","api anthropic","automatizacion ia"],
        answer: "Automatización con IA: APIs de OpenAI, Anthropic, Google; plataformas no-code como n8n, Zapier, Make para flujos sin programar. Automatiza resúmenes, clasificaciones, análisis de documentos y generación de recursos."
    },

    // ── LINUX ─────────────────────────────────────────────────────────────────
    {
        priority: 80,
        keywords: ["linux","gnu linux","aprender linux","distro linux","ubuntu linux","debian","arch linux","fedora linux","kali linux","terminal linux"],
        answer: "Linux (próximamente en IgorHall): terminal, comandos, permisos, paquetes, procesos, red, Bash scripting y administración de sistemas. Esencial para servidores, DevOps, ciberseguridad y desarrollo backend."
    },
    {
        priority: 75,
        keywords: ["comandos linux","ls linux","cd linux","mkdir linux","rm linux","grep linux","find linux","chmod linux","chown linux","sudo linux","cat linux"],
        answer: "Comandos básicos: ls -la, cd, pwd, mkdir -p, rm -rf, cp, mv, cat, less, tail -f, grep -r, find . -name, chmod, chown, sudo. La base para navegar y gestionar cualquier sistema Linux."
    },
    {
        priority: 70,
        keywords: ["apt linux","apt-get","dnf linux","pacman linux","snap linux","flatpak","gestor paquetes linux","instalar paquete linux"],
        answer: "Gestión de paquetes: apt (Debian/Ubuntu), dnf (Fedora), pacman (Arch). apt update && apt upgrade para actualizar, apt install paquete para instalar, apt remove para desinstalar. Snap y Flatpak para apps universales."
    },
    {
        priority: 65,
        keywords: ["permisos linux","chmod linux","chown linux","rwx linux","usuario linux","grupo linux","755 linux","644 linux","setuid linux"],
        answer: "Permisos Linux: rwx (lectura/escritura/ejecución) para usuario, grupo y otros. chmod 755 (rwxr-xr-x), 644 (rw-r--r--), 777 (todo para todos, evitar). Notación simbólica: chmod u+x archivo. chown user:group archivo."
    },
    {
        priority: 60,
        keywords: ["bash scripting","script bash","shebang bash","variable bash","if bash","for bash","while bash","crontab linux","automatizar linux"],
        answer: "Bash scripting: #!/bin/bash, variables (VAR=valor, uso con $VAR), if/elif/else, for/while, funciones, argumentos ($1 $2 $@), redirección (>, >>, 2>&1), pipes (|) y crontab para tareas programadas."
    },

    // ── PYTHON ────────────────────────────────────────────────────────────────
    {
        priority: 50,
        keywords: ["python","aprender python","programacion python","scripting python","pip python","venv python","entorno virtual python"],
        answer: "Python (próximamente en IgorHall): sintaxis limpia, tipado dinámico, scripting, automatización, análisis de datos, APIs REST con Flask/FastAPI. Uno de los lenguajes más versátiles y demandados del mercado."
    },
    {
        priority: 45,
        keywords: ["listas python","diccionario python","tuplas python","conjuntos python","set python","comprehension python","zip python","enumerate python","lambda python"],
        answer: "Estructuras Python: listas [], tuplas (), diccionarios {k:v}, sets {}. List/dict comprehension para crear colecciones en una línea. zip, enumerate, sorted, map, filter y lambda para programación funcional."
    },
    {
        priority: 40,
        keywords: ["clases python","poo python","init python","self python","herencia python","polimorfismo python","metodos especiales python"],
        answer: "POO Python: class Nombre, __init__(self), atributos de instancia y clase, herencia (class Hija(Padre)), super().__init__(), polimorfismo, encapsulación con _ (protegido) y __ (privado), __str__, __repr__, __len__."
    },
    {
        priority: 35,
        keywords: ["requests python","beautifulsoup python","pandas python","dataframe python","matplotlib python","numpy python","analisis datos python","web scraping python"],
        answer: "Librerías Python clave: requests (HTTP), BeautifulSoup (scraping), pandas (DataFrames, CSV, groupby), numpy (arrays numéricos), matplotlib/seaborn (gráficas). Todas instalables con pip install nombre."
    },
    {
        priority: 30,
        keywords: ["flask python","fastapi python","django python","api rest python","endpoint python","crud python","backend python","uvicorn"],
        answer: "Backend Python: Flask (micro, simple), FastAPI (async, auto-documentado con Swagger, tipado), Django (full-stack con ORM y admin). Aprenderás rutas, JSON, CRUD completo y conexión a SQLite o PostgreSQL."
    },

    // ── REACT ─────────────────────────────────────────────────────────────────
    {
        priority: 20,
        keywords: ["react","reactjs","aprender react","libreria react","jsx react","vite react","componente react"],
        answer: "React (próximamente en IgorHall): librería de UI de Meta. Aprenderás JSX, componentes funcionales, hooks (useState, useEffect, useContext), React Router, consumo de APIs y despliegue. La base del frontend moderno."
    },
    {
        priority: 15,
        keywords: ["props react","children react","composicion react","prop drilling react","datos entre componentes react"],
        answer: "Props React: pasar datos de padre a hijo con props, desestructurar en el componente ({ name, age }), valor por defecto (name='Anónimo'), children para componer, prop drilling y cuándo usar Context para evitarlo."
    },
    {
        priority: 10,
        keywords: ["usestate react","estado react","setstate react","re-render react","estado inicial react"],
        answer: "useState: const [valor, setValor] = useState(inicial). Actualizar con setValor(nuevo) o setValor(prev => prev+1) para basarse en el estado anterior. Cada cambio dispara un re-render automático del componente."
    },
    {
        priority: 5,
        keywords: ["useeffect react","efecto react","efecto secundario react","dependencias useeffect","fetch useeffect","cleanup useeffect"],
        answer: "useEffect: ejecuta código tras el render. Dependencias: [] solo al montar, [variable] cuando cambia, sin array en cada render. Return para cleanup (cancelar fetch, limpiar timers). Ideal para llamadas a APIs."
    },
    {
        priority: 0,
        keywords: ["usecontext react","context api react","provider react","createcontext react","estado global react"],
        answer: "Context API: createContext() crea el contexto, <Context.Provider value={...}> envuelve el árbol, useContext(MiContexto) consume en cualquier descendiente sin prop drilling. Ideal para tema, idioma o usuario."
    },
    {
        priority: -5,
        keywords: ["react router","rutas react","route react","link react","usenavigator react","useparams react","outlet react"],
        answer: "React Router v6: BrowserRouter → Routes → Route path='/ruta' element={<Comp/>}. Link para navegar sin recargar. useNavigate() programático. useParams() para leer :id de la URL. Outlet para rutas anidadas."
    },
    {
        priority: -10,
        keywords: ["tailwind react","tailwindcss react","utilidad css react","dark mode tailwind react","responsive tailwind react"],
        answer: "Tailwind en React: clases de utilidad en className ('flex justify-center p-4 bg-blue-500'). Prefijos responsive (md:, lg:), dark mode (dark:), hover (hover:), configuración en tailwind.config.js."
    }

];

// ============================
// EVENTOS DEL ASISTENTE
// ============================

if(assistantAvatar){
    assistantAvatar.addEventListener("click", () => {
        assistant.classList.toggle("is-open");
        const isOpen = assistant.classList.contains("is-open");
        assistantChat.setAttribute("aria-hidden", String(!isOpen));
        setAssistantMode("talk", 900);
        if(isOpen && assistantInput) setTimeout(() => assistantInput.focus(), 150);
    });
}

if(assistantClose){
    assistantClose.addEventListener("click", () => {
        assistant.classList.remove("is-open");
        assistantChat.setAttribute("aria-hidden","true");
        setAssistantMode("idle");
    });
}

if(assistantForm){
    assistantForm.addEventListener("submit", e => {
        e.preventDefault();
        const question = assistantInput.value.trim();
        if(!question) return;
        addAssistantMessage(question, "user");
        assistantInput.value = "";
        const answer = getAssistantAnswer(question);
        setTimeout(() => {
            if(answer){
                setAssistantMode("talk", 2200);
                addAssistantMessage(answer);
            } else {
                setAssistantMode("talk", 900);
                addAssistantMessage("No tengo respuesta específica para eso. Prueba a preguntar directamente por un módulo: 'qué hay en JavaScript', 'qué es Unity', 'cómo funciona SQL', etc. O pulsa el botón 'I' para ver todo el contenido.");
            }
        }, 220);
    });
}
