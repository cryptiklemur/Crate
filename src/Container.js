export default class Container {
    services = {};

    parameterBag = null;

    tags = {};

    frozen = false;

    build(services, parameterBag, tags) {
        if (this.frozen) {
            throw Error("Cannot build the container. Already built.");
        }

        this.services     = services;
        this.parameterBag = parameterBag;
        this.tags         = tags;

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

    hasParameter(name) {
        return this.parameterBag.has(name);
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

    hasService(id) {
        return this.services[id] !== undefined;
    }

    has(id) {
        return this.hasService(id);
    }

    findTaggedServiceIds(name) {
        return this.tags[name];
    }
}