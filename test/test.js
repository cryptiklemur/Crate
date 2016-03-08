const assert              = require('assert'),
      Definition          = require('../dist/Definition'),
      ContainerBuilder    = require('../dist/ContainerBuilder'),
      ParameterBag        = require('../dist/ParameterBag'),
      AbstractLoader      = require('../dist/Loader/AbstractLoader'),
      JsonLoader          = require('../dist/Loader/JsonLoader'),
      validService        = require('./mock/ValidService'),
      firstInvalidService = require('./mock/FirstInvalidService');

describe("Ensure Definition class works.", function () {
    describe("#constructor", function () {
        it('should have a module and classArguments', function () {
            var definition = new Definition(validService, ['some', 'arguments']);
            assert.equal(definition.module, validService);
            assert.deepEqual(definition.classArguments, ['some', 'arguments']);
        });
    });

    describe('#setmodule', function () {
        it('should be able to change its module', function () {
            var definition = new Definition(validService, ['some', 'arguments']);
            definition.setModule(firstInvalidService);
            assert.equal(definition.module, firstInvalidService);
        });
    });

    describe('#addArgument', function () {
        it('should be able to add an argument', function () {
            var definition = new Definition(validService, ['some', 'arguments']);
            definition.addArgument('test');
            assert.deepEqual(definition.classArguments, ['some', 'arguments', 'test']);
        });
    });

    describe('#removeArgument', function () {
        it('should be able to remove an argument', function () {
            var definition = new Definition(validService, ['some', 'arguments']);
            definition.removeArgument(2);
            assert.deepEqual(definition.classArguments, ['some', 'arguments']);
        });
    });

    describe('#setArgument', function () {
        it('should be able to replace an argument', function () {
            var definition = new Definition(validService, ['some', 'arguments']);
            definition.setArgument(0, 'test');
            assert.deepEqual(definition.classArguments, ['test', 'arguments']);
        });
    });
});

describe("Ensure ParameterBag class works.", function () {
    describe('#constructor', function () {
        it('should initialize the bag as an array', function () {
            var parameterBag = new ParameterBag();
            assert.deepEqual(parameterBag.parameters, []);
            assert.deepEqual(parameterBag.parameters, []);
        });
    });
    describe('#has', function () {
        it('should be able to tell if it has a parameter or not', function () {
            var parameterBag = new ParameterBag({'foo': 'bar'});
            assert.strictEqual(false, parameterBag.has('baz'));
            assert.strictEqual(true, parameterBag.has('foo'));
        });
    });
    describe('#get', function () {
        it('should be able to grab a parameter', function () {
            var parameterBag = new ParameterBag({'foo': 'bar'});
            assert.strictEqual('bar', parameterBag.get('foo'));
            assert.strictEqual(undefined, parameterBag.get('baz'));
        });
        it('should be able to grab a parameter, with a default parameter', function () {
            var parameterBag = new ParameterBag({'foo': 'bar'});
            assert.strictEqual('bar', parameterBag.get('foo'));
            assert.strictEqual(undefined, parameterBag.get('baz'));
            assert.strictEqual('foo', parameterBag.get('baz', 'foo'));
        });
    });
    describe('#all', function () {
        it('should be able to grab all parameters', function () {
            var parameterBag = new ParameterBag({foo: 'bar', bar: 'baz'});
            assert.deepEqual({foo: 'bar', bar: 'baz'}, parameterBag.all());
        });
    });
    describe('#set', function () {
        it('should be able to set a parameter', function () {
            var parameterBag = new ParameterBag({'foo': 'bar'});
            assert.strictEqual('bar', parameterBag.get('foo'));
            assert.strictEqual(undefined, parameterBag.get('baz'));

            parameterBag.set('foo', 'baz');
            assert.strictEqual('baz', parameterBag.get('foo'));
            assert.strictEqual(undefined, parameterBag.get('baz'));

            parameterBag.set('baz', 'foo');
            assert.strictEqual('foo', parameterBag.get('baz'));
        });
    });
});

describe("Ensure ContainerBuilder class works.", function () {
    describe('#constructor', function () {
        it('should create a parameter bag during construction', function () {
            var containerBuilder = new ContainerBuilder();
            assert.notEqual(undefined, containerBuilder.parameterBag);
            assert.notEqual(undefined, containerBuilder.getParameters());
        });

        it('should create a loaders array during construction', function () {
            var containerBuilder = new ContainerBuilder();
            assert.notEqual(undefined, containerBuilder.loaders);
        });
    });

    describe('#addLoader', function () {
        it('should throw an error if anything but a loader is passed', function () {
            var containerBuilder = new ContainerBuilder();
            assert.throws(function() {
                containerBuilder.addLoader('fake loader');
            }, /Must pass an instance of AbstractLoader/);
        });

        it('should add a loader to the loaders array', function () {
            var containerBuilder = new ContainerBuilder(),
                loader           = new JsonLoader();

            assert.equal(0, containerBuilder.loaders.length);
            containerBuilder.addLoader(loader);
            assert.equal(1, containerBuilder.loaders.length);
        })
    });

    describe('#addParameter', function () {
        var containerBuilder = new ContainerBuilder();
        containerBuilder.addParameter('foo', 'bar');

        assert.strictEqual('bar', containerBuilder.parameterBag.get('foo'));
    });

    describe('#getParameter', function () {
        var containerBuilder = new ContainerBuilder();
        containerBuilder.addParameter('foo', 'bar');

        assert.strictEqual('bar', containerBuilder.getParameter('foo'));
    });

    describe('#removeParameter', function () {
        var containerBuilder = new ContainerBuilder();
        containerBuilder.addParameter('foo', 'bar');

        assert.strictEqual('bar', containerBuilder.getParameter('foo'));
        containerBuilder.removeParameter('foo');
        assert.strictEqual(undefined, containerBuilder.getParameter('foo'));
    });

    describe('#getParameters', function () {
        var containerBuilder = new ContainerBuilder();
        containerBuilder.addParameter('foo', 'bar');
        containerBuilder.addParameter('bar', 'baz');

        assert.deepEqual({foo: 'bar', bar: 'baz'}, containerBuilder.getParameters().all());
    });

    describe('#setDefinition', function () {
        it('should be able to store a definition with an id', function () {
            var containerBuilder = new ContainerBuilder();
            var definition       = new Definition('../dist/Definition', ['some', 'arguments']);

            containerBuilder.setDefinition('test', definition);
            assert.strictEqual(containerBuilder.definitions.test, definition);
        });
    });

    describe('#getDefinition', function () {
        it('should be able to grab a definition with an id', function () {
            var containerBuilder = new ContainerBuilder();
            var definition       = new Definition('../dist/Definition', ['some', 'arguments']);

            containerBuilder.setDefinition('test', definition);
            assert.strictEqual(containerBuilder.getDefinition('test'), definition);
        });
    });

    describe('#isFrozen', function () {
        it('should not be able to add a definition, if the container is frozen', function () {
            var containerBuilder = new ContainerBuilder(),
                definition       = new Definition('../dist/Definition', ['some', 'arguments']);

            containerBuilder.setDefinition('test', definition);
            assert.strictEqual(containerBuilder.getDefinition('test'), definition);

            containerBuilder.freeze();
            try {
                containerBuilder.setDefinition('test2', definition);
                assert.fail("should've failed");
            } catch (err) {
                assert.ok(true, "Error thrown");
            }
        });
    });

    describe('#build', function () {
        it('should be able to build a container', function () {
            var containerBuilder = new ContainerBuilder(), container;
            containerBuilder.setDefinition('validService', new Definition(require('./mock/ValidService')));

            container = containerBuilder.build();

            assert.equal('validService', container.get('validService').name);
        });
        it('should be able to build a container with loaders', function () {
            var containerBuilder = new ContainerBuilder(),
                loader           = new JsonLoader(),
                container;

            loader.addFile(require('./mock/validConfig.js'));
            loader.addFile(require('./mock/secondValidConfig.js'));
            loader.addFile(require('./mock/thirdValidConfig.js'));
            containerBuilder.addLoader(loader);
            container = containerBuilder.build();

            assert.equal('validService', container.get('validService').name);
            assert.equal('secondValidService', container.get('secondValidService').name);
            assert.equal('validParameter', container.getParameter('validParameter'));
            assert.equal('anotherValidParameter', container.getParameter('anotherValidParameter'));
            assert.equal(true, container.get('validService') instanceof validService);
        });
    });

    describe('#buildFromJson', function () {
        it('should be able to build a container from a json config', function () {
            var container = ContainerBuilder.buildFromJson(require('./mock/validConfig'));

            assert.equal('validService', container.get('validService').name);
        });
    });

    describe('#invalidBuildFromJson', function () {
        it('should be fail to build a container, if there is a circular reference', function () {
            var containerBuilder = new ContainerBuilder();

            try {
                containerBuilder.buildFromJson(require('./mock/invalidConfig'));
                assert.fail("should've failed");
            } catch (err) {
                assert.ok(true, "Error thrown");
            }
        });
    });
});

describe("Ensure JsonLoader class works.", function () {
    describe('#constructor', function () {
        it('should extend AbstractLoader', function () {
            var loader = new JsonLoader();
            assert.equal(true, loader instanceof AbstractLoader);
        });

        it('should create a files array during construction', function () {
            var loader = new JsonLoader();
            assert.notEqual(undefined, loader.files);
        });
    });

    describe('#addFile', function () {
        it('should error when you pass a string', function () {
            var loader = new JsonLoader();
            assert.throws(function () {
                loader.addFile('random-string')
            }, /Pass in a required file, not a string\./);
        });

        it('should add a file to the files array', function () {
            var loader = new JsonLoader();
            assert.equal(0, loader.files.length);
            loader.addFile(require('./mock/validConfig.js'));
            assert.equal(1, loader.files.length);
            loader.addFile(require('./mock/secondValidConfig.js'));
            assert.equal(2, loader.files.length);
        });
    });

    describe('buildParameters', function () {
        it('should return an array of parameters', function () {
            var loader = new JsonLoader(), parameters;

            loader.addFile(require('./mock/validConfig.js'));

            parameters = loader.buildParameters();
            assert.equal(0, Object.keys(parameters).length);

            loader.addFile(require('./mock/secondValidConfig.js'));

            parameters = loader.buildParameters();
            assert.equal(1, Object.keys(parameters).length);
            assert.notEqual(undefined, parameters.validParameter);
            assert.equal('validParameter', parameters.validParameter);

            loader.addFile(require('./mock/thirdValidConfig.js'));

            parameters = loader.buildParameters();
            assert.equal(2, Object.keys(parameters).length);
            assert.notEqual(undefined, parameters.anotherValidParameter);
            assert.equal('anotherValidParameter', parameters.anotherValidParameter);
        });
    });

    describe('buildServices', function () {
        it('should return an array of services', function () {
            var loader = new JsonLoader(), services;

            loader.addFile(require('./mock/secondValidConfig.js'));

            services = loader.buildServices();
            assert.equal(0, Object.keys(services).length);

            loader.addFile(require('./mock/validConfig.js'));

            services = loader.buildServices();
            assert.equal(1, Object.keys(services).length);
            assert.notEqual(undefined, services.validService);

            loader.addFile(require('./mock/thirdValidConfig.js'));

            services = loader.buildServices();
            assert.equal(2, Object.keys(services).length);
            assert.notEqual(undefined, services.secondValidService);
        });
    });
});