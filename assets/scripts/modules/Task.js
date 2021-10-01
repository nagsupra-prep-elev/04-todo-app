export default class Task {
  constructor(name, taskListID) {
    const created = new Date();
    this.id = `${taskListID}-task-${created.getTime()}`;
    this.name = name;
    this.created = created;
  }
}
