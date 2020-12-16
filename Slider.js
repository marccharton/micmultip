class Slider {
    static _counter = 0;  
    x = 200;

    static get counter() {
        return this._counter++;
    }

    get value() {
        return this.slider.value();
    }
    set value(value) {
        this.slider.elt.value = value;
        return this.slider.elt.value;
    }

    constructor(name, min, max, current) {
        this.name = name;
        
        this.slider = createSlider(min, max, current);
        this.y = 10 + 20 * Slider.counter;
        this.slider.position(this.x, this.y);
        this.slider.style("width", "700px");
        console.log(this.slider);
    }

    draw() {
        textSize(15);
        const value = this.value / 10;
        text(`${this.name} = ${value}`, this.x - 100, this.y + 5);
    }

    

    input(cb) {
        this.slider.input(cb);
    }
}