'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ParameterBag = require('./ParameterBag');

var _ParameterBag2 = _interopRequireDefault(_ParameterBag);

var _Definition = require('./Definition');

var _Definition2 = _interopRequireDefault(_Definition);

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

var _LoaderAbstractLoader = require('./Loader/AbstractLoader');

var _LoaderAbstractLoader2 = _interopRequireDefault(_LoaderAbstractLoader);

var ContainerBuilder = (function () {
    function ContainerBuilder() {
        _classCallCheck(this, ContainerBuilder);

        this.frozen = false;
        this.services = {};
        this.definitions = {};
        this.tags = {};
        this.parameterBag = null;

        this.parameterBag = new _ParameterBag2['default']([]);
        this.container = new _Container2['default']();

        this.loaders = [];
    }

    _createClass(ContainerBuilder, [{
        key: 'isFrozen',
        value: function isFrozen() {
            return this.frozen;
        }
    }, {
        key: 'freeze',
        value: function freeze() {
            this.frozen = true;
        }
    }, {
        key: 'addLoader',
        value: function addLoader(loader) {
            if (!(loader instanceof _LoaderAbstractLoader2['default'])) {
                throw new Error("Must pass an instance of AbstractLoader");
            }

            this.loaders.push(loader);
        }
    }, {
        key: 'build',
        value: function build() {
            for (var _index in this.loaders) {
                if (!this.loaders.hasOwnProperty(_index)) {
                    continue;
                }

                this.buildParametersFromJson(this.loaders[_index].buildParameters());
                this.buildServicesFromJson(this.loaders[_index].buildServices());
            }

            this.buildDefinitions();

            return this.container.build(this.services, this.parameterBag, this.tags);
        }
    }, {
        key: 'buildDefinitions',
        value: function buildDefinitions() {
            if (this.isFrozen()) {
                throw Error("Container has already been built.");
            }

            var definitions = [];

            for (var _name in this.definitions) {
                if (this.definitions.hasOwnProperty(_name)) {
                    definitions.push({ name: _name, definition: this.definitions[_name] });
                }
            }

            var loops = 0,
                removed = 0;
            while (definitions.length > 0) {
                if (loops >= 50 && removed === 0) {
                    throw new Error("Possible circular reference detected: Check the service definition for: " + JSON.stringify(definitions.map(function (definition) {
                        return definition.name;
                    })));
                }

                removed = 0;
                for (var _index2 in definitions) {
                    var data = definitions[_index2],
                        _name2 = data.name,
                        definition = data.definition;

                    if (this.argumentsInitialized(_name2, definition)) {
                        loops = 0;

                        if (typeof definition.module !== 'function') {
                            throw new Error('Module for definition \'' + _name2 + '\' is not a valid module.');
                        }

                        this.services[_name2] = new (_bind.apply(definition.module, [null].concat(_toConsumableArray(this.prepareArguments(definition.classArguments)))))();

                        this.addTags(_name2, definition.tags);

                        definitions.splice(_index2, 1);
                        removed++;
                    }
                }

                loops++;
            }

            this.frozen = true;
        }
    }, {
        key: 'addTags',
        value: function addTags(serviceName, tags) {
            for (var _index3 in tags) {
                if (!tags.hasOwnProperty(_index3)) {
                    continue;
                }

                var tag = tags[_index3];

                if (this.tags[tag] === undefined) {
                    this.tags[tag] = [];
                }

                this.tags[tag].push(serviceName);
            }
        }
    }, {
        key: 'argumentsInitialized',
        value: function argumentsInitialized(name, definition) {
            if (definition.classArguments.length < 1) {
                return true;
            }

            var args = definition.classArguments;
            for (var _index4 in args) {
                if (!args.hasOwnProperty(_index4)) {
                    continue;
                }

                var arg = args[_index4];
                if (!arg) {
                    continue;
                }

                if (this.services[arg.replace('@', '')] === undefined) {
                    return false;
                }
            }

            return true;
        }
    }, {
        key: 'prepareArguments',
        value: function prepareArguments(args) {
            for (var _index5 in args) {
                if (!args.hasOwnProperty(_index5)) {
                    continue;
                }

                args[_index5] = this.parseArgument(args[_index5]);
            }

            return args;
        }
    }, {
        key: 'parseArgument',
        value: function parseArgument(arg) {
            if (Array.isArray(arg)) {
                return this.prepareArguments(args[index]);
            }

            if (typeof arg === 'string') {
                if (arg.indexOf('%') === 0 && arg.substring(1).indexOf('%') === arg.length - 2) {
                    var _name3 = arg.substring(1).slice(0, -1);
                    if (!this.hasParameter(_name3)) {
                        throw new Error("Parameter doesn't exist: " + _name3);
                    }

                    return this.getParameter(_name3);
                }

                if (arg === '@container') {
                    return this.container;
                }

                if (arg.indexOf('@') === 0) {
                    var _name4 = arg.replace('@', '');
                    if (_name4 === 'container') {
                        return this;
                    }

                    if (!this.hasService(_name4)) {
                        throw new Error("Service doesn't exist: " + _name4);
                    }
                }
            }

            return arg;
        }
    }, {
        key: 'buildParametersFromJson',
        value: function buildParametersFromJson(parameters) {
            var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            for (var key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    var value = parameters[key];
                    if (value !== 'null' && typeof value === 'object') {
                        this.addParameter(prefix + key, value);
                        this.buildParametersFromJson(value, key + '.');
                        continue;
                    }

                    this.addParameter(prefix + key, value);
                }
            }
        }
    }, {
        key: 'buildServicesFromJson',
        value: function buildServicesFromJson(services) {
            for (var _name5 in services) {
                if (!services.hasOwnProperty(_name5)) {
                    continue;
                }

                var info = services[_name5];
                if (info.reference !== undefined) {
                    this.services[_name5] = info.reference;
                    continue;
                }

                if (info.module !== undefined) {
                    this.setDefinition(_name5, new _Definition2['default'](info.module, info.args, info.tags));
                }
            }
        }
    }, {
        key: 'setDefinition',
        value: function setDefinition(id, definition) {
            if (this.isFrozen()) {
                throw new Error('Adding definition to a frozen container is not allowed');
            }

            return this.definitions[id] = definition;
        }
    }, {
        key: 'getDefinition',
        value: function getDefinition(id) {
            return this.definitions[id];
        }
    }, {
        key: 'addParameter',
        value: function addParameter(name, value) {
            this.parameterBag.set(name, value);

            return this;
        }
    }, {
        key: 'getParameter',
        value: function getParameter(name) {
            return this.parameterBag.get(name);
        }
    }, {
        key: 'hasParameter',
        value: function hasParameter(name) {
            return this.parameterBag.has(name);
        }
    }, {
        key: 'removeParameter',
        value: function removeParameter(name) {
            this.parameterBag.remove(name);

            return this;
        }
    }, {
        key: 'getParameters',
        value: function getParameters() {
            return this.parameterBag;
        }
    }, {
        key: 'getService',
        value: function getService(id) {
            return this.services[id];
        }
    }, {
        key: 'hasService',
        value: function hasService(id) {
            return this.services[id] !== undefined;
        }
    }, {
        key: 'get',
        value: function get(id) {
            return this.getService(id);
        }
    }, {
        key: 'has',
        value: function has(id) {
            return this.hasService(id);
        }
    }], [{
        key: 'buildFromJson',
        value: function buildFromJson(json) {
            return ContainerBuilder.prepareFromJson(json).build();
        }
    }, {
        key: 'prepareFromJson',
        value: function prepareFromJson(json) {
            var builder = new ContainerBuilder();

            if (json.parameters !== undefined) {
                builder.buildParametersFromJson(json.parameters);
            }

            if (json.services !== undefined) {
                builder.buildServicesFromJson(json.services);
            }

            return builder;
        }
    }]);

    return ContainerBuilder;
})();

exports['default'] = ContainerBuilder;
module.exports = exports['default'];
