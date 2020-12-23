// sliders
const modulo = { min : 2, max : 700, current: 400, };
const table = { min : 2, max : 200, current: 50, precision : 1000, }; 
const speed = { min : 1, max : 100, current: 5, }; 
const thickness = { min : 1, max : 300, current: 2, }; 
const dotSize = { min : 0, max : 200, current: 20, }; 
const tilt = { min : 0, max : 50, current: 0, }; 
const sliders = [];

let circleSize;
let tweakerVisibility = false;

const COLORS_MODE = {
    normal : 0,
    dark : 1,
};

const colorSet = [
    {
        font: 0,
        background: 255,
    },
    {
        font: 255,
        background: 0,
    }
];

let colors = {
    from: "#000",
    to: "#FFF",
    interface: COLORS_MODE.dark,
};

function setup() {
    createControls();
    createCanvas(windowWidth, windowHeight).parent("container");;
    frameRate(30);
    colors.list = generateGradient(colors.from, colors.to);

    circleSize = windowHeight / 2.5;
}

function createControls() {
    modulo.slider = new Slider("modulo", modulo, () => { colors.list = generateGradient(colors.from, colors.to) });
    table.slider = new Slider("table", table);
    speed.slider = new Slider("speed", speed);
    thickness.slider = new Slider("thickness", thickness);
    dotSize.slider = new Slider("Dots Size", dotSize);
    tilt.slider = new Slider("Tilt Mode", tilt);

    sliders.push(modulo.slider);
    sliders.push(table.slider);
    sliders.push(speed.slider);
    sliders.push(thickness.slider);
    sliders.push(dotSize.slider);
    sliders.push(tilt.slider);

    changeColorsButton = createButton("Random Colors");
    changeColorsButton.position(100, 10);
    changeColorsButton.mousePressed(randomColors);

    showTweakerButton = createButton("Show Tweaker Box");
    showTweakerButton.position(220, 10);
    showTweakerButton.mousePressed(changeTweakerVisibility);
}

function changeTweakerVisibility() {
    tweakerVisibility = !tweakerVisibility;
}

function randomColors() {
    colors.from = chroma.random();
    colors.to = chroma.random();
    colors.list = generateGradient(colors.from, colors.to);
}

function generateGradient(from, to) {
    return chroma.scale([from, to])
                 .mode('lch')
                 .colors(modulo.slider.value);
}

function draw() {
    background(colorSet[colors.interface].background);
    fill(colorSet[colors.interface].font);

    table.slider.increment(speed.slider.value);

    sliders.forEach(slider => {
        if (tweakerVisibility) {
            slider.show();
            slider.drawText();
        } else {
            slider.hide();
        }
    });

    push();
    
    translate(windowWidth / 2, windowHeight / 2);
    rotate(-PI / 2);
    rotate(-table.slider.value);

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
        fill(colors.list[colors.list.length - i - 1]);
        circle(
            Math.floor(cos(offset * i) * circleSize) + random(-tilt.slider.value, tilt.slider.value),
            Math.floor(sin(offset * i) * circleSize) + random(-tilt.slider.value, tilt.slider.value), 
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
    
        if (colors.list.length > 0) {
            stroke(colors.list[i]);
        }

        line(
            round(cos(from) * circleSize) + random(-tilt.slider.value, tilt.slider.value),
            round(sin(from) * circleSize) + random(-tilt.slider.value, tilt.slider.value),
            round(cos(to) * circleSize) + random(-tilt.slider.value, tilt.slider.value),
            round(sin(to) * circleSize) + random(-tilt.slider.value, tilt.slider.value),
        );
    }

}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
