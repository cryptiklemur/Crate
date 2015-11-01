export default class Definition {
    get module() { return this._module; }

    set module(value) { this._module = value; }

    get classArguments() { return this._arguments || []; }

    set classArguments(value) { this._arguments = value; }

    get tags() { return this._tags || []; }

    set tags(value) { this._tags = value; }

    constructor(module = '', classArguments = [], tags = []) {
        this.module         = module;
        this.classArguments = classArguments;
        this.tags           = tags;
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

    setTags(tags) {
        this.tags = tags;
    }

    getTags() {
        return this.tags;
    }

    addTag(name) {
        this.tags.push(name);
    }
}