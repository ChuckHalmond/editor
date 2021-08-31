import { ObjectModel, ObjectModelBase } from "./model/Model";

interface Application {

}

interface ApplicationState {

}

class ApplicationBase implements Application {
    readonly state: ObjectModel<ApplicationState>;

    constructor() {
        this.state = new ObjectModelBase({});
    }
}