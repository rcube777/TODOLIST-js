const inputArea = document.querySelector(".input-area");
const addBtn = document.querySelector(".add-btn");
const taskLists = document.querySelector(".task-lists ul");
const saveBtn = document.querySelector(".save-btn");

// Event listener to add task on button click
addBtn.addEventListener("click", function () {
    addTask();
});

// Event listener to add task on Enter key press
inputArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Event listener to save tasks to file
saveBtn.addEventListener("click", function() {
    if (taskLists.children.length === 0) {
        alert("Enter some task");
    } else {
        saveTasksToFile();
    }
});

// Function to add a task
function addTask() {
    let task = inputArea.value.trim();
    if (task === "") {
        alert("You must write something");
        return;
    } else {
        // creating a list
        const li = document.createElement("li");
        // adding delete button and task to the list 
        li.innerHTML = `${task} <button class="delete-btn">Delete</button> <button class="complete-btn">Complete</button>`;
        // adding list to the taskLists
        taskLists.appendChild(li);

        // Save tasks to local storage
        saveTasks();

        // deleting tasks
        li.querySelector(".delete-btn").addEventListener("click", () => {
            taskLists.removeChild(li);
            saveTasks();
        });

        // Event listener to mark a task as completed
        li.querySelector(".complete-btn").addEventListener("click", () => {
            li.style.textDecoration = "line-through";
        });

        // Clear the input field
        inputArea.value = "";
    }
}

// Function for saving tasks in local storage
function saveTasks() {
    let tasks = [];
    taskLists.querySelectorAll("li").forEach((item) => {
        const taskText = item.childNodes[0].textContent.trim();
        tasks.push(taskText);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function for loading saved tasks to the display
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((taskText) => {
        const li = document.createElement("li");
        li.innerHTML = `${taskText} <button class="delete-btn">Delete</button> <button class="complete-btn">Complete</button>`;
        taskLists.appendChild(li);

        // Event listener to delete a task
        li.querySelector(".delete-btn").addEventListener("click", () => {
            taskLists.removeChild(li);
            saveTasks();
        });

        // Event listener to mark a task as completed
        li.querySelector(".complete-btn").addEventListener("click", () => {
            li.style.textDecoration = "line-through";
        });
    });
}

// Load tasks when the document is fully loaded
document.addEventListener("DOMContentLoaded", loadTasks);

// Function to save the to-do list in a txt file
function saveTasksToFile() {
    let tasks = []; // Create a new array tasks
    taskLists.querySelectorAll("li").forEach((item) => {
        const taskText = item.childNodes[0].textContent.trim();
        tasks.push(taskText);
    });

    const blob = new Blob([tasks.join('\n')], { type: 'text/plain' }); // tasks.join joins the task text in the tasks array in a single string but in different lines
    // new Blob([ ... ]), Creates a new Blob object containing the joined tasks string.
    // The Blob object represents a file-like object of immutable, raw data.
    // The { type: 'text/plain' } option specifies that the data is plain text.

    const a = document.createElement('a'); // Create a new anchor element. This element will be used to trigger the download.
    a.href = URL.createObjectURL(blob); // Set the href attribute of a to URL representing the blob object.
    // URL.createObjectURL(blob) creates a temporary URL for the blob.
    a.download = 'tasks.txt'; // Set the download attribute of a to 'tasks.txt'. This attribute specifies the name of the file to be downloaded.
    a.click(); // The download will be triggered when clicking a.
    URL.revokeObjectURL(a.href); // Release the temporary URL created by URL.createObjectURL(blob) to free up memory.
}
