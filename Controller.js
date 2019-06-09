class Controller {
    constructor(renderDesk, desk) {
        this._desk = desk;
        this._ladyBeetles = [];
        this._grounds = [];
        this._activeBeetle = -1;
        this._numberOfKeys = 0;
        this._isWin = false;
        this._renderDesk = renderDesk;
        this._renderDesk._controller = this;
        this._numberOfSteps = 0;
        this._maxWidth = desk._x;
        this._maxHeight = desk._y;
        this._activeLevelDifficulties = "";
        this._activeLevelNumber = 0;
        this._activeLevelPassword = "";
        this._activeRulePart = 1;
        this._moveInRulesPagesBinded = moveInRulesPages.bind(this);
        this._audioWin = new Audio("./tada.mp3");
        this._svgControl = document.querySelector('#svgControl');
        this._intervalControl = null;
        this.svgMoveControlBinded = this.svgMoveControl.bind(this);

    }

    removeListeners() {
        document.body.removeEventListener('keydown', this);
        this._svgControl.removeEventListener('click', this.svgMoveControlBinded);
        this._svgControl.removeEventListener('mouseup', this.svgMoveControlBinded);
        this._svgControl.removeEventListener('mousedown', this.svgMoveControlBinded);
        this._svgControl.removeEventListener('mousemove', this.svgMoveControlBinded);
        window.clearInterval(this._intervalControl);
    }

    addListeners() {
        canvas.removeEventListener('click', this._moveInRulesPagesBinded);
        document.body.addEventListener('keydown', this);
        this._svgControl.addEventListener('click', this.svgMoveControlBinded);
        this._svgControl.addEventListener('mouseup', this.svgMoveControlBinded);
        this._svgControl.addEventListener('mousedown', this.svgMoveControlBinded);
        this._svgControl.addEventListener('mousemove', this.svgMoveControlBinded);
    }

    goUp() {
        if (this.checkValidMove(this._ladyBeetles[this._activeBeetle], 0, -1)) {
            this._ladyBeetles[this._activeBeetle].move(0, -1);
            this._numberOfSteps += 1;
        }
        this._ladyBeetles[this._activeBeetle]._direction = DIRECTIONS.up;
        const ladybeetle = this._ladyBeetles[this._activeBeetle];
        this._renderDesk.renderLevel();
        this.isWin();

    }

    goDown() {
        if (this.checkValidMove(this._ladyBeetles[this._activeBeetle], 0, 1)) {
            this._ladyBeetles[this._activeBeetle].move(0, 1);
            this._numberOfSteps += 1;
        }
        this._ladyBeetles[this._activeBeetle]._direction = DIRECTIONS.down;
        const ladybeetle = this._ladyBeetles[this._activeBeetle];
        this._renderDesk.renderLevel();
        this.isWin();

    }
    goLeft() {
        if (this.checkValidMove(this._ladyBeetles[this._activeBeetle], -1, 0)) {
            this._ladyBeetles[this._activeBeetle].move(-1, 0);
            this._numberOfSteps += 1;
        }
        this._ladyBeetles[this._activeBeetle]._direction = DIRECTIONS.left;
        const ladybeetle = this._ladyBeetles[this._activeBeetle];
        this._renderDesk.renderLevel();
        this.isWin();

    }
    goRight() {
        if (this.checkValidMove(this._ladyBeetles[this._activeBeetle], 1, 0)) {
            this._ladyBeetles[this._activeBeetle].move(1, 0);
            this._numberOfSteps += 1;
        }
        this._ladyBeetles[this._activeBeetle]._direction = DIRECTIONS.right;
        const ladybeetle = this._ladyBeetles[this._activeBeetle];
        this._renderDesk.renderLevel();
        this.isWin();
    }

    isWin() {
        if (this._isWin) {
            if (soundCheckBox.checked) {
                this._audioWin.play();
            }
            this.saveScore();
            this.nextLevel();
        }
    }

    checkValidMove(actor, moveX, moveY) {
        const actorX = actor.getX() + moveX;
        const actorY = actor.getY() + moveY;
        // zkontroluje, aby se beruska nepohybovala mimo desku
        if (this.checkIsOutOfDesk(actorX, actorY))
            return false;
        // zkontroluje, aby beruska nenarazila do jine berusky
        if (this.checkLadybeetleOnField(actorX, actorY)) {
            return false;
        }
        // zkontroluje, jestli neni na danem policku nejaky actor
        const fieldActor = this._desk._boardDesk[actorX][actorY]._actor;
        if (fieldActor == null) {
            return true;
        }
        const actorXNext = actorX + moveX;
        const actorYNext = actorY + moveY;
        // zkontroluj, ze polickoNext neni mimo hraci pole
        if (this.checkIsOutOfDesk(actorXNext, actorYNext))
            return false;
        const fieldActorNext = this._desk._boardDesk[actorXNext][actorYNext]._actor; // policko za polickem, na ktere chce beruska vstoupit
        // zjisti, jaky actor se nachazi na policku, kam se pohybujeme, a podle toho udelej interakci
        let ladybeetle = this._ladyBeetles[this._activeBeetle];
        switch (fieldActor._name) {
            case GATE_NAME:
                if (this._numberOfKeys == NUMBER_OF_KEYS) {
                    this._isWin = true;
                    return false;
                }
                return false;
            case WALL_NAME:
                return false;
            case BOX_NAME:
                if (this.checkLadybeetleOnField(actorXNext, actorYNext)) {
                    return false;
                }
                if (fieldActorNext == null) {
                    fieldActor._x = actorXNext;
                    fieldActor._y = actorYNext;
                    this._desk._boardDesk[actorXNext][actorYNext]._actor = fieldActor;
                    this._desk._boardDesk[actorX][actorY]._actor = null;
                    return true;
                } else {
                    return false;
                }
            case TNT_NAME:
                if (this.checkLadybeetleOnField(actorXNext, actorYNext)) {
                    return false;
                }
                if (fieldActorNext == null) {
                    fieldActor._x = actorXNext;
                    fieldActor._y = actorYNext;
                    this._desk._boardDesk[actorXNext][actorYNext]._actor = fieldActor;
                    this._desk._boardDesk[actorX][actorY]._actor = null;
                    return true;
                } else {
                    if (fieldActorNext._name == BOX_NAME) {
                        this.removeListeners();

                        for (let index = 0; index < 7; index++) {
                            setTimeout(() => {
                                this._renderDesk.renderObject(fieldActorNext.getX(), fieldActorNext.getY(), imgTntBlast, (index + 7) * 20);
                                if (index == 6) {
                                    this.addListeners();
                                    this._renderDesk.renderLevel();

                                }
                            }, 100 * index);
                        }

                        this._desk._boardDesk[actorXNext][actorYNext]._actor = null;
                        this._desk._boardDesk[actorX][actorY]._actor = null;
                        return true;
                    }
                    return false;
                }
            case KEY_NAME:
                // bezbarvy klic, jen ho seber
                if (fieldActor._color == COLORS.none) {
                    this._numberOfKeys += 1;
                    this._desk._boardDesk[actorX][actorY]._actor = null;
                    return true;
                }
                if (fieldActor._color == ladybeetle._rank) {
                    ladybeetle._hasColorKey = true;
                    this._desk._boardDesk[actorX][actorY]._actor = null;
                    return true;
                }
                return false;
            case PICKER_NAME:
                this._desk._boardDesk[actorX][actorY]._actor = null;
                ladybeetle._numberOfPickers += 1;
                return true;
            case STONE_NAME:
                if (ladybeetle._numberOfPickers > 0) {
                    this._desk._boardDesk[actorX][actorY]._actor = null;
                    ladybeetle._numberOfPickers -= 1;
                    // todo dodelat animaci na ZNICENI KAMENE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.removeListeners();
                    for (let index = 0; index < 4; index++) {
                        setTimeout(() => {
                            this._renderDesk.renderLevel();
                            this._renderDesk.renderObject(actorX, actorY, imgKlasik1, index * 20);
                            if (index == 3) {
                                setTimeout(() => {
                                    this.addListeners();
                                    actor.move(moveX, moveY);

                                    this._renderDesk.renderLevel();
                                }, 100 * index);


                            }
                        }, 200 * index);
                    }
                    return false;
                }
                return false;
            case ONEWAY_DOOR_NAME:
                if (fieldActor._isOpen) {
                    if (fieldActor._posImg == 76) {
                        this._desk._boardDesk[actorX + 1][actorY]._actor._posImg = 80;
                    } else {
                        this._desk._boardDesk[actorX][actorY - 1]._actor._posImg = 80;
                    }
                    fieldActor._isOpen = false;
                    return true;
                }
                return false;
            case COLOR_DOOR_NAME:
                if (fieldActor._isOpen) {
                    return true;
                } else {
                    // kdyz ma stejne barevny klic jako jsou dvere, tak otevri
                    if (ladybeetle._hasColorKey && ladybeetle._rank == fieldActor._color) {
                        ladybeetle._hasColorKey = false;
                        fieldActor._isOpen = true;
                        if (fieldActor._posImg == 76) {
                            this._desk._boardDesk[actorX - 1][actorY]._actor._posImg = 48;
                        } else {
                            this._desk._boardDesk[actorX][actorY - 1]._actor._posImg = 48;
                        }
                        return true;
                    }
                    return false;
                }
            case COLOR_ENTRY_NAME:
                // kdyz je beruska stejne barvy jako dvere, tak projdi
                if (ladybeetle._rank == fieldActor._color) {
                    return true;
                }
                return false;

        }
    }

    checkIsOutOfDesk(x, y) {
        if (x < 0 || x >= this._desk._x || y < 0 || y >= this._desk._y)
            return true;
        return false;
    }

    checkLadybeetleOnField(x, y) {
        for (const ladybeetle of this._ladyBeetles) {
            if (ladybeetle._x == x && ladybeetle._y == y)
                return true;
        }
        return false;
    }

    switchLadybeetle() {
        let nextActive = 1 + this._activeBeetle;
        while (true) {
            nextActive = nextActive % 5;
            if (this._ladyBeetles[nextActive]._isActive) {
                this._activeBeetle = nextActive;
                break;
            }
            nextActive += 1;
        }
        this._renderDesk.renderLevel();
    }

    setActiveLadybeetle() {

    }

    addKey() {
        this._numberOfKeys += 1;
    }

    resetLevel() {
        this._activeLevelNumber -= 1;
        this.nextLevel();
    }

    nextLevel() {
        this._activeLevelNumber += 1;
        let activeLevels = [];
        if (this._activeLevelDifficulties == "easy") {
            activeLevels = levels.easy;
        } else if (this._activeLevelDifficulties == "medium") {
            activeLevels = levels.medium;
        } else if (this._activeLevelDifficulties == "hard") {
            activeLevels = levels.hard;
        }

        if (this._activeLevelNumber >= activeLevels.length) {
            this._renderDesk.renderLevelInDevelopment();
            this.removeListeners();
            restartLevelButtonVisibility("hidden");
        } else {
            this.initLevel(activeLevels[this._activeLevelNumber]);
            this._activeLevelPassword = activeLevels[this._activeLevelNumber].password;
        }
    }

    initLevelDifficulties(levelDifficulties) {
        this._activeLevelDifficulties = levelDifficulties;
        this._activeLevelNumber = -1;
        this.nextLevel();
    }

    initLevel(level) {
        this.addListeners()
        // vymazani vsech actoru z desky
        for (let x = 0; x < this._maxWidth; x++) {
            for (let y = 0; y < this._maxHeight; y++) {
                this._desk._boardDesk[x][y]._actor = null;
            }
        }
        this._isWin = false;
        this._activeLevelPassword = level.password;

        const gate = new Gate(level.gate.x, level.gate.y, level.gate.posImg);
        this._desk._boardDesk[level.gate.x][level.gate.y]._actor = gate;
        this._activeBeetle = level.activeLadybeetle;
        this._ladyBeetles = [];
        this._grounds = [];
        this._numberOfKeys = 0;
        this._numberOfSteps = 0;
        // vytvorit 5 berusek
        for (let index = 0; index < 5; index++) {
            this._ladyBeetles.push(new LadyBeetle(-1, -1, index, false, DIRECTIONS.up, -1));
        }
        for (let index = 0; index < level.ladybeetles.length; index++) {
            let ladybeetle = level.ladybeetles[index];
            this._ladyBeetles[ladybeetle.rank]._x = ladybeetle.x;
            this._ladyBeetles[ladybeetle.rank]._y = ladybeetle.y;
            this._ladyBeetles[ladybeetle.rank]._isActive = true;
            this._ladyBeetles[ladybeetle.rank]._posImg = ladybeetle.posImg;
            this._ladyBeetles[ladybeetle.rank]._direction = ladybeetle.direction;
        }
        for (let index = 0; index < level.grounds.length; index++) {
            let ground = level.grounds[index];
            this._grounds.push(new Ground(ground.x, ground.y, ground.posImg));
        }
        for (let index = 0; index < level.walls.length; index++) {
            let wall = level.walls[index];
            this._desk._boardDesk[wall.x][wall.y]._actor = new Wall(wall.x, wall.y, wall.posImg);
        }
        for (let index = 0; index < level.boxes.length; index++) {
            let box = level.boxes[index];
            this._desk._boardDesk[box.x][box.y]._actor = new Box(box.x, box.y, box.posImg);
        }
        for (let index = 0; index < level.tnts.length; index++) {
            let tnt = level.tnts[index];
            this._desk._boardDesk[tnt.x][tnt.y]._actor = new Tnt(tnt.x, tnt.y, tnt.posImg);
        }
        for (let index = 0; index < level.keys.length; index++) {
            let key = level.keys[index];
            this._desk._boardDesk[key.x][key.y]._actor = new Key(key.x, key.y, COLORS.none, key.posImg);
        }
        for (let index = 0; index < level.colorKeys.length; index++) {
            let key = level.colorKeys[index];
            this._desk._boardDesk[key.x][key.y]._actor = new Key(key.x, key.y, key.color, key.posImg);
        }
        for (let index = 0; index < level.pickers.length; index++) {
            let picker = level.pickers[index];
            this._desk._boardDesk[picker.x][picker.y]._actor = new Picker(picker.x, picker.y, picker.posImg);
        }
        for (let index = 0; index < level.stones.length; index++) {
            let stone = level.stones[index];
            this._desk._boardDesk[stone.x][stone.y]._actor = new Stone(stone.x, stone.y, stone.posImg);
        }
        for (let index = 0; index < level.onewayDoors.length; index++) {
            let onewayDoor = level.onewayDoors[index];
            this._desk._boardDesk[onewayDoor.x][onewayDoor.y]._actor = new OneWayDoor(onewayDoor.x, onewayDoor.y, onewayDoor.posImg);
            // pridat zed z leve a prave strany (posImg == 0), nebo z horejsi a spodni strany(posImg == 1)
            if (onewayDoor.posImg == 76) {
                this._desk._boardDesk[onewayDoor.x - 1][onewayDoor.y]._actor = new Wall(onewayDoor.x - 1, onewayDoor.y, 78);
                this._desk._boardDesk[onewayDoor.x + 1][onewayDoor.y]._actor = new Wall(onewayDoor.x + 1, onewayDoor.y, 77);
            } else {
                this._desk._boardDesk[onewayDoor.x][onewayDoor.y - 1]._actor = new Wall(onewayDoor.x, onewayDoor.y - 1, 77);
                this._desk._boardDesk[onewayDoor.x][onewayDoor.y + 1]._actor = new Wall(onewayDoor.x, onewayDoor.y + 1, 75);
            }
        }
        for (let index = 0; index < level.colorDoors.length; index++) {
            let colorDoor = level.colorDoors[index];
            this._desk._boardDesk[colorDoor.x][colorDoor.y]._actor = new ColorDoor(colorDoor.x, colorDoor.y, colorDoor.color, colorDoor.posImg);
            // pridat zed z leve a prave strany (posImg == 0), nebo z horejsi a spodni strany(posImg == 1)
            if (colorDoor.posImg == 76) {
                this._desk._boardDesk[colorDoor.x - 1][colorDoor.y]._actor = new Wall(colorDoor.x - 1, colorDoor.y, 50);
                this._desk._boardDesk[colorDoor.x + 1][colorDoor.y]._actor = new Wall(colorDoor.x + 1, colorDoor.y, 63 + colorDoor.color);
            } else {
                this._desk._boardDesk[colorDoor.x][colorDoor.y - 1]._actor = new Wall(colorDoor.x, colorDoor.y - 1, 50);
                this._desk._boardDesk[colorDoor.x][colorDoor.y + 1]._actor = new Wall(colorDoor.x, colorDoor.y + 1, 70 + colorDoor.color);
            }
        }
        for (let index = 0; index < level.colorEntries.length; index++) {
            let colorEntry = level.colorEntries[index];
            this._desk._boardDesk[colorEntry.x][colorEntry.y]._actor = new ColorEntry(colorEntry.x, colorEntry.y, colorEntry.color, colorEntry.posImg);
            // pridat zed z leve a prave strany (posImg == 0), nebo z horejsi a spodni strany(posImg == 1)
            if (colorEntry.posImg == 76) {
                this._desk._boardDesk[colorEntry.x - 1][colorEntry.y]._actor = new Wall(colorEntry.x - 1, colorEntry.y, 61);
                this._desk._boardDesk[colorEntry.x + 1][colorEntry.y]._actor = new Wall(colorEntry.x + 1, colorEntry.y, 63 + colorEntry.color);
            } else {
                this._desk._boardDesk[colorEntry.x][colorEntry.y - 1]._actor = new Wall(colorEntry.x, colorEntry.y - 1, 61);
                this._desk._boardDesk[colorEntry.x][colorEntry.y + 1]._actor = new Wall(colorEntry.x, colorEntry.y + 1, 70 + colorEntry.color);
            }
        }
        this._renderDesk.renderLevel();
    }

    saveScore() {
        let scoreboard = JSON.parse(localStorage.getItem("scoreboard"));
        if (scoreboard == null) {
            scoreboard = [];
        }
        for (let index = 0; index < scoreboard.length; index++) {
            if (scoreboard[index].difficult == this._activeLevelDifficulties && scoreboard[index].level == this._activeLevelNumber) {
                if (this._numberOfSteps < scoreboard[index].steps) {
                    scoreboard[index].steps = this._numberOfSteps;
                    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));

                }
                return;
            }
        }
        const score = { difficult: this._activeLevelDifficulties, level: this._activeLevelNumber, steps: this._numberOfSteps, password: this._activeLevelPassword };
        scoreboard.push(score);
        localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    }

    initMenu() {
        this._renderDesk.renderStartScreen();
    }

    showRules() {
        canvas.addEventListener('click', this._moveInRulesPagesBinded);
        this._renderDesk.renderRules(1);
    }

    tryPassword(passwd) {
        for (let index = 0; index < levels.easy.length; index++) {
            const level = levels.easy[index];
            if (level.password == passwd) {
                this._activeLevelDifficulties = "easy";
                this._activeLevelNumber = index - 1;
                this.nextLevel();
                return true;
            }
        }
        return false;
    }

    svgMoveControl(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        const svgWindow = this._svgControl.getBoundingClientRect();
        const svgWindSize = svgWindow.width;
        const oneThirdWindow = svgWindSize / 3;
        const oneFourthWindow = svgWindSize / 4;
        const startBeetleSquare = svgWindSize * 0.375;
        const timer = 100;
        
        // sipka nahoru
        this._svgControl.style.cursor = "pointer";
        if(e.type == "mouseup"){
            window.clearInterval(this._intervalControl);
        }else if (x > oneThirdWindow && x < oneThirdWindow * 2 && y < oneThirdWindow) {
            if (e.type == "mousedown") {
                this._intervalControl = window.setInterval(() => {
                    this.goUp();
                }, timer);
            }
        } // sipka dolu
        else if (x > oneThirdWindow && x < oneThirdWindow * 2 && y > oneThirdWindow * 2) {
            if (e.type == "mousedown") {
                this._intervalControl = window.setInterval(()=> {
                    this.goDown();
                }, timer);
            }
        }// sipka doleva
        else if (y > oneThirdWindow && y < oneThirdWindow * 2 && x < oneThirdWindow) {
            if (e.type == "mousedown") {
                this._intervalControl = window.setInterval(() => {
                    this.goLeft();
                }, timer);
            }
        }// sipka doprava
        else if (y > oneThirdWindow && y < oneThirdWindow * 2 && x > oneThirdWindow * 2) {
            if (e.type == "mousedown") {
                this._intervalControl = window.setInterval(() => {
                    this.goRight();
                }, timer);
            }
        }// prepinani berusky
        else if (x > startBeetleSquare && x < startBeetleSquare + oneFourthWindow && y > startBeetleSquare && y < startBeetleSquare + oneFourthWindow) {
            if (e.type == "click") {
                this.switchLadybeetle();
            }
        } else {
            this._svgControl.style.cursor = "move";
        }
    }
}

Controller.prototype.handleEvent = function (e) {
    if (e.type == "keydown") {
        if (e.code == "ArrowUp") {
            this.goUp();
        } else if (e.code == "ArrowDown") {
            this.goDown();
        }
        else if (e.code == "ArrowLeft") {
            this.goLeft();
        }
        else if (e.code == "ArrowRight") {
            this.goRight();
        } else if (e.code == "Tab") {
            this.switchLadybeetle();
            e.preventDefault();
        }
        else {
            console.log(e.code);
        }
    }
}

function moveInRulesPages(e) {
    const parentPosition = getPosition(e.currentTarget);
    let xPosition = e.clientX - parentPosition.x;
    let yPosition = e.clientY - parentPosition.y;
    /* console.log(`Pozice x = ${xPosition}, y = ${yPosition}`); */
    const yPos = this._renderDesk._canvasHeight - this._renderDesk._sizeOfField * 2;

    // leva sipka
    if (xPosition > this._renderDesk._sizeOfField * 11 && xPosition < this._renderDesk._sizeOfField * 12 && yPosition > yPos ) {
        if (this._activeRulePart > 1) {
            this._activeRulePart -= 1;
        }
        this._renderDesk.renderRules(this._activeRulePart);
        console.log("leva sipka");
    }
    else if (xPosition > this._renderDesk._sizeOfField * 19 && xPosition < this._renderDesk._sizeOfField * 20 && yPosition > yPos) {
        if (this._activeRulePart < 4) {
            this._activeRulePart += 1;
        }
        this._renderDesk.renderRules(this._activeRulePart);
        console.log("prava sipka");
    }
}


function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
            var yScrollPos = el.scrollTop || document.documentElement.scrollTop;

            xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
            yPosition += (el.offsetTop - yScrollPos + el.clientTop);
        } else {
            xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    console.log("xPOS: " + xPosition);
    console.log("yPOS: " + yPosition);

    return {
        x: xPosition,
        y: yPosition
    };
}