export default class Cell {
    x;
    y;
    alive;

    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
    }
}