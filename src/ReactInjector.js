export default class ReactInjector {
    static inject(container, React) {
        let createElement = React.createElement;

        // Remove previously injected resolver
        ReactInjector.remove(React);

        let newCreateElement = function () {
            let args  = Array.prototype.slice.call(arguments),
                type  = args[0],
                props = (args[1] = args[1] || {});

            // Don't inject anything into HTML tag elements, or components that don't have dependencies
            if (typeof(type) === 'string' || type.dependencies === undefined) {
                return createElement.apply(React, args);
            }

            props.deps = {};
            for (let name in type.dependencies) {
                if (!type.dependencies.hasOwnProperty(name)) {
                    continue;
                }

                let dep = type.dependencies[name];

                // If its a parameter
                if (dep.indexOf('%') === 0 && arg.substring(1).indexOf('%') === dep.length - 2) {
                    props.deps[name] = container.getParameter(dep.substring(1).slice(0, -1));
                }

                // If its a service
                if (dep.indexOf('@') === 0) {
                    props.deps[name] = container.get(dep.substring(1));
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

    static remove(React) {
        if (React.createElement.restore) {
            React.createElement.restore();
        }
    }
}