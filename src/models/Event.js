export default class Event {
    constructor(id, name, hour, dateEventId, edit) {
        this.id = id
        this.name = name;
        this.hour = hour;
        this.dateEventId = dateEventId;
        this.edit = edit;
    }
}