export default class TaskList {
  constructor(title) {
    const created = new Date();
    this.id = `tasklist-${created.getTime()}`;
    this.title = title;
    this.pending = [];
    this.completed = [];
  }
}

export const addTask = (taskList, task) => {
  taskList.pending.unshift(task);
};
export const completeTask = (taskList, taskid) => {
  const index = taskList.pending.findIndex(
    (task) => task.id === taskid
  );
  if (index !== -1) {
    taskList.completed.unshift(taskList.pending[index]);
    taskList.pending.splice(index, 1);
  }
};
