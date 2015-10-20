'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Definition = (function () {
    _createClass(Definition, [{
        key: 'module',
        get: function get() {
            return this._module;
        },
        set: function set(value) {
            this._module = value;
        }
    }, {
        key: 'classArguments',
        get: function get() {
            return this._arguments || [];
        },
        set: function set(value) {
            this._arguments = value;
        }
    }]);

    function Definition() {
        var module = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var classArguments = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

        _classCallCheck(this, Definition);

        this.module = module;
        this.classArguments = classArguments;
    }

    _createClass(Definition, [{
        key: 'setModule',
        value: function setModule(module) {
            this.module = module;
        }
    }, {
        key: 'addArgument',
        value: function addArgument(argument) {
            this.classArguments.push(argument);

            return this;
        }
    }, {
        key: 'setArgument',
        value: function setArgument(index, argument) {
            this.classArguments[index] = argument;

            return this;
        }
    }, {
        key: 'removeArgument',
        value: function removeArgument(index) {
            if (undefined !== this.classArguments[index]) {
                delete this.classArguments[index];
            }

            return this;
        }
    }, {
        key: 'setArguments',
        value: function setArguments(classArguments) {
            this.classArguments = classArguments;
        }
    }]);

    return Definition;
})();

exports['default'] = Definition;
module.exports = exports['default'];
