export default class Container {
    services = {};

    parameterBag = null;

    frozen = false;

    build(services, parameterBag) {
        if (this.frozen) {
            throw Error("Cannot build the container. Already built.");
        }

        this.services     = services;
        this.parameterBag = parameterBag;

        this.frozen = true;
        Object.freeze(this);

        return this;
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