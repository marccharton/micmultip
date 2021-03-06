// sliders
const modulo = { min : 2, max : 700, current: 400, };
const table = { min : 2, max : 200, current: 133, precision : 1000, }; 
const speed = { min : 1, max : 100, current: 2, }; 
const thickness = { min : 1, max : 300, current: 1, }; 
const dotSize = { min : 0, max : 200, current: 0, }; 
const tilt = { min : 0, max : 50, current: 0, }; 
const alive = { min : 0, max : 100, current: 20, }; 
const sliders = [];

let colorIndex = 0;

let circleSize;
let tweakerVisibility = false;

const noiseFactor = 5;

const COLORS_MODE = {
    normal : 0,
    dark : 1,
    lsd : 2,
};

const colorSet = [
    {
        font: 0,
        background: 255,
    },
    {
        font: 255,
        background: 0,
    },
    {
        font: 255,
        get background() {
            return colors.list[colorIndex];
        }
    }
];

let colors = {
    from: "#000",
    to: "#FFF",
    interface: COLORS_MODE.normal,
};

function setup() {
    createControls();
    createCanvas(windowWidth, windowHeight).parent("container");;
    colors.list = generateGradient(colors.from, colors.to, modulo.slider.value);

    circleSize = windowHeight / 2.5;
}

function createControls() {
    modulo.slider = new Slider("modulo", modulo, () => { colors.list = generateGradient(colors.from, colors.to, modulo.slider.value) });
    table.slider = new Slider("table", table);
    speed.slider = new Slider("speed", speed);
    thickness.slider = new Slider("thickness", thickness);
    dotSize.slider = new Slider("dots Size", dotSize);
    tilt.slider = new Slider("tilt Mode", tilt);
    alive.slider = new Slider("alive", alive);

    sliders.push(modulo.slider);
    sliders.push(table.slider);
    sliders.push(speed.slider);
    sliders.push(thickness.slider);
    sliders.push(dotSize.slider);
    sliders.push(tilt.slider);
    sliders.push(alive.slider);

    changeColorsButton = createButton("Random Colors");
    changeColorsButton.position(100, 10);
    changeColorsButton.mousePressed(randomColors);

    randomValuesButton = createButton("Random Values");
    randomValuesButton.position(220, 10);
    randomValuesButton.mousePressed(() => {
        sliders.forEach(slider => {
            let min = slider.min;
            let max = slider.max;
            
            if (slider.name === "speed" || slider.name === "tilt Mode") {
                max /= 6;
            }
            else if (slider.name === "thickness" || slider.name === "alive" || slider.name === "dots Size") {
                max /= 3;
            }

            const newValue = round(random(min, max))
            if (slider.name === "modulo") {
                colors.list = generateGradient(colors.from, colors.to, newValue);
            }
            slider.value = newValue;
        });
        
    });

    showTweakerButton = createButton("Show Tweaker Box");
    showTweakerButton.position(340, 10);
    showTweakerButton.mousePressed(() => {
        tweakerVisibility = !tweakerVisibility;
    });

    interfaceButton = createButton("Change Background");
    interfaceButton.position(480, 10);
    interfaceButton.mousePressed(() => {
        colors.interface = colors.interface === COLORS_MODE.normal 
            ? COLORS_MODE.dark 
            : colors.interface === COLORS_MODE.dark
                ? COLORS_MODE.lsd 
                : COLORS_MODE.normal;
    });


}

function randomColors() {
    colors.from = chroma.random();
    colors.to = chroma.random();
    colors.list = generateGradient(colors.from, colors.to, modulo.slider.value);
}

function generateGradient(from, to, steps) {
    return chroma.scale([from, to, from])
                 .mode('lch')
                 .colors(steps);
}

function draw() {
    if (colorIndex >= colors.list.length - 1) {
        colorIndex = 0;
    }
    colorIndex++;

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
    rotate(-table.slider.value * alive.slider.value / 500);

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
            Math.floor(cos(offset * i) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * tilt.slider.value * 0.1) * noiseFactor * alive.slider.value,
            Math.floor(sin(offset * i) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * tilt.slider.value * 0.1) * noiseFactor * alive.slider.value, 
            dotSize.slider.value,
        );
    }
}

function drawLines() {

    table.current = table.slider.value;
    modulo.current = modulo.slider.value - 1;

    strokeWeight(thickness.slider.value);
    for (let i = 0; i < modulo.current; i += 1) {
        const from = (TWO_PI / modulo.current) * i;
        const to = (TWO_PI / modulo.current) * ((table.current * i) % modulo.current);
    
        if (colors.list.length > 0) {
            // console.log(i);
            // console.log(colors.list[i]);
            stroke(colors.list[i]);
        }

        line(
            round(cos(from) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * 0.1) * noiseFactor * alive.slider.value,
            round(sin(from) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * 0.1) * noiseFactor * alive.slider.value,
            round(cos(to) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * 0.0) * noiseFactor * alive.slider.value,
            round(sin(to) * circleSize) + random(-tilt.slider.value, tilt.slider.value) + noise(table.current * 0.1) * noiseFactor * alive.slider.value,
        );
    }
}

// This Redraws the Canvas when resized
windowResized = function () {
    circleSize = windowHeight / 2.5;
    resizeCanvas(windowWidth, windowHeight);
};
