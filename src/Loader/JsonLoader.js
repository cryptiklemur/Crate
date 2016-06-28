import util from 'util';
import AbstractLoader from './AbstractLoader';

export default class JsonLoader extends AbstractLoader {
    addJson(json) {
        this.addFile(json);
    }

    buildParameters() {
        let parameters = [];
        for (let index in this.files) {
            if (this.files.hasOwnProperty(index)) {
                parameters = util._extend(parameters, this.files[index].parameters);
            }
        }

        return parameters;
    }

    buildServices() {
        let services = [];
        for (let index in this.files) {
            if (this.files.hasOwnProperty(index)) {
                services = util._extend(services, this.files[index].services);
            }
        }

        return services;
    }
}
