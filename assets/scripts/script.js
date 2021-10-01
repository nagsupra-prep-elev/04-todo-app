import operations from "./modules/store.js";

////////////////////////////////////////
// #region - DOM Elements
////////////////////////////////////////

//Container ELements
const containerElem = document.querySelector(".container");
const mainPageElem = document.querySelector(".main-page");
const detailsPageElem = document.querySelector(".details-page");
const detailsPageHeaderElem = document.querySelector(".details-page .header-title h2");
const detailsPageMainElem = document.querySelector(".details-page main");
const detailsPageTaskCardElem = document.querySelector(".details-page .task-list");
const taskListsElem = document.querySelector(".task-lists");
const fallbackMsgELem = document.querySelector(".fallback");
const btnAddTaskList = document.querySelector("#task-list-add-btn");
const btnBackTaskList = document.querySelector("#task-list-back-btn");

//Modal and Overlay Elements
const overlayElem = document.querySelector(".overlay");
const modalElem = document.querySelector(".modal");
const modalFormLabelElem = document.querySelector(".modal-content-input label");
const modalFormTextElem = document.querySelector(".modal-content-input input");
const btnModalAdd = document.querySelector("#btn-modal-add");
const btnModalClose = document.querySelector("#btn-modal-close");
const btnModalNo = document.querySelector("#btn-modal-no");
const btnModalYes = document.querySelector("#btn-modal-yes");

// #endregion - DOM Elements

////////////////////////////////////////
// #region - data
////////////////////////////////////////

// helper variables
const hidden = "hidden";
const noDisplay = "no-display";
const task = "task";
const taskList = "taskList";

////////////////////////////////////////
// state
////////////////////////////////////////
const def = { type: "default", taskList: null };
let modalForm = def; //modal form state

// #endregion - data

////////////////////////////////////////
// #region - html templates | for dynamic insertion
////////////////////////////////////////

const singleTaskCardHTML = (tasklist, isMain = true) => {
  const singleTaskHTML = (task, completed = false) => `
  <li class="single-task">
  <input type="checkbox" id="${task.id}" ${completed === true ? "checked disabled" : ""}/>
  <label for="${task.id}">${task.name}</label>
  </li>
  `;
  const allTasks = (tasks, completed = false) =>
    tasks
      .map((task) => singleTaskHTML(task, completed))
      .toString()
      .replaceAll(",", " ");

  const pendingTasks = allTasks(tasklist.pending);
  const completedTasks = allTasks(tasklist.completed, true);
  let mainHeader = "";
  if (isMain)
    mainHeader = `
  <section class="task-list-display">
    <header class="task-list-display-header">
      <h2>${tasklist.title}</h2>
    </header>
  </section>
  `;

  return `
  <article class="task-list card" data-tasklist-id="${tasklist.id}">
    ${mainHeader}
    <section class="task-list-details">
      <header class="task-list-details-header">
        <h2>${tasklist.title}</h2>
      </header>
      <main class="task-list-details-content">
        <ul class="pending-tasks">
          ${pendingTasks}
        </ul>
        <ul class="completed-tasks">
          ${completedTasks}
        </ul>
      </main>
      <footer class="task-list-details-footer">
        <i class="bx bx-trash"></i>
        <i class="bx bxs-plus-circle"></i>
      </footer>
    </section>
  </article>
  `;
};
// #endregion - html templates

////////////////////////////////////////
// #region - functions
////////////////////////////////////////

////////////////////////////////////////
// modal actions
////////////////////////////////////////
const showInputModal = () => {
  btnModalAdd.classList.remove(noDisplay);
  btnModalClose.classList.remove(noDisplay);
  btnModalNo.classList.add(noDisplay);
  btnModalYes.classList.add(noDisplay);
  modalFormTextElem.classList.remove(noDisplay);
};
const showNonInputModal = () => {
  btnModalAdd.classList.add(noDisplay);
  btnModalClose.classList.add(noDisplay);
  btnModalNo.classList.remove(noDisplay);
  btnModalYes.classList.remove(noDisplay);
  modalFormTextElem.classList.add(noDisplay);
};
const openModal = (labelMsg, placeHolderMsg = "", del = false) => {
  modalFormLabelElem.textContent = labelMsg;
  modalElem.classList.remove(noDisplay);
  overlayElem.classList.remove(noDisplay);
  if (del) {
    showNonInputModal();
    return;
  }
  //update form messages
  modalFormTextElem.placeholder = placeHolderMsg;
  showInputModal();
  //show modal form
};
const closeModal = () => {
  modalElem.classList.add(noDisplay);
  overlayElem.classList.add(noDisplay);
  modalFormTextElem.value = "";
};

////////////////////////////////////////
// ui updating actions
////////////////////////////////////////
const renderUI = async () => {
  //reset taskLists UI - remove all existing elements
  taskListsElem.innerHTML = "";
  //get all taskLists
  const taskLists = operations.getTaskLists();
  // if no tasklist present - shwo fallback
  if (taskLists.length === 0) {
    fallbackMsgELem.classList.remove("no-display");
    return;
  }
  //push all tasklists to DOM
  fallbackMsgELem.classList.add("no-display");
  taskLists.forEach((tasklist) => taskListsElem.insertAdjacentHTML("beforeend", singleTaskCardHTML(tasklist)));
};
const renderTaskList = (tasklistID) => {
  //get the target DOM Element
  const tasklist = document.querySelector(`article[data-tasklist-id='${tasklistID}']`);
  //build the updated HTML element
  //update the DOM element
  console.log(tasklist);
};
const renderTaskDetails = (tasklistId) => {
  const taskLists = operations.getTaskLists();
  const tasklist = taskLists.find((taskList) => taskList.id === tasklistId);
  detailsPageHeaderElem.textContent = tasklist.title;
  detailsPageMainElem.innerHTML = "";
  detailsPageMainElem.insertAdjacentHTML("afterbegin", singleTaskCardHTML(tasklist, false));
};
const toggleScreenMobile = () => {
  mainPageElem.classList.toggle(hidden);
  detailsPageElem.classList.toggle(hidden);
};

////////////////////////////////////////
// operations
////////////////////////////////////////
const addTaskList = (title) => {
  operations.addTaskList(title);
  renderUI();
};
const addTask = (name, tasklistID) => {
  operations.addTask(name, tasklistID);
  renderUI();
  renderTaskDetails(tasklistID);
};
const completeTask = (tasklistId, taskId) => {
  operations.completeTask(tasklistId, taskId);
  renderTaskDetails(tasklistId);
  renderUI();
};
const deleteTaskList = (tasklistId) => {
  operations.removeTaskList(tasklistId);
  renderUI();
};

////////////////////////////////////////
// callback helpers
////////////////////////////////////////
const doClick = (elem, callback) => {
  elem.addEventListener("click", callback);
};

// #endregion - functions

////////////////////////////////////////
// #region - DOM Events
////////////////////////////////////////
// on windows load
window.addEventListener("load", () => {
  containerElem.style.opacity = 1;
  renderUI();
});

// event delegation - task-list
doClick(taskListsElem, (e) => {
  // if clicked on small tasklist - expand it's details
  if (e.target.dataset.tasklistId) {
    renderTaskDetails(e.target.dataset.tasklistId);
    toggleScreenMobile();
  }
  const tasklistId = e.target.parentElement.parentElement.parentElement.dataset.tasklistId;
  modalForm.type = task;
  modalForm.taskList = tasklistId;
  // if add new task button clicked
  if (e.target.classList.contains("bxs-plus-circle")) {
    openModal("Add New Item", "Name");
  }
  // if remove task-list button clicked
  if (e.target.classList.contains("bx-trash")) {
    openModal("Are you sure?", "", true);
  }
  // if check box is checked
  //prettier-ignore
  if (
    e.target.parentElement.classList.contains('single-task') &&
    e.target.parentElement.parentElement.classList.contains('pending-tasks') &&
    e.target.tagName !== 'LABEL'
  ) {
    const taskId = e.target.id;
    const tasklistId =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.dataset.tasklistId;
    completeTask(tasklistId, taskId);
  }
});

// on clicking add item button
doClick(btnAddTaskList, () => {
  openModal("Add New List", "Title");
  modalForm.type = taskList;
});

// on clicking back button in details section for small screen
doClick(btnBackTaskList, () => {
  toggleScreenMobile();
});

// on clicking on task details card elements
doClick(detailsPageMainElem, (e) => {
  console.log(e.target);
  const tasklistId = e.target.parentElement.parentElement.parentElement.dataset.tasklistId;
  modalForm.type = task;
  modalForm.taskList = tasklistId;
  // if add new task button clicked
  if (e.target.classList.contains("bxs-plus-circle")) {
    openModal("Add New Item", "Name");
  }
  // if remove task-list button clicked
  if (e.target.classList.contains("bx-trash")) {
    openModal("Are you sure?", "", true);
  }
  // if check box is checked
  // prettier-ignore
  if (
    e.target.parentElement.classList.contains('single-task') &&
    e.target.parentElement.parentElement.classList.contains('pending-tasks') &&
    e.target.tagName !== 'LABEL'
  ) {
    const taskId = e.target.id;
    const tasklistId =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.dataset.tasklistId;
    completeTask(tasklistId, taskId);
  }
});

////////////////////////////////////////
//modal events
////////////////////////////////////////

// on clicking overlay when modal open
doClick(overlayElem, () => {
  closeModal();
});

// on clicking btnAdd in modal
doClick(btnModalAdd, () => {
  const iptext = modalFormTextElem.value || null;
  // new tasklist
  if (modalForm.type === taskList) {
    addTaskList(iptext);
  }
  //new task
  if (modalForm.type === task) {
    addTask(iptext, modalForm.taskList);
  }
  modalForm = def;
  closeModal();
});

// on clicking btnClose in modal
doClick(btnModalClose, () => {
  closeModal();
});

// on clicking btnNo in modal
doClick(btnModalNo, () => {
  closeModal();
});

// on clicking btnYes in modal
doClick(btnModalYes, () => {
  deleteTaskList(modalForm.taskList);
  closeModal();
  toggleScreenMobile();
});

// #endregion - DOM Events

////////////////////////////////////////
// #region - extra
////////////////////////////////////////
// reset with dummy data
document.querySelector(".main-page .header-title").addEventListener("click", () => {
  operations.dummySet();
  renderUI();
});
// #endregion - extra
