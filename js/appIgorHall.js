// script.js

// ============================
// RELOJ DIGITAL
// ============================

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

cards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background = `
        radial-gradient(
            circle at ${x}px ${y}px,
            rgba(127,220,255,0.18),
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