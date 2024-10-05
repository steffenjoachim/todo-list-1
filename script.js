const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-btn");
const formContainer = document.getElementById("form-container");
const todosContainer = document.querySelector(".todos-container");
const h2Form = document.createElement("h2");
const form = document.createElement("form");

const radioBtnArray = ["All", "Open", "Done"];
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filteredTodos = [...todos];

addButton.addEventListener("click", addTodo);

h2Form.textContent = "Filter & Options";
form.classList.add("mbl-2");

formContainer.appendChild(h2Form);
formContainer.appendChild(form);

function render() {
  renderForm();
  filterTodos(); 
}

function renderForm() {
  form.innerHTML = "";
  for (let i = 0; i < radioBtnArray.length; i++) {
    const input = createFormInput(i);
    const label = createFormLabel(i, input);
    form.append(input, label);
  }
  const btn = createRemoveBtn();

  // ====== Event listener for the radio buttons: ======
  const radioBtns = document.querySelectorAll('input[name="filter"]');
  radioBtns.forEach((radio) => {
    radio.addEventListener("change", filterTodos);
  });
}

// ========== helper functions for form: ==========

function createFormLabel(i, input) {
  const label = document.createElement("label");
  label.htmlFor = input.id;
  label.textContent = radioBtnArray[i];
  return label;
}

function createFormInput(i) {
  const input = document.createElement("input");
  input.type = "radio";
  input.name = "filter";
  input.id = radioBtnArray[i].toLowerCase();
  input.value = radioBtnArray[i].toLowerCase();
  if (i === 0) input.checked = true;
  return input;
}

function createRemoveBtn() {
  const btn = document.createElement("button");
  btn.textContent = "Remove Done Todos";
  btn.type = "submit";
  btn.classList.add("mb-2");
  btn.classList.add("btn");
  btn.addEventListener("click", removeDoneTodos)
  formContainer.append(btn);
}

function removeDoneTodos(e) {
    e.preventDefault(); 
    todos = todos.filter(todo => !todo.done);
    localStorage.setItem("todos", JSON.stringify(todos));
    filterTodos();
  }
  

// ========== end helper functions for form ===========

function renderTodos() {
    todosContainer.innerHTML = "";
    filteredTodos.forEach((todo, i) => {
      const section = createTodoSection();
      const description = createTodoDescription(todo); 
      const input = createTodoInput(todo, description); 
      section.append(input, description);
      todosContainer.append(section);
    });
  }  

// =========== helper functions for todos list: ===========

function createTodoSection() {
  const section = document.createElement("section");
  section.classList.add("todo");
  return section;
}

function createTodoInput(todo, description) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = todo.done;
    input.name = `todo-checkbox-${todo.id}`;
  
    input.addEventListener("change", () => markTodoAsDone(todo, input, description));
  
    return input;
  }

  function createTodoDescription(todo) {
    const description = document.createElement("p");
    description.textContent = todo.description;
  
    if (todo.done) description.classList.add("line-through");
  
    return description;
  }

  function markTodoAsDone(todo, input, description) {
    todo.done = input.checked;
  
    if (todo.done) {
      description.classList.add("line-through");
    } else {
      description.classList.remove("line-through");
    }
  
    filterTodos(); 
  }  

// =========== end helper functions for todos list ===========

function addTodo(e) {
  e.preventDefault(); 

  const inputValue = todoInput.value.trim();

  if (inputValue) {
    if (checkifTodoExists(inputValue)) {
        alert("Dieses Todo existiert bereits!");
        return; 
      }
    const newId = createId(); 
    const newTodo = {
      description: inputValue,
      done: false, 
      id: newId,
    };
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

    todoInput.value = ""; 
    filterTodos(); 
  } else {
    alert("Bitte eine Beschreibung eingeben.");
  }
}

function checkifTodoExists(description) {
    return todos.some(todo => todo.description.toLowerCase() === description.toLowerCase());
}

function createId() {
  const lastId = todos.length > 0 ? todos[todos.length - 1].id : 0;
  return lastId + 1;
}

function filterTodos() {
  const selectedFilter = document.querySelector('input[name="filter"]:checked').value;

  if (selectedFilter === "all") {
    filteredTodos = [...todos]; 
  } else if (selectedFilter === "open") {
    filteredTodos = todos.filter((todo) => !todo.done); 
  } else if (selectedFilter === "done") {
    filteredTodos = todos.filter((todo) => todo.done); 
  }

  renderTodos(); 
}

render(); 