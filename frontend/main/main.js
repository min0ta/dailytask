document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы
    const addButton = document.getElementById('add-btn');
    const overdueTasksList = document.getElementById('overdue-tasks');
    const todayTasksList = document.getElementById('today-tasks');
    const upcomingTasksList = document.getElementById('upcoming-tasks');
    const overdueCount = document.getElementById('overdue-count');
    const todayCount = document.getElementById('today-count');
    const toggleCompletedBtn = document.getElementById('toggleCompleted');
    const exitBtn = document.getElementById('exit')
    exitBtn.addEventListener('click', () => {
        api.logout()
        document.location.href = '../login/login.html'
    })
// #region 
    // Добавляем в начало файла (после объявления DOM элементов)
const modal = document.createElement('div');
modal.className = 'modal';


modal.innerHTML = `
  <div class="modal-content">
    <div class="modal-header">
        <h3 class="modal-title">Добавить новую задачу</h3>
        <span class="close-modal">&times;</span>
    </div>
    <form id="taskForm">
      <div class="form-group">
        <label for="taskText">Текст задачи</label>
        <input type="text" id="taskText" required>
      </div>
      <div class="form-group">
        <label for="taskCaption">Название (до 30 символов)</label>
        <input type="text" id="taskCaption" maxlength="30">
      </div>
      <div class="form-group">
        <label for="taskDueDate">Дата выполнения*</label>
        <input type="date" id="taskDueDate" required>
      </div>
      <div class="form-group">
        <label for="taskPeriodic">Периодическая задача</label>
        <input type="checkbox" id="taskPeriodic">
      </div>
      <div class="form-group" id="periodDaysGroup" style="display: none;">
        <label for="taskPeriodDays">Повторять каждые (дней)</label>
        <input type="number" id="taskPeriodDays" min="0" value="1">
      </div>
      <div class="form-group">
        <label for="taskImportance">Важность</label>
        <select id="taskImportance">
          <option value="1">Низкая</option>
          <option value="2">Средняя</option>
          <option value="3">Высокая</option>
        </select>
      </div>
      <button id='submit-btn' type="submit" class="modal-submit-btn">Добавить задачу</button>
    </form>
  </div>
`;
document.body.appendChild(modal);
let currentEditingTask = null;

// Обработчики для модального окна

const taskCaption = document.getElementById('taskCaption')
const taskText = document.getElementById('taskText')
taskText.addEventListener('input', () => {
    taskCaption.placeholder = taskText.value.substring(0,30)
})
const closeModalEl = document.querySelector('.close-modal');
closeModalEl.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 400); // Должно совпадать с длительностью анимации
});

closeModalEl.addEventListener('click', closeModal);

// Обработчик клика по фону модалки
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});


document.getElementById('taskPeriodic').addEventListener('change', function() {
  document.getElementById('periodDaysGroup').style.display = 
    this.checked ? 'block' : 'none';
});


document.getElementById('taskForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 400);
    await handleTaskCreation();
});

// Обновляем функцию addTask
async function addTask() {

    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
  // Сбрасываем форму
    document.getElementById('taskForm').reset();
    document.getElementById('periodDaysGroup').style.display = 'none';
    
    // Устанавливаем текущую дату как значение по умолчанию
    const today = new Date().toLocaleDateString('en-CA')
    document.getElementById('taskDueDate').value = today; 
  
}
async function handleTaskCreation() {
    const textValue = document.getElementById('taskText').value.trim();
    if (!textValue) {
        pop('Пожалуйста, введите текст задачи');
        return;
    }

    try {
        const caption = document.getElementById('taskCaption').value.trim() || 
                       textValue.substring(0, 30);
        const dueDate = document.getElementById('taskDueDate').value;
        const isPeriodic = document.getElementById('taskPeriodic').checked;
        const periodDays = isPeriodic ? 
            parseInt(document.getElementById('taskPeriodDays').value) : 0;
        const importance = parseInt(document.getElementById('taskImportance').value);

        const taskData = {
            caption,
            textvalue: textValue,
            importancy: importance,
            periodic: isPeriodic,
            expires: dueDate,
            period_s: periodDays
        };

        if (currentEditingTask) {
            // Редактирование существующей задачи
            const updatedTask = await api.updateTask({
                ...currentEditingTask,
                ...taskData
            });
            updatedTask.expires = updatedTask.expires;
            
            tasks = tasks.map(t => 
                t.id === updatedTask.id ? updatedTask : t
            );
            currentEditingTask = null;
        } else {
            // Создание новой задачи
            const newTask = {
                ...taskData,
                complete: false
            };
      
            const createdTask = await api.addTask(newTask);
            createdTask.expires = createdTask.expires;
            tasks.push(createdTask);
        }

        renderTasks();
        closeModal();
    } catch (error) {
        console.error('Ошибка:', error);
        pop('Не удалось сохранить задачу');
    }
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        // Сбрасываем форму после закрытия
        document.getElementById('taskForm').reset();
        document.getElementById('periodDaysGroup').style.display = 'none';
        document.querySelector('.modal-title').textContent = 'Добавить новую задачу';
        document.querySelector('.modal-submit-btn').textContent = 'Добавить задачу';
        currentEditingTask = null;
    }, 400);
}

// #endregion

    // Состояние приложения
    let tasks = [];
    let showCompleted = false;

    // Инициализация
    init();

    async function init() {
        // Добавляем кнопку переключения завершенных задач
        
        toggleCompletedBtn.addEventListener('click', () => {
            showCompleted = !showCompleted;
            toggleCompletedBtn.textContent = showCompleted 
                ? 'Скрыть завершенные' 
                : 'Показать завершенные';
            renderTasks();
        });

        await loadTasks();
    }

    // Обработчики событий
    addButton.addEventListener('click', addTask);

    // Основные функции
    async function loadTasks() {
        try {
            tasks = await api.getTasks();
            renderTasks();
        } catch (error) {
            console.error('Ошибка загрузки задач:', error);
        }
    }

    // async function addTask() {
    //     const taskText = newTaskInput.value.trim();
    //     if (!taskText) return;

    //     try {
    //         const newTask = {
    //             caption: taskText,
    //             textvalue: taskText,
    //             importancy: 1,
    //             periodic: false,
    //             expires: new Date(datePicker.value ? datePicker.value : Date.now()),
    //             period_s: 0,
    //             complete: false
    //         };

    //         const createdTask = await api.addTask(newTask);
    //         console.log(createdTask)
    //         tasks.push(createdTask);
    //         renderTasks();
    //         newTaskInput.value = '';
    //     } catch (error) {
    //         console.error('Ошибка добавления задачи:', error);
    //     }
    // }

    async function toggleTaskCompletion(task) {
        try {
            const updatedTask = await api.updateTask({
                ...task,
                complete: !task.complete
            });
            
            tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
            renderTasks();
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
        }
    }

    async function deleteTask(taskId) {
        if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
        
        try {
            await api.deleteTask(taskId);
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
        }
    }

    function renderTasks() {
        clearTasks();
        const today = new Date().toLocaleDateString('en-CA')
        let overdueTasks = 0;
        let todayTasks = 0;
        
        // Сортируем задачи по дате
        tasks.sort((a, b) => new Date(a.expires) - new Date(b.expires));

        tasks.forEach(task => {
            // Пропускаем завершенные если они скрыты
            if (task.complete && !showCompleted && !task.periodic) return;
            const taskDue = new Date(task.expires).toLocaleDateString('en-CA')
            const isOverdue = taskDue < today && !task.complete;
            const isToday = taskDue === today && !task.complete;
            
            const taskElement = createTaskElement(task, isOverdue, isToday);
            
            if (isOverdue) {
                overdueTasksList.appendChild(taskElement);
                if (!task.complete) overdueTasks++;
            } else if (isToday) {
                todayTasksList.appendChild(taskElement);
                if (!task.complete) todayTasks++;
            } else {
                upcomingTasksList.appendChild(taskElement);
            }
        });

        overdueCount.textContent = overdueTasks;
        todayCount.textContent = todayTasks;

        // Показываем/скрываем секции
        document.querySelector('.overdue-section').style.display = overdueTasks ? 'block' : 'none';
        document.querySelector('.today-section').style.display = todayTasks ? 'block' : 'none';
    }

    function createTaskElement(task, isOverdue, isToday) {
        const li = document.createElement('li');
        li.className = `task-item ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : 'upcoming'} ${task.complete ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        // Чекбокс
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.complete;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task));

        // Текст задачи
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.textvalue;

        // Дата выполнения
        const taskDue = document.createElement('span');
        taskDue.className = 'task-due';
        
        let dueText = formatDate(task.expires);
        if (isOverdue) dueText += ' (Просрочено)';
        if (task.complete) dueText += ' (Завершено)';
        
        // Пометка о следующем выполнении для периодических задач
        if (task.periodic) {
            const nextDate = new Date(task.expires);
            nextDate.setDate(nextDate.getDate() + task.period_s);
            dueText += task.complete 
                ? ` (След.: ${formatDate(nextDate)})` 
                : ` (Повтор: ${task.period_s} дня)`;
        }

        taskDue.textContent = dueText;

        // Иконка периодичности
        if (task.periodic) {
            const periodicIcon = document.createElement('i');
            periodicIcon.className = 'fas fa-sync-alt periodic-icon';
            periodicIcon.title = `Повторяется каждые ${task.period_s} дней`;
            taskDue.prepend(periodicIcon, ' ');
        }

        // Кнопки действий
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.title = 'Редактировать';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(task);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Удалить';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        taskActions.append(editBtn, deleteBtn);
        li.append(checkbox, taskText, taskDue, taskActions);


        return li;
    }

    function openEditModal(task) {
        currentEditingTask = task;
        
        // Заполняем форму данными задачи
        document.getElementById('taskText').value = task.textvalue;
        document.getElementById('taskCaption').value = task.caption;
        document.getElementById('taskDueDate').value = task.expires.split('T')[0];
        document.getElementById('taskPeriodic').checked = task.periodic;
        document.getElementById('taskPeriodDays').value = task.period_s;
        document.getElementById('taskImportance').value = task.importancy;
        
        // Показываем/скрываем поле периода
        document.getElementById('periodDaysGroup').style.display = 
            task.periodic ? 'block' : 'none';
        
        // Меняем заголовок и текст кнопки
        document.querySelector('.modal-title').textContent = 'Редактировать задачу';
        document.querySelector('.modal-submit-btn').textContent = 'Сохранить изменения';
        
        // Показываем модальное окно
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // function editTask(task) {
    //     const newText = prompt('Редактировать задачу:', task.textValue);
    //     if (newText !== null) {
    //         const updatedTask = { ...task, textValue: newText.trim() };
    //         api.updateTask(updatedTask)
    //             .then(updated => {
    //                 tasks = tasks.map(t => t.id === updated.id ? updated : t);
    //                 renderTasks();
    //             })
    //             .catch(error => console.error('Ошибка редактирования:', error));
    //     }
    // }

    // Вспомогательные функции
    function clearTasks() {
        overdueTasksList.innerHTML = '';
        todayTasksList.innerHTML = '';
        upcomingTasksList.innerHTML = '';
    }

    function formatDate(dateString) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
});