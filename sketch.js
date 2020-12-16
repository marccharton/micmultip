/* eslint-disable no-undef, no-unused-vars */
let moduloSlider;
let tableSlider;
let speedSlider;
let thicknessSlider;

// todo : mieux gérer les sliders pour faire un objet qui englobe tout : min, max, curr, precision (la précision devrait être par slider)

// params
const modulo = {
    min : 2,
    max : 500,
    curr: 200,
};
const table = {
    min : 2,
    max : 200,
    curr: 2,
}; 
const speed = {
    min : 1,
    max : 100,
    curr: 10,
}; 
const thickness = {
    min : 1,
    max : 20,
    curr: 1,
}; 

const circleSize = 400;
const dotSize = 5;
let positionList = [];
const precision = 1000;

const center = {};

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
}

function createSliders() {
    //modulo.max *= precision;
    //modulo.curr *= precision;
    moduloSlider = new Slider("modulo", modulo.min, modulo.max, modulo.curr);
    moduloSlider.input(draw);

    table.max *= precision;
    table.curr *= precision;
    tableSlider = new Slider("table", table.min, table.max, table.curr);
    tableSlider.input(draw);
    
    speedSlider = new Slider("speed", speed.min, speed.max, speed.curr);
    speedSlider.input(draw);
    
    thicknessSlider = new Slider("thickness", thickness.min, thickness.max, thickness.curr);
    thicknessSlider.input(draw);
}
function draw() {
    background(255);

    tableSlider.value = tableSlider.value + speedSlider.value;

    moduloSlider.draw();
    tableSlider.draw(precision);
    speedSlider.draw();

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

    strokeWeight(thicknessSlider.value);
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
