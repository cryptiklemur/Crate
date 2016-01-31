import ParameterBag from './ParameterBag';
import Definition from './Definition';
import Container from './Container';

export default class ContainerBuilder {
    frozen = false;

    services = {};

    definitions = {};

    tags = {};

    parameterBag = null;

    constructor() {
        this.parameterBag = new ParameterBag([]);
        this.container    = new Container();
    }

    isFrozen() {
        return this.frozen;
    }

    freeze() {
        this.frozen = true;
    }

    build() {
        this.buildDefinitions();

        return this.container.build(this.services, this.parameterBag, this.tags);
    }

    static buildFromJson(json) {
        return ContainerBuilder.prepareFromJson(json).build();
    }

    static prepareFromJson(json) {
        let builder = new ContainerBuilder();

        if (json.parameters !== undefined) {
            builder.buildParametersFromJson(json.parameters);
        }

        if (json.services !== undefined) {
            builder.buildServicesFromJson(json.services)
        }

        return builder;
    }

    buildDefinitions() {
        if (this.isFrozen()) {
            throw Error("Container has already been built.");
        }

        let definitions = [];

        for (let name in this.definitions) {
            if (this.definitions.hasOwnProperty(name)) {
                definitions.push({name: name, definition: this.definitions[name]});
            }
        }

        let loops = 0;
        while (definitions.length > 0) {
            if (loops >= 50) {
                throw Error("Circular reference detected");
            }

            for (let index in definitions) {
                let data       = definitions[index],
                    name       = data.name,
                    definition = data.definition;

                if (this.argumentsInitialized(name, definition)) {
                    loops = 0;

                    if (typeof definition.module !== 'function') {
                        throw new Error(`Module for definition '${name}' is not a valid module.`);
                    }

                    this.services[name] = new definition.module(
                        ...this.prepareArguments(definition.classArguments)
                    );

                    this.addTags(name, definition.tags);

                    definitions.splice(index, 1);
                }
            }

            loops++;
        }

        this.frozen = true;
    }

    addTags(serviceName, tags) {
        for (let index in tags) {
            if (!tags.hasOwnProperty(index)) {
                continue;
            }

            let tag = tags[index];

            if (this.tags[tag] === undefined) {
                this.tags[tag] = [];
            }

            this.tags[tag].push(serviceName);
        }
    }

    argumentsInitialized(name, definition) {
        if (definition.classArguments.length < 1) {
            return true;
        }

        let args = definition.classArguments;
        for (let index in args) {
            if (!args.hasOwnProperty(index)) {
                continue;
            }

            let arg = args[index];
            if (arg === null || arg.$ref === undefined) {
                continue;
            }

            if (this.services[arg.$ref] === undefined) {
                return false;
            }
        }

        return true;
    }

    prepareArguments(args) {
        for (let index in args) {
            if (!args.hasOwnProperty(index)) {
                continue;
            }

            args[index] = this.parseArgument(args[index]);
        }

        return args;
    }

    parseArgument(arg) {
        if (Array.isArray(arg)) {
            return this.prepareArguments(args[index]);
        }

        if (typeof arg === 'string') {
            if (arg.indexOf('%') === 0 && arg.substring(1).indexOf('%') === arg.length - 2) {
                let name = arg.substring(1).slice(0, -1);
                if (!this.hasParameter(name)) {
                    throw new Error("Parameter doesn't exist: " + name);
                }

                return this.getParameter(name);
            }
            if (arg === '$container') {
                return this.container;
            }
        }

        if (typeof arg === 'object' && arg !== null) {
            if (arg.$ref !== undefined) {
                if (typeof arg.$ref === 'string') {
                    return this.services[arg.$ref];
                } else {
                    return arg.$ref;
                }
            }

        }

        return arg;
    }

    buildParametersFromJson(parameters, prefix = '') {
        for (let key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                let value = parameters[key];
                if (value !== 'null' && typeof value === 'object') {
                    this.addParameter(prefix + key, value);
                    this.buildParametersFromJson(value, key + '.');
                    continue;
                }

                this.addParameter(prefix + key, value);
            }
        }
    }

    buildServicesFromJson(services) {
        for (let name in services) {
            if (!services.hasOwnProperty(name)) {
                continue;
            }

            let info = services[name];
            if (info.reference !== undefined) {
                this.services[name] = info.reference;
                continue;
            }

            if (info.module !== undefined) {
                this.setDefinition(name, new Definition(info.module, info.args, info.tags));
            }
        }
    }

    setDefinition(id, definition) {
        if (this.isFrozen()) {
            throw new Error('Adding definition to a frozen container is not allowed');
        }

        return this.definitions[id] = definition;
    }

    getDefinition(id) {
        return this.definitions[id];
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
        if (!this.isFrozen()) {
            throw new Error("Cannot grab services when the container isn't built");
        }

        return this.services[id];
    }

    get(id) {
        return this.getService(id);
    }
}
