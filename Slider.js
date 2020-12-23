class Slider {
    static _counter = 0;  
    x = 100;
    y = 50; // calculé en fonction du nombre de sliders présents
    precision = null;

    static get counter() {
        return this._counter++;
    }

    get valueRaw() {
        return this.slider.value();
    }
    get value() {
        const value = this.slider.value();
        return (this.precision !== null) ? value / this.precision : value;
    }
    set value(value) {
        this.slider.elt.value = value;
        return this.slider.elt.value;
    }
    increment(number) {
        this.value = this.valueRaw + number;
    }

    constructor(name, {min, max, current, precision}, handleOnChange) {
        this.name = name;        
        this.min = min;
        this.max = max;
        this.current = current;
        if (precision !== undefined) {
            this.precision = precision;
            this.max *= this.precision;
            this.current *= this.precision;
        }
        this.init(handleOnChange);
    }

    init(handleOnChange) {
        this.slider = createSlider(this.min, this.max, this.current);
        this.y += 20 * Slider.counter;
        this.slider.position(this.x + 120, this.y);
        this.slider.style("width", "700px");
        
        if (handleOnChange !== undefined) {
            this.slider.input(handleOnChange);
        }
    }

    drawText() {
        textSize(15);
        text(`${this.name} = ${this.value}`, this.x, this.y + 15);
    }

    input(cb) {
        this.slider.input(cb);
    }

    show() {
        this.slider.show();
    }

    hide() {
        this.slider.hide();
    }
}