const controlSection = document.querySelector(".controlSection");
controlSection.style.height = "10px";

const presouvany = document.querySelector("#svgControl");
presouvany.style.top = "-100px";

let souradnice = { x: 00, y: -100 }; // výchozí umístění „left: 0; top: 0“
let posunSouradnice; // pro zjišťování posunu
let puvodniSouradnice; // souradnice prvku před posunem

presouvany.addEventListener('mousedown', onMouseDown);
presouvany.addEventListener('touchstart', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('touchend', onMouseUp);



function onMouseDown(e) {
    const event = window.event || e;
    presouvany.setAttribute("data-move", "");
    console.log("souradnice = " + souradnice.x + " - " + souradnice.y)
    puvodniSouradnice = { x: souradnice.x, y: souradnice.y };
    if (e.type == "touchstart") {
        posunSouradnice = {
            x: event.touches[0].pageX,
            y: event.touches[0].pageY
        };
    } else {
        posunSouradnice = {
            x: event.clientX,
            y: event.clientY
        };
    }

}

function onMouseMove(e) {
    if (!presouvany.hasAttribute("data-move")) return;
    const event = window.event || e;
    let x = 0;
    let y = 0;
    console.log("puv souradnice top = " + puvodniSouradnice.x);

    if (e.type == "touchmove") {
        x = puvodniSouradnice.x + event.touches[0].pageX - posunSouradnice.x;
        y = puvodniSouradnice.y + event.touches[0].pageY - posunSouradnice.y;
    } else {
        x = puvodniSouradnice.x + event.clientX - posunSouradnice.x;
        y = puvodniSouradnice.y + event.clientY - posunSouradnice.y;
    }
    souradnice.x = x;
    souradnice.y = y;
    presouvany.style.left = x + "px";
    presouvany.style.top = y + "px";
}

function onMouseUp() {
    presouvany.removeAttribute("data-move");
}

