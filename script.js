const inputBox = document.getElementById("input-box");
const inputDesc = document.getElementById("input-area");
const listContainer = document.getElementById("list-container");

const date = document.getElementById("datetime");
const descText = document.getElementById("descriptionText");

const informTab = document.getElementById("information");
const deleter = document.getElementById("deleteBtn");
const marker = document.getElementById("markBtn");

let todos = [];
let activeItem = null;


window.addEventListener("load", function(){
    const load_screen = document.getElementById("preloader");
    setTimeout(() => {
        load_screen.remove();
    }, 2000);
});

// Add a new task
function addTask() {
    const title = inputBox.value;
    const description = inputDesc.value;
    const now = new Date();

    if (title === '' || description === '') {
        alert("Please complete the information.");
        return;
    }

    const todo = { title, description, checked: false, createdAt: now.toLocaleString() };
    todos.push(todo);

    let li = document.createElement("li");
    li.textContent = title;
    li.onclick = function () {
        showDescription(todo.description);
        date.textContent = todo.createdAt;
        toggleTaskInfo(li, todo);
    };
    
    listContainer.appendChild(li);
    inputBox.value = "";
    inputDesc.value = "";
    saveData();
}

// Show the task description in the information panel
function showDescription(text) {
    descText.textContent = text;
    saveData();
}

// Toggle task information panel open/close
function toggleTaskInfo(li, todo) {
    if (activeItem === li) {
        informTab.classList.toggle("openinfo");
        if (!informTab.classList.contains("openinfo")) {
            activeItem = null;
        }
    } else {
        informTab.classList.add("openinfo");
        activeItem = li;
    }
    saveData();
}

// Delete the selected task
deleter.addEventListener("click", () => {
    if (!activeItem) {
        alert("No item selected");
        return;
    }

    date.textContent = "";
    descText.textContent = "";
    const index = Array.from(listContainer.children).indexOf(activeItem);
    todos.splice(index, 1); // Remove the task from the array
    activeItem.remove();
    informTab.classList.toggle("openinfo");
    activeItem = null;
    saveData();
});

// Mark the task as completed
marker.addEventListener("click", () => {
    if (activeItem) {
        activeItem.classList.toggle("checked");
        const index = Array.from(listContainer.children).indexOf(activeItem);
        todos[index].checked = !todos[index].checked; // Toggle the checked state
        saveData();
    }
});

// Save the tasks to localStorage
function saveData() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Load tasks from localStorage and populate the list
function showTask() {
    const storedData = localStorage.getItem("todos");
    if (storedData) {
        todos = JSON.parse(storedData);
        todos.forEach(todo => {
            let li = document.createElement("li");
            li.textContent = todo.title;
            li.classList.toggle("checked", todo.checked); // Mark as checked if applicable
            li.onclick = function () {
                showDescription(todo.description);
                date.textContent = todo.createdAt;
                toggleTaskInfo(li, todo);
            };
            listContainer.appendChild(li);
        });
    }
}

// Clear all tasks
function clearTask() {
    window.localStorage.removeItem('todos');
    listContainer.innerHTML = '';
    informTab.classList.remove("openinfo"); // force hide
    descText.textContent = "";
    date.textContent = "";
    activeItem = null;
    todos = [];
}

showTask(); // Initialize tasks on page load

