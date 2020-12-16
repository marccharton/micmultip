/* eslint-disable no-undef, no-unused-vars */
let moduloSlider;
let tableSlider;

// params
const modulo = {
    min : 2,
    max : 20,
    curr: 10,
}; // todo : gérer modulo décimaux
const table = {
    min : 2,
    max : 20,
    curr: 2,
}; 
const circleSize = 400;
const dotSize = 5;
let positionList = [];
const lineThickness = 1;
const precision = 100;
const speed = 1;

const center = {};

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(10);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
}

function createSliders() {
    modulo.max *= precision;
    moduloSlider = new Slider("modulo", modulo.min, modulo.max, modulo.curr);
    moduloSlider.input(draw);

    table.max *= precision;
    tableSlider = new Slider("table", table.min, table.max, table.curr);
    tableSlider.input(draw);
}
function draw() {
    background(255);

    //tableSlider.value = 12;
    tableSlider.value = tableSlider.value + speed;

    moduloSlider.draw();
    tableSlider.draw();

    push();
    translate(center.x, center.y);
    rotate(-PI / 2);

    positionList = [];

    drawDots();
    drawLines();

    // noLoop();
}

function drawDots() {
    fill(0); // todo : ajouter un degradé de couleur fonction de l'avancement dans le cercle
    strokeWeight(lineThickness);

    modulo.curr = moduloSlider.value;

    const offset = TWO_PI / modulo.curr;
    let currentPos = [];
    for (let i = 0; i < modulo.curr; i += 1) {
        currentPos = [
            Math.floor(cos(offset * i) * circleSize),
            Math.floor(sin(offset * i) * circleSize),
        ];
        positionList.push(currentPos);
        circle(...currentPos, dotSize);
    }
    console.log({ positionList });
}

function drawLines() {
    fill(15);
    stroke(0);

    table.curr = tableSlider.value / precision;
    modulo.curr = moduloSlider.value;

    for (let i = 0; i < modulo.curr; i += 1) {
        const from = (TWO_PI / modulo.curr) * i;
        const to = (TWO_PI / modulo.curr) * ((table.curr * i) % modulo.curr);
    
        line(
            round(cos(from) * circleSize),
            round(sin(from) * circleSize),
            round(cos(to) * circleSize),
            round(sin(to) * circleSize),
        );
    }
    pop();

    console.log({ positionList });
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
