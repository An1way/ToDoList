const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();


form.addEventListener('submit', addTask);


tasksList.addEventListener('click', deleteTask)


tasksList.addEventListener('click', doneTask)

// Функции 

function addTask(event) {
    // Отменяем отправку формы
    event.preventDefault();
    
    // Достаем текст из поля ввода
    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };


    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    saveToLocalStorage();

    renderTask(newTask);

// Очищение поле ввода
taskInput.value = ""
taskInput.focus();

checkEmptyList();
}


function deleteTask(event) {
    // Проверка клика на удаление задачи
    if (event.target.dataset.action !== 'delete') return;
    

    // клик на удаление задачи 
    const parennNode = event.target.closest('.list-group-item');
    
    const id = Number (parennNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();

    parennNode.remove();

    checkEmptyList();
}


function doneTask (event) {
    // Проверка клика что был не по кнопке
    if (event.target.dataset.action !== "done") return

    // Проверка клика что задача выполнена
     
    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id ===id);
    task.done = !task.done

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListElement = `
        <li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListElement);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

const taskHTML =`
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`;

tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
