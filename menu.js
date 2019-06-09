const hamburgerButton = document.querySelector('.mainMenuButton');
const hamburgerInput = document.querySelector('#box-toggle');
const easyLevel = document.querySelector('#easyLevel');
const mediumLevel = document.querySelector('#mediumLevel');
const hardLevel = document.querySelector('#hardLevel');
const resetGame = document.querySelector('#resetGame');
const scoreboardMenu = document.querySelector('#scoreboard');
const scoreboardSection = document.querySelector('.scoreboard');
const scoreboardBlackButton = document.querySelector('.scoreboardBlackButton');
const settingsMenu = document.querySelector('#settings');
const controlMenu = document.querySelector('#control');
const rulesMenu = document.querySelector('#rules');
const passwordInput = document.querySelector('#passwordInput');
const newGameArrow = document.querySelector('#newGameArrow');
const passwdArrow = document.querySelector('#passwdArrow');
const settingsArrow = document.querySelector('#settingsArrow');
const soundCheckBox = document.querySelector('#sound');
const controlPanelCheckBox = document.querySelector('#controlPanel');


// escape function
document.body.addEventListener('keydown', e => {
    if (e.code == "Escape") {
        toggleNav();
    }
});

// vyplnit scoreboard z localstorage
function fillScoreBoard() {
    while (scoreboardSection.firstChild) {
        scoreboardSection.removeChild(scoreboardSection.firstChild);
    }
    const table = document.createElement("table");
    const trHead = document.createElement("tr");
    const thHead1 = document.createElement("th");
    thHead1.textContent = "Obtížnost";
    const thHead2 = document.createElement("th");
    thHead2.textContent = "Level";
    const thHead3 = document.createElement("th");
    thHead3.textContent = "# kroků";
    const thHead4 = document.createElement("th");
    thHead4.textContent = "Heslo";

    scoreboardSection.appendChild(table);
    table.appendChild(trHead);
    trHead.appendChild(thHead1);
    trHead.appendChild(thHead3);
    trHead.appendChild(thHead4);

    let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));
    console.log("LS: " + scoreboard);
    if (scoreboard == null) {
        scoreboard = [];
    }


    for (const score of scoreboard) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = score.difficult + " - " + score.level;
        const td2 = document.createElement("td");
        td2.textContent = score.level;
        const td3 = document.createElement("td");
        td3.textContent = score.steps;
        const td4 = document.createElement("td");
        td4.textContent = score.password;
        tr.appendChild(td1);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
}


let flagLevelsDown = false;
$('#newGame').on('click', newGameToggle);

function newGameToggle() {
    $('.subMenuLevelDifficulties').slideToggle(1000);
    if (flagLevelsDown) {
        flagLevelsDown = false;
        newGameArrow.classList.remove("passwdArrowUp");

    } else {
        flagLevelsDown = true;
        newGameArrow.classList.add("passwdArrowUp");
    }
}

let flagPasswDown = false;
$('#password').on('click', passwdToggle);
function passwdToggle() {
    $('.password').slideToggle(1000);
    if (flagPasswDown) {
        flagPasswDown = false;
        passwdArrow.classList.remove("passwdArrowUp");
    } else {
        setTimeout(function () { document.querySelector('#passwordInput').focus() }, 20);
        flagPasswDown = true;
        passwdArrow.classList.add("passwdArrowUp");
    }
    hideScoreboard();
}

let flagSettingsDown = false;
$('#settings').on('click', settingsToggle);
function settingsToggle() {
    $('.settingsProperties').slideToggle(1000);
    if (flagSettingsDown) {
        flagSettingsDown = false;
        settingsArrow.classList.remove("passwdArrowUp");
    } else {
        flagSettingsDown = true;
        settingsArrow.classList.add("passwdArrowUp");
    }
}

// nastaveni spravne sound checkbox a controlpanel checkbox z localstorage
let soundcb = localStorage.getItem("soundCheckBox");
let controlPanelcb = localStorage.getItem("controlPanelCheckBox");
if (soundcb == null) {
    soundCheckBox.checked = true;
} else {
    soundCheckBox.checked = (localStorage.getItem("soundCheckBox") == 'true');
}
if (controlPanelcb == null) {
    controlPanelCheckBox.checked = false;
} else {
    controlPanelCheckBox.checked = (localStorage.getItem("controlPanelCheckBox") == 'true');
    controlPanelVisibility();
}

function restartLevelButtonVisibility(state) {
    resetGame.style.visibility = state;
}

hamburgerButton.addEventListener('click', toggleNav);
function toggleNav() {
    if (hamburgerInput.checked) {
        hamburgerInput.checked = false;
    } else {
        hamburgerInput.checked = true;
    }
    if (flagPasswDown) {
        passwdToggle();
    }
    if (flagLevelsDown) {
        newGameToggle();
    }
    if (flagSettingsDown) {
        settingsToggle();
    }
}


// menu
easyLevel.addEventListener('click', e => {
    controller.initLevelDifficulties("easy");
    hamburgerInput.checked = false;
    restartLevelButtonVisibility("visible");
    hideScoreboard();
});

mediumLevel.addEventListener('click', e => {
    controller.initLevelDifficulties("medium");
    hamburgerInput.checked = false;
    restartLevelButtonVisibility("visible");
    hideScoreboard();
});

hardLevel.addEventListener('click', e => {
    controller.initLevelDifficulties("hard");
    hamburgerInput.checked = false;
    restartLevelButtonVisibility("visible");
    hideScoreboard();
});

resetGame.addEventListener('click', e => {
    controller.resetLevel();
    hamburgerInput.checked = false;
    hideScoreboard();
});

scoreboardMenu.addEventListener('click', e => {
    scoreboardSection.style.left = (window.innerWidth - 405) / 2 + "px";
    fillScoreBoard();
    scoreboardSection.classList.add("scoreboardTransition");
    scoreboardBlackButton.classList.add("scoreboardBlackButtonShow");
    hamburgerInput.checked = false;
});

scoreboardSection.addEventListener('click', hideScoreboard);
scoreboardBlackButton.addEventListener('click', hideScoreboard);
function hideScoreboard() {
    scoreboardSection.classList.remove("scoreboardTransition");
    scoreboardBlackButton.classList.remove("scoreboardBlackButtonShow");
}

controlMenu.addEventListener('click', e => {
    hamburgerInput.checked = false;
    restartLevelButtonVisibility("hidden");
    controller.removeListeners();
    renderDesk.renderControl();
    hideScoreboard();
});

rulesMenu.addEventListener('click', e => {
    hamburgerInput.checked = false;
    controller.removeListeners();
    restartLevelButtonVisibility("hidden");
    controller.showRules();
    hideScoreboard();
});

// zapnuti / vypnuti zvuku
soundCheckBox.addEventListener('change', (event) => {
    localStorage.setItem("soundCheckBox", event.target.checked);
})
// ukazani / skryti control panelu
controlPanelCheckBox.addEventListener('change', controlPanelVisibility);
function controlPanelVisibility() {
    localStorage.setItem("controlPanelCheckBox", controlPanelCheckBox.checked);
    if (controlPanelCheckBox.checked) {
        $('.controlSection').slideDown(0);
    } else {
        $('.controlSection').slideUp(0);

    }
}
// zadavani heslo do inputu
passwordInput.addEventListener('keyup', e => {
    let passwd = passwordInput.value;
    const isFound = controller.tryPassword(passwd);
    if (isFound) {
        passwordInput.value = "";
        hamburgerInput.checked = false;
        passwdToggle();
    }
});

// online / offline status
window.addEventListener('offline', wifiConnection);
window.addEventListener('online', wifiConnection);
let okWifi = document.querySelector('#ok-wifi');
let noWifi = document.querySelector('#no-wifi');
function wifiConnection() {
    if (navigator.onLine) {
        okWifi.style.display = "block";
        noWifi.style.display = "none";
    } else {
        okWifi.style.display = "none";
        noWifi.style.display = "block";
    }
}