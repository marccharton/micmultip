/* eslint-disable no-undef, no-unused-vars */
let moduloSlider;
let tableSlider;

// params
let modulo = 10; // todo : gérer modulo décimaux
let table = 2; 
const circleSize = 400;
const dotSize = 5;
let positionList = [];
const lineThickness = 1;

const center = {};

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(5);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
}

function createSliders() {
    moduloSlider = new Slider("modulo", 2, 2000, modulo);
    moduloSlider.input(draw);

    tableSlider = new Slider("table", 2, 5000, table);
    tableSlider.input(draw);
}
function draw() {
    background(255);

    moduloSlider.draw();
    tableSlider.draw();

    push();
    translate(center.x, center.y);
    rotate(-PI / 2);

    positionList = [];


    fill(0); // todo : ajouter un degradé de couleur fonction de l'avancement dans le cercle
    strokeWeight(lineThickness);

    modulo = moduloSlider.value();

    const offset = TWO_PI / modulo;
    let currentPos = [];
    for (let i = 0; i < modulo; i += 1) {
        currentPos = [
            Math.floor(cos(offset * i) * circleSize),
            Math.floor(sin(offset * i) * circleSize),
        ];
        positionList.push(currentPos);
        circle(...currentPos, dotSize);
    }
    console.log({ positionList });


    fill(15);
    stroke(0);

    table = tableSlider.value() / 10;
    modulo = moduloSlider.value();

    for (let i = 0; i < modulo; i += 1) {
        const from = (TWO_PI / modulo) * i;
        const to = (TWO_PI / modulo) * ((table * i) % modulo);
    
        line(
            round(cos(from) * circleSize),
            round(sin(from) * circleSize),
            round(cos(to) * circleSize),
            round(sin(to) * circleSize),
        );
    }
    pop();

    console.log({ positionList });
    noLoop();
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
