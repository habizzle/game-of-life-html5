import {html, render} from "https://unpkg.com/lit-html@1.2.1/lit-html.js"
import Cell from "./Cell.js";

const SERVER_URL = "http://localhost:4567";

const INITIAL_SIZE = {
    width: 80,
    height: 40
};

export default class GameOfLife extends HTMLElement {

    constructor() {
        super();

        this.state = {};
        this.state.size = INITIAL_SIZE;
        this.state.round = 0;
        this.state.cells = this.cells([]);

        document.addEventListener("keyup", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.nextRound();
            }
        });
    }

    cells(aliveCells) {
        function isAliveAt(aliveCells, x, y) {
            return aliveCells.some(position => position.x === x && position.y === y)
        }

        const size = this.state.size;
        const list = [];
        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                list.push(new Cell(x, y, isAliveAt(aliveCells, x, y)));
            }
        }
        return list;
    }

    async nextRound() {
        const response = await fetch(`${SERVER_URL}/nextRound`, {
            method: "PUT",
            headers: {
                "Access-Control-Request-Headers": "Content-Type",
                "Access-Control-Request-Method": "PUT",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.cellsToRequest())
        });
        const json = await response.json();
        this.state.size = json.size;
        this.state.round = this.state.round + 1;
        this.state.cells = this.cells(json.alive);
        this.renderState();
    }

    cellsToRequest() {
        const alive = this.state.cells
            .filter(cell => cell.alive)
            .map(cell => {
                return {x: cell.x, y: cell.y}
            });

        return {
            matchfield: {
                size: this.state.size,
                alive: alive
            }
        }
    }

    connectedCallback() {
        this.renderState();
    }

    renderState() {
        const template = html`
        <div class="top-bar">
          Conway's Game of Life - Round ${this.state.round}
        </div>
        <div class="matchfield">
          ${this.state.cells.map(cell => this.renderCell(cell))}
        </div>
        <div class="bottom-bar">
          <em>MOUSE</em>: Move cell selector   <em>CLICK</em>: Switch cell state (kill / resurrect)   <em>ENTER</em>: Breed next generation
        </div>
        `;
        render(template, this);
    }

    renderCell(cell) {
        return html`
        <div class="cell" data-cell-alive="${cell.alive}" @click="${_ => this.toggleCell(cell)}"/>
        `
    }

    toggleCell(cell) {
        cell.alive = !cell.alive;
        this.renderState();
    }
}

customElements.define("game-of-life", GameOfLife);