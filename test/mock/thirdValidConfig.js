'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    parameters: {
        anotherValidParameter: 'anotherValidParameter'
    },
    services: {
        secondValidService: {
            module: require('./SecondValidService'),
            args: ['%anotherValidParameter%', '@validService']
        }
    }
};
module.exports     = exports['default'];