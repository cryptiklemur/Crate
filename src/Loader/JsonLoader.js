import AbstractLoader from './AbstractLoader';

export default class JsonLoader extends AbstractLoader {
    addJson(json) {
        this.addFile(json);
    }

    buildParameters() {
        let parameters = [];
        for (let index in this.files) {
            if (this.files.hasOwnProperty(index)) {
                Object.assign(parameters, this.files[index].parameters);
            }
        }

        return parameters;
    }

    buildServices() {
        let services = [];
        for (let index in this.files) {
            if (this.files.hasOwnProperty(index)) {
                Object.assign(services, this.files[index].services);
            }
        }

        return services;
    }
}
