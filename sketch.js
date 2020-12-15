/* eslint-disable no-undef, no-unused-vars */
let moduloSlider;
let multipSlider;

// params
let modulo = 10;
let multip = 100;
const circleSize = 400;
const dotSize = 10;
let positionList = [];
const lineThickness = 1;

const center = {};

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(5);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;

    init();
}

function createSliders() {
    moduloSlider = new Slider("modulo", 2, 200, 5);
    moduloSlider.input(init);
    
    multipSlider = new Slider("table", 2, 200, 20);
    multipSlider.input(init);
}

function init() {
    background(255);

    positionList = [];
    
    moduloSlider.draw();
    multipSlider.draw();


    fill(0);
    strokeWeight(lineThickness);
    
    modulo = moduloSlider.value();

    const pas = TWO_PI / modulo;
    let currentPos = [];
    for (let i = 0; i < modulo; i += 1) {
        currentPos = [
            Math.floor(center.x + cos(pas * i) * circleSize),
            Math.floor(center.y + sin(pas * i) * circleSize),
        ];
        positionList.push(currentPos);
        circle(...currentPos, dotSize);
    }

    console.log({ positionList });
    loop();
}

function draw() {

    fill(15);
    stroke(0);

    multip = multipSlider.value();
    modulo = moduloSlider.value();
    for (let i = 0; i < modulo; i += 1) {
        const from = i;
        const to = (multip * i) % modulo;

        // console.log("from", from, positionList[from]);
        // console.log("to", to, positionList[to]);
        line(positionList[from][0], positionList[from][1], positionList[to][0], positionList[to][1]);
    }

    noLoop();
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
