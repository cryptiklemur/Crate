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

var ContainerBuilder = (function () {
    function ContainerBuilder() {
        _classCallCheck(this, ContainerBuilder);

        this.frozen = false;
        this.definitions = {};
        this.parameterBag = null;

        this.parameterBag = new _ParameterBag2['default']([]);
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
        key: 'build',
        value: function build() {
            var services = this.buildDefinitions();

            return new _Container2['default'](services, this.parameterBag);
        }
    }, {
        key: 'buildDefinitions',
        value: function buildDefinitions() {
            if (this.isFrozen()) {
                throw Error("Container has already been built.");
            }

            var services = {},
                definitions = [];

            for (var _name in this.definitions) {
                if (this.definitions.hasOwnProperty(_name)) {
                    definitions.push({ name: _name, definition: this.definitions[_name] });
                }
            }

            var loops = 0;
            while (definitions.length > 0) {
                if (loops >= 50) {
                    throw Error("Circular reference detected");
                }

                for (var _index in definitions) {
                    var data = definitions[_index],
                        _name2 = data.name,
                        definition = data.definition;

                    if (this.argumentsInitialized(_name2, definition)) {
                        loops = 0;

                        services[_name2] = new (_bind.apply(definition.module, [null].concat(_toConsumableArray(this.prepareArguments(definition.classArguments)))))();

                        definitions.splice(_index, 1);
                    }
                }

                loops++;
            }

            this.frozen = true;

            return services;
        }
    }, {
        key: 'argumentsInitialized',
        value: function argumentsInitialized(name, definition) {
            if (definition.classArguments.length < 1) {
                return true;
            }

            var args = definition.classArguments;
            for (var _index2 in args) {
                if (!args.hasOwnProperty(_index2)) {
                    continue;
                }

                var arg = args[_index2];
                if (arg.$ref === undefined) {
                    continue;
                }

                if (this.services[arg.$ref] === undefined) {
                    return false;
                }
            }

            return true;
        }
    }, {
        key: 'prepareArguments',
        value: function prepareArguments(args) {
            for (var _index3 in args) {
                if (!args.hasOwnProperty(_index3)) {
                    continue;
                }

                args[_index3] = this.parseArgument(args[_index3]);
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
                    return this.getParameter(arg.substring(1).slice(0, -1));
                }
            }

            if (typeof arg === 'object') {
                if (arg.$ref !== undefined) {
                    return this.services[arg.$ref];
                }
            }

            console.error(arg);
            throw Error("Passed arg is not a valid argument");
        }
    }, {
        key: 'buildParametersFromJson',
        value: function buildParametersFromJson(parameters) {
            var prefix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            for (var key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    var value = parameters[key];
                    if (typeof value !== 'string') {
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
            for (var _name3 in services) {
                if (!services.hasOwnProperty(_name3)) {
                    continue;
                }

                var info = services[_name3];
                if (info.reference !== undefined) {
                    this.services[_name3] = info.reference;
                    continue;
                }

                if (info.module !== undefined) {
                    this.setDefinition(_name3, new _Definition2['default'](info.module, info.args));
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
            if (!this.isFrozen()) {
                throw new Error("Cannot grab services when the container isn't built");
            }

            return this.services[id];
        }
    }, {
        key: 'get',
        value: function get(id) {
            return this.getService(id);
        }
    }], [{
        key: 'buildFromJson',
        value: function buildFromJson(json) {
            var builder = new ContainerBuilder();

            if (json.parameters !== undefined) {
                builder.buildParametersFromJson(json.parameters);
            }

            if (json.services !== undefined) {
                builder.buildServicesFromJson(json.services);
            }

            var services = builder.buildDefinitions();

            return new _Container2['default'](services, builder.parameterBag);
        }
    }]);

    return ContainerBuilder;
})();

exports['default'] = ContainerBuilder;
module.exports = exports['default'];
