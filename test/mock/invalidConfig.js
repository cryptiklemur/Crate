'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    parameters: {},
    services:   {
        validService:         {
            module: require('./ValidService')
        },
        firstInvalidService:  {
            module: require('./FirstInvalidService'),
            args:   ['@secondInvalidService']
        },
        secondInvalidService: {
            module: require('./SecondInvalidService'),
            args:   ['@firstInvalidService']
        }
    }
};
module.exports     = exports['default'];