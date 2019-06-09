class Actor {
    constructor(name, x, y, posImg) {
        this._name = name;
        this._x = x;
        this._y = y;
        this._posImg = posImg;
    }
    getName() {
        return this._name;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    setX(x) {
        this._x = x;
    }

    setY(y) {
        this._y = y;
    }

    print() {
        console.log(this._name + " = [" + this._x + "," + this._y + "]");
    }

}

class Moveable extends Actor {
    constructor(name, x, y, posImg) {
        super(name, x, y, posImg);
    }

    move(x, y) {
        this.setX(this.getX() + x);
        this.setY(this.getY() + y);
    }
}

class Gate extends Actor {
    constructor(x, y, posImg) {
        super(GATE_NAME, x, y, posImg);
        this._isOpen = false;
    }
    isOpen() {
        return this._isOpen;
    }
    setOpen(isOpen) {
        this._isOpen = isOpen;
    }
}

class Picker extends Actor {
    constructor(x, y, posImg) {
        super(PICKER_NAME, x, y, posImg);
    }
}
class Key extends Actor {
    constructor(x, y, color, posImg) {
        super(KEY_NAME, x, y, posImg);
        this._color = color;
    }

    getColor() {
        return this._color;
    }
}

class Wall extends Actor {
    constructor(x, y, posImg) {
        super(WALL_NAME, x, y, posImg);
    }
}

class Ground extends Actor {
    constructor(x, y, posImg) {
        super(GROUND_NAME, x, y, posImg);
    }
}

class Box extends Moveable {
    constructor(x, y, posImg) {
        super(BOX_NAME, x, y, posImg);
    }
}

class Tnt extends Moveable {
    constructor(x, y, posImg) {
        super(TNT_NAME, x, y, posImg);
    }
}

class Stone extends Actor {
    constructor(x, y, posImg) {
        super(STONE_NAME, x, y, posImg);
    }
}

class ColorDoor extends Actor {
    constructor(x, y, color, posImg) {
        super(COLOR_DOOR_NAME, x, y, posImg);
        this._color = color;
        this._isOpen = false;
    }
    isOpen() {
        return this._isOpen;
    }
    setOpen(isOpen) {
        this._isOpen = isOpen;
    }

    getColor() {
        return this._color;
    }
}

class ColorEntry extends Actor {
    constructor(x, y, color, posImg) {
        super(COLOR_ENTRY_NAME, x, y, posImg);
        this._color = color;
        this._isOpen = false;
    }
    isOpen() {
        return this._isOpen;
    }
    setOpen(isOpen) {
        this._isOpen = isOpen;
    }

    getColor() {
        return this._color;
    }
}

class OneWayDoor extends Actor {
    constructor(x, y, posImg) {
        super(ONEWAY_DOOR_NAME, x, y, posImg);
        this._isOpen = true;
    }
    isOpen() {
        return this._isOpen;
    }
    setOpen(isOpen) {
        this._isOpen = isOpen;
    }
}

class LadyBeetle extends Moveable {
    constructor(x, y, rank, isActive, direction, posImg) {
        super(LADY_BEETLE_NAME, x, y, posImg);
        this._rank = rank;
        this._isActive = isActive;
        this._direction = direction;
        this._hasColorKey = false;
        this._numberOfPickers = 0;
    }
}

class Field {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._actor = null;
    }

    toString() {
        return this._x + this._y;
    }
}

class Desk {
    constructor(width, height) {
        this._x = width;
        this._y = height;
        this._boardDesk = this.createDesk();
    }

    createDesk() {
        let desk = new Array(this._x);
        for (var i = 0; i < this._x; i++) {
            desk[i] = new Array(this._y);
        }

        // initialize desk with fields 
        for (let x = 0; x < this._x; x++) {
            for (let y = 0; y < this._y; y++) {

                desk[x][y] = new Field(x, y);
            }
        }
        return desk;
    }

    printDesk() {
        for (let y = 0; y < this._y; y++) {
            let s = "";
            for (let x = 0; x < this._x; x++) {
                s += this._desk[y][x].toString() + " ";
            }
            console.log(s);
        }
    }
}