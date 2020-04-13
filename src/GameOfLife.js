import {html, render} from "https://unpkg.com/lit-html@1.2.1/lit-html.js"
import Cell from "./Cell.js";
import {DEFAULT_SERVICE_URL} from "./defaults.service-url.js"

const CELLS_IN_ROW = Math.floor(document.documentElement.clientWidth / 50);
const CELLS_IN_COLUMN = Math.floor((document.documentElement.clientHeight / document.documentElement.clientWidth) * CELLS_IN_ROW)
const INITIAL_SIZE = {
    width: CELLS_IN_ROW,
    height: CELLS_IN_COLUMN
};

export default class GameOfLife extends HTMLElement {

    shadowRoot;

    constructor() {
        super();

        this.state = {};
        this.configureSize(INITIAL_SIZE);

        this.state.round = 0;
        this.state.cells = this.cells([]);

        this.shadowRoot = this.attachShadow({mode: "open"});

        document.addEventListener("keyup", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.nextRound();
            }
        });
    }

    configureSize(size) {
        this.state.size = size;
        this.style.setProperty("--matchfield-width", this.state.size.width);
        this.style.setProperty("--matchfield-height", this.state.size.height);
    }

    getServerUrl() {
        const serverUrl = this.getAttribute("data-server-url");
        return serverUrl === null ? DEFAULT_SERVICE_URL : serverUrl;
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
        const response = await fetch(`${this.getServerUrl()}/nextRound`, {
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
        <style type="text/css">@import "styles.css";</style>
        <section>
            <div class="top-bar">
              <div><a target="_blank" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's Game of Life</a> - Round ${this.state.round}</div>
              <div><a class="github" target="_blank" href="https://github.com/habizzle/game-of-life-html5" title="Fork me on GitHub"></a></div>
            </div>
            <div class="matchfield">
              ${this.state.cells.map(cell => this.renderCell(cell))}
            </div>
            <a class="next" href="#" @click="${e => this.onNextClick(e)}" title="Breed next generation"></a>
        </section>
        `;
        render(template, this.shadowRoot);
    }

    onNextClick(event) {
        event.preventDefault();
        this.nextRound();
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