export default class ParameterBag {
    get parameters() { return this._parameters; }
    set parameters(value) { this._parameters = value; }

    constructor(parameters = []) {
        this.parameters = parameters;
    }

    has(name) {
        return this.parameters[name] !== undefined;
    }

    get(name, defaultValue = undefined) {
        return this.has(name) ? this.parameters[name] : defaultValue
    }

    set(name, value) {
        this.parameters[name] = value;

        return this;
    }

    remove(name) {
        delete this.parameters[name];

        return this;
    }

    all() {
        return this.parameters;
    }
}
