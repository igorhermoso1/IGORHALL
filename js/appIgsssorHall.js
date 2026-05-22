// script.js

// ============================
// RELOJ DIGITAL
// ============================

document.body.classList.add("is-loading");

window.addEventListener("load", () => {
    setTimeout(() => {
        const introScreen = document.getElementById("introScreen");

        if(introScreen){
            introScreen.classList.add("is-done");
        }

        document.body.classList.remove("is-loading");
        document.body.classList.add("intro-complete");
    }, 2600);
});

function updateClock(){

    const now = new Date();

    let hours = String(now.getHours()).padStart(2,'0');
    let minutes = String(now.getMinutes()).padStart(2,'0');
    let seconds = String(now.getSeconds()).padStart(2,'0');

    document.getElementById("clock").textContent =
    `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock,1000);
updateClock();


// ============================
// EFECTO SONIDO VISUAL
// ============================

const cards = document.querySelectorAll(".card");

cards.forEach((card, cardIndex) => {

    card.style.setProperty("--card-index", cardIndex + 1);

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `
        radial-gradient(
            circle at ${x}px ${y}px,
            var(--spot-color, rgba(127,220,255,0.18)),
            rgba(255,255,255,0.04) 45%
        )`;
    });

    card.addEventListener("mouseleave", () => {

        card.style.background = `
        linear-gradient(
            145deg,
            rgba(255,255,255,0.08),
            rgba(255,255,255,0.03)
        )`;
    });

});

document.querySelectorAll("[data-assistant-topic]").forEach(card => {
    card.addEventListener("click", event => {
        event.preventDefault();
        openInfoModal(card.dataset.assistantTopic);
    });
});


// ============================
// MODAL DE INFORMACION
// ============================

const infoModal = document.getElementById("infoModal");
const openInfoButton = document.getElementById("openInfoModal");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function openInfoModal(tabName = "html"){
    if(!infoModal){
        return;
    }

    infoModal.classList.add("is-open");
    infoModal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    activateTab(tabName);
}

function closeInfoModal(){
    if(!infoModal){
        return;
    }

    infoModal.classList.remove("is-open");
    infoModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
}

function activateTab(tabName){
    tabButtons.forEach(button => {
        const isActive = button.dataset.tab === tabName;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === `tab-${tabName}`);
    });
}

if(openInfoButton){
    openInfoButton.addEventListener("click", () => openInfoModal());
}

closeModalButtons.forEach(button => {
    button.addEventListener("click", closeInfoModal);
});

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        activateTab(button.dataset.tab);
    });
});

document.addEventListener("keydown", event => {
    if(event.key === "Escape" && infoModal && infoModal.classList.contains("is-open")){
        closeInfoModal();
    }
});


// ============================
// ASISTENTE VIRTUAL
// ============================

const assistant = document.getElementById("virtualAssistant");
const assistantAvatar = document.getElementById("assistantAvatar");
const assistantSprite = document.getElementById("assistantSprite");
const assistantChat = document.getElementById("assistantChat");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantMessages = document.getElementById("assistantMessages");

const assistantFrames = {
    idle:[
        "assets/avatar/igor-idle-1.png",
        "assets/avatar/igor-idle-2.png",
        "assets/avatar/igor-idle-3.png",
        "assets/avatar/igor-idle-2.png"
    ],
    talk:[
        "assets/avatar/igor-talk-1.png",
        "assets/avatar/igor-talk-2.png",
        "assets/avatar/igor-talk-3.png"
    ]
};

let assistantMode = "idle";
let assistantFrameIndex = 0;
let assistantTalkTimer;

function setAssistantMode(mode, duration = 0){
    assistantMode = mode;
    assistantFrameIndex = 0;

    if(assistantTalkTimer){
        clearTimeout(assistantTalkTimer);
    }

    if(duration){
        assistantTalkTimer = setTimeout(() => {
            assistantMode = "idle";
            assistantFrameIndex = 0;
        }, duration);
    }
}

setInterval(() => {
    if(!assistantSprite){
        return;
    }

    const frames = assistantFrames[assistantMode] || assistantFrames.idle;
    assistantSprite.src = frames[assistantFrameIndex % frames.length];
    assistantFrameIndex++;
}, 260);

function addAssistantMessage(text, type = "bot"){
    if(!assistantMessages){
        return;
    }

    const message = document.createElement("p");
    message.className = `assistant-message ${type}`;
    message.textContent = text;
    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function normalizeText(text){
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9#.+\s-]/g," ")
        .replace(/\s+/g," ")
        .trim();
}

const assistantKnowledge = [
    {
        priority:100,
        keywords:["ayuda","que puedes hacer","como funciona","chatbot","igorbot","asistente","preguntar","preguntas"],
        answer:"Soy IgorBot y solo respondo sobre IgorHall: módulos, temas, ejercicios, puntos, pestañas, orden recomendado y cómo moverte por la web. Pregúntame por HTML, JavaScript, Hardware, Redes, Server, Ciberseguridad, SQL, Unity o IA."
    },
    {
        priority:98,
        keywords:["orden","ruta","itinerario","por donde empezar","empezar","recomiendas","recomendado","primero","secuencia"],
        answer:"Ruta recomendada: 1 HTML & CSS, 2 JavaScript, 3 Hardware, 4 Redes, 5 Server, 6 Ciberseguridad, 7 SQL, 8 Unity y 9 IA. Si ya sabes programar, puedes saltar a SQL, Unity o IA directamente."
    },
    {
        priority:96,
        keywords:["modal","ventana","informacion","info","i","pestana","pestanas","tabs","resumen","sumario"],
        answer:"La I superior abre la ventana informativa. Ahí tienes pestañas por repositorio con resumen, estadísticas y una lista numerada de contenidos. Puedes desplazarte dentro del modal si hay mucho texto."
    },
    {
        priority:94,
        keywords:["tarjeta","card","abrir modulo","entrar","enlace","link","github pages","pagina"],
        answer:"Cada tarjeta abre su página de GitHub Pages en una pestaña nueva. Ciberseguridad e IA todavía son rutas preparadas, así que al pulsarlas se abre su pestaña informativa dentro del modal."
    },
    {
        priority:92,
        keywords:["puntos","igorpoints","xp","experiencia","logros","badges","recompensas","racha","progreso","guardar","guardado"],
        answer:"Varias academias usan gamificación: IgorPoints o XP, progreso guardado, ejercicios hechos, racha, logros, badges y recompensas. Cada repositorio gestiona su propio avance."
    },
    {
        priority:90,
        keywords:["html","css","frontend","igoracademia","maquetacion","diseño web","diseno web"],
        answer:"IGORCADEMIA cubre HTML & CSS: estructura base, etiquetas semánticas, formularios, selectores, box model, colores, display, position, Flexbox, CSS Grid, pseudoclases, transiciones, animaciones, responsive, variables CSS, filtros, fuentes, iconos y efectos avanzados."
    },
    {
        priority:88,
        keywords:["doctype","head","body","estructura html","semantica","header","nav","main","article","section","footer","formulario","input","textarea","select"],
        answer:"En HTML trabajarás estructura de documento, DOCTYPE, head, body, lang, charset, etiquetas semánticas y formularios con inputs, selects, textarea, atributos y validación básica."
    },
    {
        priority:86,
        keywords:["flexbox","grid","responsive","media query","media queries","mobile","hover","transition","animation","keyframes","variables css","backdrop","filter","clip-path"],
        answer:"En CSS avanzado tienes Flexbox, Grid, responsive mobile-first, hover, focus, transiciones, transform, keyframes, variables CSS, filter, backdrop-filter, clip-path, mix-blend y efectos visuales modernos."
    },
    {
        priority:84,
        keywords:["javascript","js","igorscript","programacion","programación","dom","eventos","fetch","api"],
        answer:"IGORSCRIPT enseña JavaScript con variables, tipos, operadores, DOM, selectores, eventos, condicionales, bucles, funciones, arrays, objetos, classList, estilos dinámicos, fetch, async/await y proyectos con APIs reales."
    },
    {
        priority:82,
        keywords:["variable","let","const","var","template","literal","typeof","operador","scope","funcion","funciones","arrow"],
        answer:"En fundamentos JS se trabaja var/let/const, tipos de datos, operadores, template literals, typeof, scope, funciones clásicas, arrow functions, parámetros y return."
    },
    {
        priority:80,
        keywords:["queryselector","getelementbyid","innerhtml","textcontent","addeventlistener","click","input","submit","classlist","render"],
        answer:"En DOM aprenderás querySelector, getElementById, innerHTML, textContent, atributos data-*, addEventListener, eventos de click/input/submit, classList y render dinámico."
    },
    {
        priority:78,
        keywords:["async","await","asincronia","asincronia","pokeapi","pokemon","superhero","super hero","cards api","json"],
        answer:"En la parte async de JavaScript tienes fetch, promesas, async/await, JSON, PokéAPI, SuperHero API, buscadores visuales, cards dinámicas y proyectos conectados a datos reales."
    },
    {
        priority:76,
        keywords:["hardware","igorhardware","componentes","pc","ordenador","montaje","bios","uefi","ram","cpu","gpu","placa","fuente","refrigeracion","almacenamiento"],
        answer:"IGORHARDWARE cubre componentes, montaje y diagnóstico: CPU, RAM, placa base, GPU, almacenamiento, fuente, refrigeración, BIOS/UEFI, sistemas operativos, drivers, compatibilidad y montaje paso a paso."
    },
    {
        priority:74,
        keywords:["pc builder","builder","incidencia","incidencias","diagnostico","diagnóstico","no enciende","pantalla negra","temperatura","compatibilidad"],
        answer:"Hardware incluye simuladores como PC Builder y un resolutorio de incidencias. Sirve para practicar compatibilidad, diagnóstico de fallos, equipos que no encienden, pantallas negras, temperaturas y decisiones de montaje."
    },
    {
        priority:72,
        keywords:["redes","igorredes","network","networking","tcp","ip","tcp/ip","subnetting","subred","vlan","wifi","router","switch","ping"],
        answer:"IGORREDES enseña networking: fundamentos, TCP/IP, direccionamiento, máscaras, subnetting, VLANs, WiFi, routing, switching, simulador de red, ping, mapas lógicos y configurador de router."
    },
    {
        priority:70,
        keywords:["simulador de red","topologia","topologias","mapa logico","mapas logicos","cisco","cli","configurar router","gateway","dns"],
        answer:"En la práctica de Redes puedes crear topologías, arrastrar dispositivos, conectarlos, configurar IPs, probar ping, guardar diseños, dibujar mapas lógicos y usar un configurador de router tipo Cisco IOS."
    },
    {
        priority:68,
        keywords:["server","igorserver","servidor","windows server","active directory","directorio activo","ad","dns","dhcp","gpo","powershell"],
        answer:"IGORSERVER trabaja administración de sistemas: Windows Server, Active Directory, usuarios, grupos, OU, DNS, DHCP, GPOs, permisos, PowerShell, roles de servidor y escenarios de empresa."
    },
    {
        priority:66,
        keywords:["virtualbox","maquina virtual","maquinas virtuales","raid","discos","particiones","backup","copias","acronis","recovery","nagios","samba","ubuntu server"],
        answer:"En Server también hay VirtualBox, laboratorios con máquinas virtuales, discos, particiones, volúmenes, RAID, copias de seguridad, Acronis, recovery, Ubuntu Server, Samba + AD y monitorización con Nagios."
    },
    {
        priority:64,
        keywords:["ciberseguridad","ciber","cyber","seguridad","phishing","mfa","firewall","hardening","riesgos","incidente","incidentes"],
        answer:"Ciberseguridad está pensada como ruta defensiva: amenazas, vulnerabilidades, MFA, contraseñas, privacidad, firewall, hardening, ingeniería social, análisis de riesgos, logs, respuesta a incidentes y laboratorios éticos."
    },
    {
        priority:62,
        keywords:["hacking","hack","red team","blue team","vulnerabilidad","vulnerabilidades","legal","etico","etica","pentest","pentesting"],
        answer:"En Ciberseguridad el enfoque debe ser ético y controlado: entender vulnerabilidades, documentar riesgos, practicar en laboratorios guiados, generar reportes y no salir nunca del marco legal."
    },
    {
        priority:60,
        keywords:["sql","igor sql","base de datos","bases de datos","sqlite","tabla","tablas","registro","columna","pk","fk","primary key","foreign key"],
        answer:"IGOR SQL Academy cubre bases de datos relacionales con SQLite: tablas, registros, columnas, claves primarias, claves foráneas, relaciones, tipos de datos, restricciones y modelado entidad-relación."
    },
    {
        priority:58,
        keywords:["select","where","insert","update","delete","drop","alter","create","join","group by","having","normalizacion","vista","transaccion"],
        answer:"En SQL practicarás CREATE TABLE, INSERT, UPDATE, DELETE, DROP, ALTER, SELECT, WHERE, ORDER BY, LIMIT, LIKE, BETWEEN, JOINs, GROUP BY, HAVING, normalización, vistas y transacciones."
    },
    {
        priority:56,
        keywords:["consola sql","bd tematicas","bases tematicas","pokemon","marvel","hospital","streaming","colegio","baloncesto"],
        answer:"SQL incluye consola real y bases temáticas como Pokémon, Marvel, hospital, streaming, colegio y baloncesto para practicar consultas con datos más entretenidos."
    },
    {
        priority:54,
        keywords:["unity","igorunity","videojuego","videojuegos","gameobject","gameobjects","c#","csharp","prefab","prefabs","rigidbody"],
        answer:"IGORUNITY va de cero a experto: Unity Hub, editor, Hierarchy, Inspector, GameObjects, Transform, componentes, prefabs, C# scripting, Rigidbody, colisiones, triggers, UI y proyectos reales."
    },
    {
        priority:52,
        keywords:["animator","canvas","textmeshpro","hud","particulas","vfx","cinemachine","navmesh","tilemap","shader","multiplayer","vr","profiler"],
        answer:"En Unity avanzado aparecen Animator, Canvas, TextMeshPro, HUD, partículas, VFX, Cinemachine, NavMesh, Tilemap, Shader Graph, multiplayer, VR, profiler, builds y publicación."
    },
    {
        priority:50,
        keywords:["ia","inteligencia artificial","ai","prompt","prompts","modelo","asistente ia","automatizacion","automatización"],
        answer:"La ruta de IA se centra en fundamentos de modelos, prompts, asistentes, contexto, límites, sesgos, automatización, análisis de información, generación de recursos, uso responsable y proyectos aplicados."
    },
    {
        priority:48,
        keywords:["resumen","resumir","documentos","clasificar","generar contenido","copiloto","chatbot educativo","materiales","recursos"],
        answer:"En IA puedes plantear proyectos como chatbot educativo, copiloto de estudio, generador de recursos, análisis de documentos, clasificación simple, extracción de información y creación de materiales de clase."
    },
    {
        priority:46,
        keywords:["apalahes","apalaches","juego","no estudiar","survival","paranoia"],
        answer:"APALACHES está en la zona de juego del hall. Es el apartado de descanso: no todo va a ser estudiar."
    }
].sort((a,b) => b.priority - a.priority);

function getAssistantAnswer(question){
    const q = normalizeText(question);
    const match = assistantKnowledge.find(item => {
        return item.keywords.some(keyword => q.includes(normalizeText(keyword)));
    });

    return match ? match.answer : "";
}

if(assistantAvatar){
    assistantAvatar.addEventListener("click", () => {
        assistant.classList.toggle("is-open");
        assistantChat.setAttribute("aria-hidden", String(!assistant.classList.contains("is-open")));
        setAssistantMode("talk", 900);

        if(assistant.classList.contains("is-open") && assistantInput){
            setTimeout(() => assistantInput.focus(), 150);
        }
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
    assistantForm.addEventListener("submit", event => {
        event.preventDefault();

        const question = assistantInput.value.trim();

        if(!question){
            return;
        }

        addAssistantMessage(question, "user");
        assistantInput.value = "";

        const answer = getAssistantAnswer(question);

        setTimeout(() => {
            if(answer){
                setAssistantMode("talk", 1600);
                addAssistantMessage(answer);
            }else{
                setAssistantMode("talk", 900);
                addAssistantMessage("Por el momento NO tengo información al respecto.");
            }
        }, 220);
    });
}


// ============================
// TITULO DINAMICO
// ============================

const titles = [
    "IGOR HALL",
    "INSERT COIN",
    "READY PLAYER ONE",
    "LOADING KNOWLEDGE..."
];

let index = 0;

setInterval(() => {

    document.title = titles[index];

    index++;

    if(index >= titles.length){
        index = 0;
    }

}, 2500);
