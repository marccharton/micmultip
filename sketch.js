/* eslint-disable no-undef, no-unused-vars */
let moduloSlider;
let multipSlider;

// params
let modulo = 10;
let multip = 100;
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
    moduloSlider = new Slider("modulo", 2, 500, 10);
    moduloSlider.input(draw);
    
    multipSlider = new Slider("table", 2, 200, 2);
    multipSlider.input(draw);
}
function draw() {
    background(255);
    
    moduloSlider.draw();
    multipSlider.draw();
    
    push();
    translate(center.x, center.y);
    rotate(-PI / 2);

    positionList = [];
    

    fill(0); // todo : ajouter un degradé de couleur fonction de l'avancement dans le cercle
    strokeWeight(lineThickness);
    
    modulo = moduloSlider.value();

    const pas = TWO_PI / modulo;
    let currentPos = [];
    for (let i = 0; i < modulo; i += 1) {
        currentPos = [
            Math.floor(cos(pas * i) * circleSize),
            Math.floor(sin(pas * i) * circleSize),
        ];
        positionList.push(currentPos);
        circle(...currentPos, dotSize);
    }

    console.log({ positionList });

    fill(15);
    stroke(0);

    multip = multipSlider.value();
    modulo = moduloSlider.value();

    for (let i = 0; i < modulo; i += 1) {
        const from = i;
        const to = (multip * i) % modulo;
        line(positionList[from][0], positionList[from][1], positionList[to][0], positionList[to][1]);
    }
    pop();

    noLoop();
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
