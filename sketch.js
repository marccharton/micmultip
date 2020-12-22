// params
const modulo = { min : 2, max : 500, current: 200, };
const table = { min : 2, max : 200, current: 2, precision : 1000, }; 
const speed = { min : 1, max : 100, current: 10, }; 
const thickness = { min : 1, max : 20, current: 1, }; 
const dotSize = { min : 1, max : 50, current: 5, }; 
const sliders = [];

const circleSize = 400;
//const dotSize = 5;

const center = {};
let colors = [];

function setup() {
    createSliders();
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
}

function createSliders() {
    modulo.slider = new Slider("modulo", modulo, () => {
        colors = chroma.scale([chroma.random(),chroma.random()])
                   .mode('lch')
                   .colors(modulo.slider.value);
    });
    table.slider = new Slider("table", table, () => { draw(); } );
    speed.slider = new Slider("speed", speed, () => { draw(); } );
    thickness.slider = new Slider("thickness", thickness, () => { draw(); } );
    dotSize.slider = new Slider("Dots Size", dotSize, () => { draw(); } );

    sliders.push(modulo.slider);
    sliders.push(table.slider);
    sliders.push(speed.slider);
    sliders.push(thickness.slider);
    sliders.push(dotSize.slider);
}

function draw() {
    background(255);

    table.slider.increment(speed.slider.value);

    sliders.forEach(slider => slider.update());

    push();
    
    translate(center.x, center.y);
    rotate(-PI / 2);
    

    drawLines();
    drawPoints();
    
    pop();
}

function drawPoints() {
    fill(0);
    noStroke();
    
    modulo.current = modulo.slider.value;
    const offset = TWO_PI / modulo.current;

    for (let i = 0; i < modulo.current; i += 1) {
        circle(
            Math.floor(cos(offset * i) * circleSize),
            Math.floor(sin(offset * i) * circleSize), 
            dotSize.slider.value,
        );
    }
}

function drawLines() {

    table.current = table.slider.value;
    modulo.current = modulo.slider.value;

    strokeWeight(thickness.slider.value);
    for (let i = 0; i < modulo.current; i += 1) {
        const from = (TWO_PI / modulo.current) * i;
        const to = (TWO_PI / modulo.current) * ((table.current * i) % modulo.current);
    
        if (colors.length > 0) {
            stroke(colors[i]);
        }

        line(
            round(cos(from) * circleSize),
            round(sin(from) * circleSize),
            round(cos(to) * circleSize),
            round(sin(to) * circleSize),
        );
    }

}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
