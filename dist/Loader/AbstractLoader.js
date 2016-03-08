"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractLoader = (function () {
    function AbstractLoader() {
        _classCallCheck(this, AbstractLoader);

        if (this.constructor === AbstractLoader) {
            throw new Error("Can't instantiate abstract class!");
        }

        this.files = [];
    }

    _createClass(AbstractLoader, [{
        key: "addFile",
        value: function addFile(file) {
            if (typeof file === 'string') {
                throw Error("Pass in a required file, not a string.");
            }

            this.files.push(file);
        }
    }, {
        key: "buildParameters",
        value: function buildParameters() {
            throw new Error("Must implement buildParameters");
        }
    }, {
        key: "buildServices",
        value: function buildServices() {
            throw new Error("Must implement buildServices");
        }
    }]);

    return AbstractLoader;
})();

exports["default"] = AbstractLoader;
module.exports = exports["default"];
