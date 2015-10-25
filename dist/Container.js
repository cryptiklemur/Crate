"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = (function () {
    function Container() {
        _classCallCheck(this, Container);

        this.services = {};
        this.parameterBag = null;
        this.frozen = false;
    }

    _createClass(Container, [{
        key: "build",
        value: function build(services, parameterBag) {
            if (this.frozen) {
                throw Error("Cannot build the container. Already built.");
            }

            this.services = services;
            this.parameterBag = parameterBag;

            this.frozen = true;
            Object.freeze(this);

            return this;
        }
    }, {
        key: "addParameter",
        value: function addParameter(name, value) {
            this.parameterBag.set(name, value);

            return this;
        }
    }, {
        key: "getParameter",
        value: function getParameter(name) {
            return this.parameterBag.get(name);
        }
    }, {
        key: "removeParameter",
        value: function removeParameter(name) {
            this.parameterBag.remove(name);

            return this;
        }
    }, {
        key: "getParameters",
        value: function getParameters() {
            return this.parameterBag;
        }
    }, {
        key: "getService",
        value: function getService(id) {
            return this.services[id];
        }
    }, {
        key: "get",
        value: function get(id) {
            return this.getService(id);
        }
    }]);

    return Container;
})();

exports["default"] = Container;
module.exports = exports["default"];
