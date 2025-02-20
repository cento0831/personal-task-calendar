// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const reminderTimeInput = document.getElementById('reminderTime');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    let currentDate = new Date();
    const taskData = {};

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const renderTasks = () => {
        const dateStr = formatDate(currentDate);
        taskList.innerHTML = '';
        if (taskData[dateStr]) {
            taskData[dateStr].forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${task.description} - Reminder: ${task.reminder} <button class="editBtn" data-index="${index}">Edit</button>`;
                taskList.appendChild(li);
            });
        }
    };

    const setReminder = (task, reminderTime) => {
        const reminderDate = new Date(reminderTime);
        const timeUntilReminder = reminderDate - new Date();

        if (timeUntilReminder > 0) {
            setTimeout(() => {
                alert(`Reminder: ${task.description}`);
            }, timeUntilReminder);
        }
    };

    const handleEdit = (index) => {
        const dateStr = formatDate(currentDate);
        const task = taskData[dateStr][index];
        taskInput.value = task.description;
        reminderTimeInput.value = task.reminder;
        
        addTaskBtn.textContent = "Update Task";
        addTaskBtn.onclick = () => {
            const updatedTask = {
                description: taskInput.value.trim(),
                reminder: reminderTimeInput.value
            };
            taskData[dateStr][index] = updatedTask;
            taskInput.value = '';
            reminderTimeInput.value = '';
            addTaskBtn.textContent = "Add Task";
            addTaskBtn.onclick = addTask;
            renderTasks();
            setReminder(updatedTask, updatedTask.reminder);
            updateCalendar();
        };
    };

    const addTask = () => {
        const task = taskInput.value.trim();
        const reminderTime = reminderTimeInput.value;

        if (task) {
            const dateStr = formatDate(currentDate);
            if (!taskData[dateStr]) {
                taskData[dateStr] = [];
            }
            const newTask = { description: task, reminder: reminderTime };
            taskData[dateStr].push(newTask);
            taskInput.value = '';
            reminderTimeInput.value = '';
            renderTasks();
            setReminder(newTask, reminderTime);
            updateCalendar();
        }
    };

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('editBtn')) {
            const index = e.target.getAttribute('data-index');
            handleEdit(index);
        }
    });

    const updateCalendar = () => {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: Object.keys(taskData).flatMap(date => 
                taskData[date].map(task => ({
                    title: task.description,
                    start: date
                }))
            ),
            dateClick: function(info) {
                currentDate = new Date(info.dateStr);
                renderTasks();
            },
            eventClick: function(info) {
                const dateStr = formatDate(new Date(info.event.start));
                const taskIndex = taskData[dateStr].findIndex(task => task.description === info.event.title);
                if (taskIndex !== -1) handleEdit(taskIndex);
            }
        });
        calendar.render();
    };

    updateCalendar();
    renderTasks();
});
