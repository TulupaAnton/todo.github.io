const inputBox = document.getElementById('input-box')
const listContainer = document.getElementById('list-container')

function showAlert (title, text, icon = 'warning') {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#007BFF'
  })
}

// **Основные данные**
const state = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || []
}

// **Proxy для реактивности**
const tasksProxy = new Proxy(state, {
  set (target, prop, value) {
    target[prop] = value
    saveTasks()
    renderTasks()
    return true
  }
})

// **Работа с данными**
function saveTasks () {
  localStorage.setItem('tasks', JSON.stringify(tasksProxy.tasks))
}

function addTaskToData (taskText) {
  tasksProxy.tasks = [...tasksProxy.tasks, { text: taskText, completed: false }]
}

function deleteTaskFromData (index) {
  tasksProxy.tasks = tasksProxy.tasks.filter((_, i) => i !== index)
}

function toggleTaskCompletion (index) {
  tasksProxy.tasks[index].completed = !tasksProxy.tasks[index].completed
  saveTasks()
  renderTasks()
}

function editTaskInData (index, newText) {
  tasksProxy.tasks[index].text = newText
  saveTasks()
  renderTasks()
}

// **Функции UI**
function renderTasks () {
  listContainer.innerHTML = ''
  tasksProxy.tasks.forEach((task, index) => {
    const li = document.createElement('li')
    li.textContent = task.text
    if (task.completed) li.classList.add('checked')

    li.addEventListener('click', () => toggleTaskCompletion(index))

    const deleteBtn = document.createElement('span')
    deleteBtn.innerHTML = '\u00d7'
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation()
      deleteTaskFromData(index)
    })

    const editBtn = document.createElement('span')
    editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>'
    editBtn.classList.add('edit-icon')
    editBtn.addEventListener('click', e => {
      e.stopPropagation()
      const newText = prompt('Редагувати завдання', task.text)
      if (newText) editTaskInData(index, newText)
    })

    li.appendChild(deleteBtn)
    li.appendChild(editBtn)
    listContainer.appendChild(li)
  })

  toggleDeleteButton()
}

function addTask () {
  const taskText = inputBox.value.trim() // Убираем пробелы

  if (taskText === '') {
    // Проверяем, пустой ли текст ДО добавления
    showAlert('Помилка', 'Будь ласка, введіть завдання.', 'error')
    return
  }

  addTaskToData(taskText) // Добавляем задачу
  inputBox.value = '' // Очищаем поле ввода
}

function allDelete () {
  tasksProxy.tasks = []
}

function toggleDeleteButton () {
  const deleteBtn = document.querySelector('.deleteBtn')
  deleteBtn.style.display = tasksProxy.tasks.length > 0 ? 'block' : 'none'
}

// **Инициализация**
document.querySelector('.createBtn').addEventListener('click', addTask)
document.querySelector('.deleteBtn').addEventListener('click', allDelete)
document.addEventListener('DOMContentLoaded', renderTasks)
