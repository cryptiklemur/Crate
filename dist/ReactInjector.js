'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ReactInjector = (function () {
    function ReactInjector() {
        _classCallCheck(this, ReactInjector);
    }

    _createClass(ReactInjector, null, [{
        key: 'inject',
        value: function inject(container, React) {
            var createElement = React.createElement;

            // Remove previously injected resolver
            ReactInjector.remove(React);

            var newCreateElement = function newCreateElement() {
                var args = Array.prototype.slice.call(arguments),
                    type = args[0],
                    props = args[1] = args[1] || {};

                // Don't inject anything into HTML tag elements, or components that don't have dependencies
                if (typeof type === 'string' || type.dependencies === undefined) {
                    return createElement.apply(React, args);
                }

                props.deps = {};
                for (var _name in type.dependencies) {
                    if (!type.dependencies.hasOwnProperty(_name)) {
                        continue;
                    }

                    var dep = type.dependencies[_name];

                    // If its a parameter
                    if (dep.indexOf('%') === 0 && arg.substring(1).indexOf('%') === dep.length - 2) {
                        props.deps[_name] = container.getParameter(dep.substring(1).slice(0, -1));
                    }

                    // If its a service
                    if (dep.indexOf('@') === 0) {
                        props.deps[_name] = container.get(dep.substring(1));
                    }
                }
                args[1] = props;

                return createElement.apply(React, args);
            };

            newCreateElement.restore = function () {
                React.createElement = createElement;
            };

            React.createElement = newCreateElement;
        }
    }, {
        key: 'remove',
        value: function remove(React) {
            if (React.createElement.restore) {
                React.createElement.restore();
            }
        }
    }]);

    return ReactInjector;
})();

exports['default'] = ReactInjector;
module.exports = exports['default'];
