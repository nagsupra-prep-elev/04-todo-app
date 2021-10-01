import Task from './Task.js';
import TaskList, {
  addTask as doAddTask,
  completeTask as doCompleteTask,
} from './TaskList.js';

const dummySet = () => {
  localStorage.setItem(
    'taskLists',
    JSON.stringify([
      {
        id: 'tasklist-01',
        title: 'trip to paris',
        pending: [
          {
            id: 'tasklist-01-task-01',
            name: 'visit eiffel tower',
            created: '',
          },
          {
            id: 'tasklist-01-task-02',
            name: 'visit park de france',
            created: '',
          },
        ],
        completed: [
          {
            id: 'tasklist-01-task-03',
            name: 'book a hotel',
            created: '',
          },
          {
            id: 'tasklist-01-task-04',
            name: 'book a flight',
            created: '',
          },
        ],
      },
      {
        id: 'tasklist-02',
        title: 'trip to malabu',
        pending: [
          {
            id: 'tasklist-02-task-01',
            name: 'buy a camera',
            created: '',
          },
          {
            id: 'tasklist-02-task-02',
            name: 'select a homestay',
            created: '',
          },
        ],
        completed: [
          {
            id: 'tasklist-02-task-03',
            name: 'book a flight',
            created: '',
          },
        ],
      },
      {
        id: 'tasklist-03',
        title: 'grocery',
        pending: [
          { id: 'tasklist-03-task-01', name: 'rice', created: '' },
          { id: 'tasklist-03-task-02', name: 'dal', created: '' },
          { id: 'tasklist-03-task-03', name: 'salt', created: '' },
        ],
        completed: [],
      },
    ])
  );
};

const getTaskLists = () => {
  return JSON.parse(localStorage.getItem('taskLists'));
};
const setTaskLists = (taskLists) => {
  localStorage.setItem('taskLists', JSON.stringify(taskLists));
};

const addTaskList = (title) => {
  const tasklist = new TaskList(title);
  const taskLists = getTaskLists();
  taskLists.unshift(tasklist);
  setTaskLists(taskLists);
};
const removeTaskList = (tasklistId) => {
  const taskLists = getTaskLists();
  const tasklistindex = taskLists.findIndex(
    (taskList) => taskList.id === tasklistId
  );
  taskLists.splice(tasklistindex, 1);
  setTaskLists(taskLists);
};

const addTask = (name, tasklistId) => {
  const taskLists = getTaskLists();
  const tasklist = taskLists.find(
    (taskList) => taskList.id === tasklistId
  );
  doAddTask(tasklist, new Task(name, tasklistId));
  setTaskLists(taskLists);
};
const completeTask = (tasklistId, taskId) => {
  const taskLists = getTaskLists();
  const tasklist = taskLists.find(
    (taskList) => taskList.id === tasklistId
  );
  doCompleteTask(tasklist, taskId);
  setTaskLists(taskLists);
};

export default {
  getTaskLists,
  addTaskList,
  removeTaskList,
  addTask,
  completeTask,
  dummySet,
};
