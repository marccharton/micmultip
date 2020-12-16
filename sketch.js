// params
const modulo = { min : 2, max : 500, curr: 200, };
const table = { min : 2, max : 200, curr: 2, precision : 1000, }; 
const speed = { min : 1, max : 100, curr: 10, }; 
const thickness = { min : 1, max : 20, curr: 1, }; 

const circleSize = 400;
const dotSize = 5;
let positionList = [];

const center = {};

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
}

function createSliders() {
    modulo.slider = new Slider("modulo", modulo);
    table.slider = new Slider("table", table);
    speed.slider = new Slider("speed", speed);
    thickness.slider = new Slider("thickness", thickness);
    
    modulo.slider.input(draw);
    table.slider.input(draw);
    speed.slider.input(draw);
    thickness.slider.input(draw);
}
function draw() {
    background(255);

    table.slider.increment(speed.slider.value);

    modulo.slider.draw();
    table.slider.draw();
    speed.slider.draw();

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
    
    modulo.curr = modulo.slider.value;

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

    table.curr = table.slider.value;
    modulo.curr = modulo.slider.value;

    strokeWeight(thickness.slider.value);
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
