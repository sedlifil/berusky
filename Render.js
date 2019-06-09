class RenderDesk {
    constructor() {
        this._controller = null;
        this._sizeOfField = 20;
        this._canvasHeight = 0;
        this._canvasWidth = 0;
        this._boardStart = this._sizeOfField * 2;
        this._activeRenderMethod = this.renderStartScreen;
        this._ellipsesSvg = document.querySelectorAll(".ellipseSvg");
        this._activePart = 1;
        this.resizeCanvas();
    }

    resizeCanvas() {
        const widthToHeight = 4 / 3;
        let newWidth = 0;
        let newHeight = 0;

        if (screen.width < window.innerWidth) {
            newWidth = screen.width - 20;
        } else {
            newWidth = window.innerWidth - 20;
        }
        if (screen.height < window.innerHeight) {
            newHeight = screen.height - 20;
        } else {
            newHeight = window.innerHeight - 20;
        }


        let newWidthToHeight = newWidth / newHeight;

        if (newWidth > 640) {
            newWidth = 640;
        }
        if (newHeight > 480) {
            newHeight = 480;
        }

        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;

        } else {
            newHeight = newWidth / widthToHeight;
        }

        this._sizeOfField = (newWidth / 32) | 0;
        this._boardStart = this._sizeOfField * 2;
        newWidth = this._sizeOfField * 32;
        newHeight = this._sizeOfField * 24;

        this._canvasHeight = newHeight;
        this._canvasWidth = newWidth;
        canvas.width = newWidth;
        canvas.height = newHeight;
        this._activeRenderMethod();

    }

    renderLevel() {
        this._activeRenderMethod = this.renderLevel;
        context.fillStyle = "black";
        context.fillRect(0, 0, this._canvasWidth, this._canvasHeight);
        context.drawImage(imgLevelBackground, 0, 0, 640, 420, 0, this._sizeOfField * 2, this._canvasWidth, this._canvasHeight);
        this.renderGrounds();
        for (let x = 0; x < this._controller._desk._x; x++) {
            for (let y = 0; y < this._controller._desk._y; y++) {
                const actor = this._controller._desk._boardDesk[x][y]._actor;
                if (actor != null) {
                    this.renderActor(actor);
                }
            }
        }
        this.renderHaveKeys();
        this.renderLadybeetlesIcon();
        this.renderAllActiveLadybeetle();
        this.renderNumberOfSteps();
        this.renderPickersForActiveLadybeetle();

    }

    renderActor(actor) {
        switch (actor._name) {
            case GATE_NAME:
                this.renderGate(actor);
                break;
            case WALL_NAME:
                this.renderWall(actor);
                break;
            case BOX_NAME:
                this.renderBox(actor);
                break;
            case TNT_NAME:
                this.renderTnt(actor);
                break;
            case KEY_NAME:
                this.renderKey(actor);
                break;
            case PICKER_NAME:
                this.renderPicker(actor);
                break;
            case STONE_NAME:
                this.renderStone(actor);
                break;
            case ONEWAY_DOOR_NAME:
                this.renderOneWayDoor(actor);
                break;
            case COLOR_DOOR_NAME:
                this.renderColorDoor(actor);
                break;
            case COLOR_ENTRY_NAME:
                this.renderColorEntry(actor);
                break;
        }
    }

    renderHaveKeys() {
        let x = this._controller._numberOfKeys * 60;
        context.drawImage(imgHaveKeys, x, 0, 60, 40, this._sizeOfField * 27, 0, this._sizeOfField * 3, this._sizeOfField * 2);
    }
    /* renderovani velkych ikon berusek */
    renderLadybeetlesIcon() {
        const topMargin = ((3 / 40) * (this._sizeOfField * 2)) | 0;
        const halfOfBeetle = (((this._sizeOfField * 2) / 40) * 32) | 0;
        const fullBeetle = halfOfBeetle * 2;
        for (const ladyBeetle of this._controller._ladyBeetles) {
            let x = 0;
            let y = ladyBeetle._rank * 37;
            if (ladyBeetle._rank == this._controller._activeBeetle) {
                x = 128;
                // nastav barvu i pro svg controller
                if (ladyBeetle._rank == 0) {
                    this._ellipsesSvg.forEach(e => e.setAttribute("fill", "red"));
                } else if (ladyBeetle._rank == 1) {
                    this._ellipsesSvg.forEach(e => e.setAttribute("fill", "green"));
                } else if (ladyBeetle._rank == 2) {
                    this._ellipsesSvg.forEach(e => e.setAttribute("fill", "blue"));
                } else if (ladyBeetle._rank == 3) {
                    this._ellipsesSvg.forEach(e => e.setAttribute("fill", "orange"));
                } else if (ladyBeetle._rank == 4) {
                    this._ellipsesSvg.forEach(e => e.setAttribute("fill", "purple"));
                }
            }
            if (ladyBeetle._hasColorKey && ladyBeetle._numberOfPickers > 0) {
                x += 64;
                context.drawImage(imgBee, x, y, 64, 37, ladyBeetle._rank * this._sizeOfField * 5, topMargin, fullBeetle, this._sizeOfField * 2 - topMargin);
            } else if (ladyBeetle._hasColorKey) {
                context.drawImage(imgBee, x, y, 32, 37, ladyBeetle._rank * this._sizeOfField * 5, topMargin, halfOfBeetle, this._sizeOfField * 2 - topMargin);
                x += 96;
                context.drawImage(imgBee, x, y, 32, 37, ladyBeetle._rank * this._sizeOfField * 5 + halfOfBeetle, topMargin, halfOfBeetle, this._sizeOfField * 2 - topMargin);
            } else if (ladyBeetle._numberOfPickers > 0) {
                x += 32;
                context.drawImage(imgBee, x, y, 32, 37, ladyBeetle._rank * this._sizeOfField * 5 + halfOfBeetle, topMargin, halfOfBeetle, this._sizeOfField * 2 - topMargin);
                x += 32;
                context.drawImage(imgBee, x, y, 32, 37, ladyBeetle._rank * this._sizeOfField * 5, topMargin, halfOfBeetle, this._sizeOfField * 2 - topMargin);
            } else {
                context.drawImage(imgBee, x, y, 64, 37, ladyBeetle._rank * this._sizeOfField * 5, topMargin, fullBeetle, this._sizeOfField * 2 - topMargin);
            }
            if (!ladyBeetle._isActive) {
                context.drawImage(imgBermask, 0, 0, 64, 37, ladyBeetle._rank * this._sizeOfField * 5, topMargin, fullBeetle, this._sizeOfField * 2 - topMargin);
            }
        }
    }

    renderGrounds() {
        for (const ground of this._controller._grounds) {
            context.drawImage(imgKlasik1, ground._posImg * 20, 0, 20, 20, ground.getX() * this._sizeOfField, this._boardStart + ground.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        }
    }

    renderGate(gate) {
        if (this._controller._numberOfKeys == NUMBER_OF_KEYS) {
            context.drawImage(imgKlasik1, (gate._posImg + 1) * 20, 0, 20, 20, gate.getX() * this._sizeOfField, this._boardStart + gate.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        } else {
            context.drawImage(imgKlasik1, gate._posImg * 20, 0, 20, 20, gate.getX() * this._sizeOfField, this._boardStart + gate.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        }
    }

    renderBox(box) {
        context.drawImage(imgKlasik1, box._posImg * 20, 0, 20, 20, box.getX() * this._sizeOfField, this._boardStart + box.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderWall(wall) {
        context.drawImage(imgWalls, wall._posImg * 20, 0, 20, 20, wall.getX() * this._sizeOfField, this._boardStart + wall.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderTnt(tnt) {
        context.drawImage(imgTnts, tnt._posImg * 20, 0, 20, 20, tnt.getX() * this._sizeOfField, this._boardStart + tnt.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderKey(key) {
        context.drawImage(imgKeys, key._posImg * 20, 0, 20, 20, key.getX() * this._sizeOfField, this._boardStart + key.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderPicker(picker) {
        context.drawImage(imgPicker, picker._posImg * 20, 0, 20, 20, picker.getX() * this._sizeOfField, this._boardStart + picker.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderStone(stone) {
        context.drawImage(imgKlasik1, stone._posImg * 20, 0, 20, 20, stone.getX() * this._sizeOfField, this._boardStart + stone.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderObject(x, y, img, imgPos) {
        context.drawImage(img, imgPos, 0, 20, 20, x * this._sizeOfField, this._sizeOfField * 2 + y * this._sizeOfField, this._sizeOfField, this._sizeOfField);
    }

    renderOneWayDoor(onewayDoor) {
        if (onewayDoor._isOpen) {
            context.drawImage(imgKlasik1, onewayDoor._posImg * 20, 0, 20, 20, onewayDoor.getX() * this._sizeOfField, this._boardStart + onewayDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);

        } else {
            if (onewayDoor._posImg == 76) {
                context.drawImage(imgKlasik1, 79 * 20, 0, 20, 20, onewayDoor.getX() * this._sizeOfField, this._boardStart + onewayDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
            } else {
                context.drawImage(imgKlasik1, 69 * 20, 0, 20, 20, onewayDoor.getX() * this._sizeOfField, this._boardStart + onewayDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
            }
        }

    }

    renderColorEntry(colorEntry) {
        if (colorEntry._posImg == 76) {
            context.drawImage(imgKlasik1, 79 * 20, 0, 20, 20, colorEntry.getX() * this._sizeOfField, this._boardStart + colorEntry.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        } else {
            context.drawImage(imgKlasik1, 69 * 20, 0, 20, 20, colorEntry.getX() * this._sizeOfField, this._boardStart + colorEntry.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        }
    }

    renderColorDoor(colorDoor) {
        if (colorDoor._isOpen) {
            context.drawImage(imgKlasik1, colorDoor._posImg * 20, 0, 20, 20, colorDoor.getX() * this._sizeOfField, this._boardStart + colorDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
        } else {
            if (colorDoor._posImg == 76) {
                context.drawImage(imgKlasik1, 79 * 20, 0, 20, 20, colorDoor.getX() * this._sizeOfField, this._boardStart + colorDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
            } else {
                context.drawImage(imgKlasik1, 69 * 20, 0, 20, 20, colorDoor.getX() * this._sizeOfField, this._boardStart + colorDoor.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
            }
        }
    }

    renderPickersForActiveLadybeetle(picker) {
        const ladybeetle = this._controller._ladyBeetles[this._controller._activeBeetle];
        for (let index = 0; index < ladybeetle._numberOfPickers; index++) {
            context.drawImage(imgPicker, 0, 0, 20, 20, (31 * this._sizeOfField) - (this._sizeOfField * index), this._sizeOfField * 23, this._sizeOfField, this._sizeOfField);
        }
    }

    renderAllActiveLadybeetle() {
        for (const ladyBeetle of this._controller._ladyBeetles) {
            if (ladyBeetle._isActive) {
                this.renderLadybeetleOnDesk(ladyBeetle);
            }
        }
    }

    renderLadybeetleOnDesk(ladybeetle) {
        switch (ladybeetle._direction) {
            case DIRECTIONS.up:
                context.drawImage(imgLadyBeetleOnDeskUp, ladybeetle._rank * 200, 0, 20, 20, ladybeetle.getX() * this._sizeOfField, this._boardStart + ladybeetle.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
                break;
            case DIRECTIONS.down:
                context.drawImage(imgLadyBeetleOnDeskDown, ladybeetle._rank * 200, 0, 20, 20, ladybeetle.getX() * this._sizeOfField, this._boardStart + ladybeetle.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
                break;
            case DIRECTIONS.left:
                context.drawImage(imgLadyBeetleOnDeskLeft, 0, ladybeetle._rank * 200, 20, 20, ladybeetle.getX() * this._sizeOfField, this._boardStart + ladybeetle.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
                break;
            case DIRECTIONS.right:
                context.drawImage(imgLadyBeetleOnDeskRight, 0, ladybeetle._rank * 200, 20, 20, ladybeetle.getX() * this._sizeOfField, this._boardStart + ladybeetle.getY() * this._sizeOfField, this._sizeOfField, this._sizeOfField);
                break;
        }
    }

    renderNumberOfSteps() {
        const string = "Lvl " + this._controller._activeLevelNumber  + ", heslo: " + this._controller._activeLevelPassword  
        + ", počet kroků: " + controller._numberOfSteps;
        context.fillRect(0, this._sizeOfField * 23, this._canvasWidth, this._sizeOfField);
        context.font = this._sizeOfField + "px Shojumaru";
        context.fillStyle = "yellow";  //<======= here
        this.renderTextLine(string, 0, this._canvasHeight - 2);
    }

    renderTextLine(text, posX, posY) {
        context.fillText(text, posX, posY);
        /* Vykresleni pocet kroku na desku s poctem kroku (max 9999) */
        /* let position = 0;
        let charCode = 0;
        let posOnDesk = posX;
        for (let index = 0; index < text.length; index++) {
            charCode = text.charCodeAt(index);
            if (charCode > 96 && charCode < 123) {
                position = charCode - 97;
            } else if (charCode > 47 && charCode < 58) {
                position = charCode - 48 + 26;
            } else if (text.charAt(index) == " ") {
                position = 57;
            } else if (text.charAt(index) == ":") {
                position = 42;
            } else if (text.charAt(index) == ",") {
                position = 59;
            } else if (text.charAt(index) == ".") {
                position = 58;
            } else if (text.charAt(index) == "-") {
                position = 38;
            }

            let pos = ((this._sizeOfField / 20) * (fontLetterStart[position + 1] - fontLetterStart[position]) | 0);
            context.drawImage(imgFont0, fontLetterStart[position], 0, fontLetterStart[position + 1] - fontLetterStart[position], 20,
                posOnDesk, posY, pos , this._sizeOfField);
            posOnDesk += pos; 

        }*/
    }

    renderStartScreen() {
        this._activeRenderMethod = this.renderStartScreen;
        context.drawImage(imgMenu, 0, 0, this._canvasWidth, this._canvasHeight);
        context.font = (this._sizeOfField - 2) + "px Shojumaru";
        context.fillStyle = "white";  //<======= here
        let posY = this._sizeOfField * 6;
        const mezera = this._sizeOfField + 2;
        this.renderTextLine("Hra berušky jsou logickou hrou, která principi-", 20, posY);
        posY += mezera;
        this.renderTextLine("elně vychází z prastaré logické hříčky sokoban,", 20, posY);
        posY += mezera;
        this.renderTextLine("což je hra, která vetšina mladších hráčů už", 20, posY);
        posY += mezera;
        this.renderTextLine("vůbec nezná. Původní strohou ideu sokobana,", 20, posY);
        posY += mezera;
        this.renderTextLine("kterou bylo pouhé posouvání beden sem a tam,", 20, posY);
        posY += mezera;
        this.renderTextLine("jsme obohatili o nové logické prvky, jako jsou", 20, posY);
        posY += mezera;
        this.renderTextLine("například různé typy dveří, kameny, výbušné", 20, posY);
        posY += mezera;
        this.renderTextLine("bedny a podobně.", 20, posY);
        posY += mezera + mezera;
        this.renderTextLine("Mimoto přibyla i možnost spolupráce jednotli-", 20, posY);
        posY += mezera;
        this.renderTextLine("vých herních postav, berušek, kterých může být", 20, posY);
        posY += mezera;
        this.renderTextLine("v jedné úrovni až pět.", 20, posY);
        posY += mezera + mezera;
        this.renderTextLine("Cílem každé úrovně je nasbírat pět", 20, posY);
        posY += mezera;
        this.renderTextLine("klíčů, které otevřou průchod do další mise.", 20, posY);

    }

    renderLevelInDevelopment() {
        this._activeRenderMethod = this.renderLevelInDevelopment;
        context.drawImage(imgMenu, 0, 0, this._canvasWidth, this._canvasHeight);
        context.font = "18px Shojumaru";
        context.fillStyle = "white";
        this.renderTextLine("Další levely jsou v rukou vývojářů...", 20, 150);
    }

    renderControl() {
        this._activeRenderMethod = this.renderControl;
        context.drawImage(imgMenu, 0, 0, this._canvasWidth, this._canvasHeight);
        context.font = (this._sizeOfField - 2) + "px Shojumaru";
        const prvekColor = "orange";
        const commonColor = "white";
        context.fillStyle = "yellow";
        let posY = this._sizeOfField * 6;
        const mezera = this._sizeOfField + (this._sizeOfField / 5);
        const text = "Ovládání berušek ";
        this.renderTextLine(text, (this._canvasWidth - context.measureText(text).width) / 2, posY);
        posY += mezera + mezera;
        context.fillStyle = "white";
        this.renderTextLine("K dispozici můžete mít až pět berušek, které lze", this._sizeOfField, posY);
        posY += mezera;
        this.renderTextLine("ovládat těmito klávesami:", this._sizeOfField, posY);
        posY += mezera + mezera;
        context.fillStyle = prvekColor;
        this.renderTextLine("šipky", this._sizeOfField * 2, posY);
        context.fillStyle = commonColor;
        this.renderTextLine(". . . . pohyb berušky", this._sizeOfField * 12, posY);
        posY += mezera;
        context.fillStyle = prvekColor;
        this.renderTextLine("tab", this._sizeOfField * 2, posY);
        context.fillStyle = commonColor;
        this.renderTextLine(". . . . přepínání mezi beruškami", this._sizeOfField * 12, posY);
        posY += mezera;
        context.fillStyle = prvekColor;
        this.renderTextLine("esc", this._sizeOfField * 2, posY);
        context.fillStyle = commonColor;
        this.renderTextLine(". . . . menu", this._sizeOfField * 12, posY);
        posY += mezera + mezera;
        this.renderTextLine("Nebo můžete využít ovládací panel na displeji:", this._sizeOfField, posY);
        posY += mezera;
        this.renderTextLine("(ovlád.panel můžete vypnut v menu -> nastavení)", this._sizeOfField * 1.5, posY);
        posY += mezera + mezera;
        context.fillStyle = prvekColor;
        this.renderTextLine("šipky", this._sizeOfField * 2, posY);
        context.fillStyle = commonColor;
        this.renderTextLine(". . . . pohyb berušky", this._sizeOfField * 12, posY);
        posY += mezera;
        context.fillStyle = prvekColor;
        this.renderTextLine("ikonka berušky", this._sizeOfField * 2, posY);
        context.fillStyle = commonColor;
        this.renderTextLine(". . . . přepínání mezi beruškami", this._sizeOfField * 12, posY);


    }

    renderRules(part) {
        this._activeRenderMethod = this.renderRules;
        context.drawImage(imgMenu, 0, 0, this._canvasWidth, this._canvasHeight);
        context.font = (this._sizeOfField - 2) + "px Shojumaru";
        context.fillStyle = "yellow";
        let posY = this._sizeOfField * 6;
        const mezera = this._sizeOfField + (this._sizeOfField / 4);
        const prvekColor = "orange";
        const commonColor = "white";
        if (part != undefined) {
            this._activePart = part;
        }

        if (this._activePart == 1) {
            const text = "Základní pravidla a herní prvky";
            this.renderTextLine(text, (this._canvasWidth - context.measureText(text).width) / 2, posY);
            context.fillStyle = "white";
            posY += mezera + mezera / 2;
            this.renderTextLine("K opuštění každé úrovně je třeba vlastnit pět", this._sizeOfField, posY);
            posY += mezera;
            this.renderTextLine("klíčů a navíc mít volnoucestu k východu. Při ", this._sizeOfField, posY);
            posY += mezera;
            this.renderTextLine("plnění jednotlivých misí se budete setkávat", this._sizeOfField, posY);
            posY += mezera;
            this.renderTextLine("s rozličnými herními prvky, jejichž význam se", this._sizeOfField, posY);
            posY += mezera;
            this.renderTextLine("vám pokusíme ve stručnosti přiblížit:", this._sizeOfField, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("bedny", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . lze je tlačit před sebou.", this._sizeOfField * 12, posY);
            posY += mezera * 3;
            context.fillStyle = prvekColor;
            this.renderTextLine("výbušnina", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . dá se s ní zničit bedna.", this._sizeOfField * 12, posY);

        } else if (this._activePart == 2) {
            const text = "Aktivní prvky ve hře";
            this.renderTextLine(text, (this._canvasWidth - context.measureText(text).width) / 2, posY);
            context.fillStyle = "white";
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("klíč", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . potřebujete jich rovných pět.", this._sizeOfField * 9, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("východ", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . brána do další úrovně.", this._sizeOfField * 9, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("kámen", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . je možné jej rozbít krumpáčem.", this._sizeOfField * 9, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("krumpáč", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . nástroj pro eliminaci kamenů.", this._sizeOfField * 9, posY);

        } else if (this._activePart == 3) {
            const text = "Aktivní prvky ve hře";
            this.renderTextLine(text, (this._canvasWidth - context.measureText(text).width) / 2, posY);
            context.fillStyle = "white";
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("barevné klíče", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . slouží pro odemykání", this._sizeOfField * 13, posY);
            posY += mezera;
            this.renderTextLine("barevnýchdveří, vzít jej může pouze beruška ", this._sizeOfField * 3, posY);
            posY += mezera;
            this.renderTextLine("identické barvy", this._sizeOfField * 3, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("barevné dveře", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . otevřít je lze výhradně", this._sizeOfField * 13, posY);
            posY += mezera;
            this.renderTextLine("klíčem příslušné barvy.", this._sizeOfField * 3, posY);
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("barevné průchody", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . propustí přes své dveře", this._sizeOfField * 13, posY);
            posY += mezera;
            this.renderTextLine("jen berušku stejné barvy. Průchodem nelze", this._sizeOfField * 3, posY);
            posY += mezera;
            this.renderTextLine("protlačit bednu.", this._sizeOfField * 3, posY);


        } else if (this._activePart == 4) {
            const text = "Aktivní prvky ve hře";
            this.renderTextLine(text, (this._canvasWidth - context.measureText(text).width) / 2, posY);
            context.fillStyle = "white";
            posY += mezera + mezera;
            context.fillStyle = prvekColor;
            this.renderTextLine("jednoprůchodové dveře", this._sizeOfField * 2, posY);
            context.fillStyle = commonColor;
            this.renderTextLine(". . . . lze jimi projít", this._sizeOfField * 17, posY);
            posY += mezera;
            this.renderTextLine("maximálně jednou, potom se navždy uzavřou", this._sizeOfField * 3, posY);
            posY += mezera;
            this.renderTextLine("a již není cesty, jak je otevřít.", this._sizeOfField * 3, posY);
            posY += mezera + mezera;
            this.renderTextLine("Ostatní prvky, tedy ty, které zde nejsou uvedeny,", this._sizeOfField * 2, posY);
            posY += mezera;
            this.renderTextLine("jsou pouhými zdmi, které nemají žádné zajímavé", this._sizeOfField * 2, posY);
            posY += mezera;
            this.renderTextLine("vlastnosti. Nelze je odtlačit a ani je není možno", this._sizeOfField * 2, posY);
            posY += mezera;
            this.renderTextLine("žádným způsobem rozbít.", this._sizeOfField * 2, posY);
        }

        context.drawImage(imgMenuLeftArrow, 0, 0, 17, 35, this._sizeOfField * 11, this._canvasHeight - this._sizeOfField * 2, this._sizeOfField, this._sizeOfField * 2);
        context.drawImage(imgMenuMiddlePanel, 0, 0, 131, 33, this._sizeOfField * 12, this._canvasHeight - this._sizeOfField * 2, this._sizeOfField * 7, this._sizeOfField * 2);
        context.drawImage(imgMenuRightArrow, 0, 0, 17, 35, this._sizeOfField * 19, this._canvasHeight - this._sizeOfField * 2, this._sizeOfField, this._sizeOfField * 2);
    }
}