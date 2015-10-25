export default class Container {
    services = {};

    parameterBag = null;

    constructor(services, parameterBag) {
        this.services = services;
        this.parameterBag = parameterBag;

        Object.freeze(this);
    }

    addParameter(name, value) {
        this.parameterBag.set(name, value);

        return this;
    }

    getParameter(name) {
        return this.parameterBag.get(name);
    }

    removeParameter(name) {
        this.parameterBag.remove(name);

        return this;
    }

    getParameters() {
        return this.parameterBag;
    }

    getService(id) {
        return this.services[id];
    }

    get(id) {
        return this.getService(id);
    }
}