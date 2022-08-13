// Declaracion de variables enlazadas a html
const taskInput = document.querySelector('#todo-input')
const addButton = document.querySelector('#add-todo')
const taskContainer = document.querySelector('#list-todo')
const completeAllTasksButton = document.querySelector('#complete-all-tasks')
const deleteTasksButton = document.querySelector('#clear-tasks')
const listContainer = document.querySelector('.list-container')
const check = 'fa-check-circle'
const uncheck = 'fa-circle'
let statusComplete 

// Variable global
let tasksList = []


// Funciones

const handleAddTask = () => {
  const taskValue = getInputValue(taskInput)
  addTask(taskValue)
  renderTasks()
  clearInput(taskInput)
}

const clearNodeChild = (node) => {
    node.innerHTML = ''
}

const clearInput = (inputNode) => {
  inputNode.value = ''
}

const getInputValue = (inputNode) => inputNode.value

const generateRandomId = () => String(Math.random() + 100000)


const addTask = (description, isCompleted = false) => {
  if(taskInput.value != "")
    tasksList.push({
        id: generateRandomId(),
        description,
        isCompleted
    })
    saveTasksIntoStorage(tasksList)
}

const toggleCompleteTask = (taskId) => {
    const task = tasksList.find((tasksList) => tasksList.id === taskId)
    task.isCompleted = !task.isCompleted
    saveTasksIntoStorage(tasksList)
}

const completeAllTasks = () => {
 tasksList.forEach(task => {
    task.isCompleted = true
  }) 
  saveTasksIntoStorage(tasksList)
}

const uncompleteAllTasks = () => {
  tasksList.forEach(task => {
    if(task.isCompleted)
    task.isCompleted = false
  }) 
  saveTasksIntoStorage(tasksList)
}

const readButton = () => {
  const statusS = getStatusFromStorage()
  statusComplete = statusS
  tasksList.forEach(task => {
  if (task.isCompleted === true){
  completeAllTasksButton.textContent = 'Desacompletar todo'
  statusComplete = false 
  } else {
  completeAllTasksButton.textContent = 'Completar todo'
  statusComplete = true 
  }
  })
}

const deleteTask = (taskId) => {
    const taskIndex = tasksList.findIndex((tasksList) => tasksList.id === taskId)
    tasksList.splice(taskIndex, 1)
    saveTasksIntoStorage(tasksList)
}

const clearTasks = () => {
  tasksList = []
  saveTasksIntoStorage(tasksList)
}

const isTaskCompleted = (task) => task.isCompleted


const renderTasks = () => {
    clearNodeChild(taskContainer)
    tasksList.forEach(generateTaskElements)

    if (tasksList.length === 0) {
      listContainer.setAttribute('style', 'display: none;');
    } else {
      listContainer.setAttribute('style', 'display: flex;');
    }
    saveStatusIntoStorage(statusComplete)  
}

const generateTaskElements = (task) => {
    const listItemElement = generateListItemElement()
        const spanElement = generateSpanElement(task)
        const completeTaskButtonElement =  generateCompleteTaskButtonElement(task)
        const deleteTaskButtonElement = generateDeleteTaskButtonElement(task)
        listItemElement.append(spanElement, completeTaskButtonElement, spanElement, deleteTaskButtonElement)
        taskContainer.appendChild(listItemElement)
}


const generateListItemElement = () => {
    const listItemElement = document.createElement('li')
    
    return listItemElement
  }
  
  const generateSpanElement = (task) => {
    const spanElement = document.createElement('span')
    spanElement.setAttribute('class', 'spanTask')
    spanElement.textContent = task.description
    spanElement.style = `text-decoration:${isTaskCompleted(task) ? 'line-through .25rem violet' : 'none'};`
    return spanElement
  }

  const generateCompleteTaskButtonElement = (task) => {

    const REALIZADO = isTaskCompleted(task) ? check : uncheck 
    const completeTaskButtonElement = document.createElement('i')
    completeTaskButtonElement.setAttribute('data-index', task.id)
    completeTaskButtonElement.setAttribute('class', `far ${REALIZADO}`)
    completeTaskButtonElement.style = `color:${isTaskCompleted(task) ? 'green' : 'red'};`
    addEventListenerToButton(completeTaskButtonElement, 'complete')
    readButton()
    return completeTaskButtonElement
  }
  
  const generateDeleteTaskButtonElement = (task) => {
    const deleteTaskButtonElement = document.createElement('i')
    deleteTaskButtonElement.setAttribute('data-index', task.id)
    deleteTaskButtonElement.setAttribute('class', 'delete fas fa-trash de')
    addEventListenerToButton(deleteTaskButtonElement, 'delete')
    return deleteTaskButtonElement
  }

  

//Listeners

//Obtener las tareas del local storage
document.addEventListener('DOMContentLoaded', () => {
  const tasks = getTasksFromStorage()
  if(!tasks){ // (tasks === null)
    saveTasksIntoStorage(tasksList)   
  } else {
    tasksList = tasks
    readButton()
    renderTasks()
      
  }
})
 

//Agregar tareas con boton
addButton.addEventListener('click', () => {
  handleAddTask()
})

//Agregar tareas con enter
taskInput.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter') handleAddTask()
})


//Completar todas las tareas
completeAllTasksButton.addEventListener('click', () => {  
 if(statusComplete === true){
    completeAllTasks()
    renderTasks()
      }
  else{
        uncompleteAllTasks()
        renderTasks()
        
      } 
})   


//Eliminar todas las tareas 
deleteTasksButton.addEventListener('click', () => {
  if(confirm('¿Seguro quieres eliminar todas las tareas?')){
  clearTasks()
  renderTasks()
  }
})

const addEventListenerToButton = (button, action) => {
    button.addEventListener('click', (event) => {
      const taskId = event.target.getAttribute('data-index')
      if (action === 'complete') toggleCompleteTask(taskId)
        if (action === 'delete')
          if (confirm('¿Estás seguro de eliminar esta tarea?')) deleteTask(taskId)
      renderTasks()
    })
  }

  // --> Local Storage

  const tasksStorageKey = 'tasks'
  const statusStorageKey = 'status'

  // leer 
  const getTasksFromStorage = () => JSON.parse(localStorage.getItem(tasksStorageKey))
  const getStatusFromStorage = () => JSON.parse(localStorage.getItem(statusStorageKey))

  //escribir 
  const saveTasksIntoStorage = (tasks/*array*/) => {
  localStorage.setItem(tasksStorageKey, JSON.stringify(tasks))
}

const saveStatusIntoStorage = (status) => {
  localStorage.setItem(statusStorageKey, JSON.stringify(status))
}
