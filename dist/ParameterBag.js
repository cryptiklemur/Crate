"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParameterBag = (function () {
    _createClass(ParameterBag, [{
        key: "parameters",
        get: function get() {
            return this._parameters;
        },
        set: function set(value) {
            this._parameters = value;
        }
    }]);

    function ParameterBag() {
        var parameters = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, ParameterBag);

        this.parameters = parameters;
    }

    _createClass(ParameterBag, [{
        key: "has",
        value: function has(name) {
            return this.parameters[name] !== undefined;
        }
    }, {
        key: "get",
        value: function get(name) {
            var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

            return this.has(name) ? this.parameters[name] : defaultValue;
        }
    }, {
        key: "set",
        value: function set(name, value) {
            this.parameters[name] = value;

            return this;
        }
    }, {
        key: "remove",
        value: function remove(name) {
            delete this.parameters[name];

            return this;
        }
    }, {
        key: "all",
        value: function all() {
            return this.parameters;
        }
    }]);

    return ParameterBag;
})();

exports["default"] = ParameterBag;
module.exports = exports["default"];
