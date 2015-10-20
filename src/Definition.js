export default class Definition {

    get module() { return this._module; }

    set module(value) { this._module = value; }

    get classArguments() { return this._arguments || [] }

    set classArguments(value) { this._arguments = value; }

    constructor(module = '', classArguments = []) {
        this.module         = module;
        this.classArguments = classArguments;
    }

    setModule(module) {
        this.module = module;
    }

    addArgument(argument) {
        this.classArguments.push(argument);

        return this;
    }

    setArgument(index, argument) {
        this.classArguments[index] = argument;

        return this;
    }

    removeArgument(index) {
        if (undefined !== this.classArguments[index]) {
            delete this.classArguments[index];
        }

        return this;
    }

    setArguments(classArguments) {
        this.classArguments = classArguments;
    }
}