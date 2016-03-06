export default class AbstractLoader {
    constructor() {
        if (this.constructor === AbstractLoader) {
            throw new Error("Can't instantiate abstract class!");
        }

        this.files = [];
    }

    addFile(file) {
        if (typeof file === 'string') {
            throw Error("Pass in a required file, not a string.");
        }

        this.files.push(file);
    }

    buildParameters() {
        throw new Error("Must implement buildParameters")
    }

    buildServices() {
        throw new Error("Must implement buildServices")
    }
}
