let tasks = JSON.parse(localStorage.getItem("tasks"));

const checkToDosExists = () => {
    if (tasks.length == 0) {
        document.getElementById("viewSection--noToDos").style.display = "block";
    } else {
        document.getElementById("viewSection--noToDos").style.display = "none";
    }
}

checkToDosExists();

const generateRandomId = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1

const listElement = (task, assigne, status, id) => {
    let output = ``
    if (status == "done") {
        output += `<li class="viewSection--listItem rounded-3 shadow viewSection--listItemDone" >`
    } else {
        output += `<li class="viewSection--listItem rounded-3 shadow viewSection--listItemToDo" >`
    }

    output += `
    <div class="viewSection--listItemContent">
        <span>Task: <span id="${id}" >${task}</span></span>
        <span title="delete"><img width="25px" onclick="deleteTask(this)" src="https://www.freeiconspng.com/thumbs/remove-icon-png/remove-icon-png-26.png"></span>
    </div>
    <div class="viewSection--listItemContent">
        <span>Assigne: ${assigne}</span>`
    if (status == "to do") {
        output += `<span title="mark as done!" > <img width="25px" onclick="markTaskDone(this)" src="https://www.searchpng.com/wp-content/uploads/2018/12/Blue-tick-png.png" alt=""> </span>
        </div>
        </li>`
    }
    output += `</div></li>`
    return output
}

const displayStat = tasks => {
    const todoCount = tasks.filter(task => task.status == "to do").length
    const doneCount = tasks.length - todoCount;

    document.getElementById("todo").innerHTML = todoCount;
    document.getElementById("done").innerHTML = doneCount;

}

const displayTasks = (tasks) => {
    const list = document.getElementById("viewSection--list");
    checkToDosExists();
    let output = ``
    tasks.map(task => {
        output += listElement(task.task, task.assigne, task.status, task.id);
    });

    list.innerHTML = output

    displayStat(tasks);

}

displayTasks(tasks)

function addElement() {
    const task = document.getElementById("addSection--formCreate-taskInput").value;
    const assigne = document.getElementById("addSection--formCreate-assigneInput").value;
    const checkTask = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(task); //Regex for only allowing letters, numbers, space, commas, periods 
    const checkAssigne = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(assigne);
    //validating the user input
    if (checkTask && checkAssigne) {
        saveTask(task, assigne)
        displayTasks(tasks)
        document.getElementById("formCreate--errorMessage").style.display = "none";
        document.getElementById("addSection--formCreate-taskInput").value = "";
        document.getElementById("addSection--formCreate-assigneInput").value = "";
        checkToDosExists();
    } else {
        document.getElementById("formCreate--errorMessage").style.display = "block";
    }
}

const saveTask = (taskText, assigneText) => {
    let taskObj = {
        id: generateRandomId(),
        task: taskText,
        assigne: assigneText,
        status: "to do"
    }
    tasks.push(taskObj)
    displayStat(tasks);
};




const deleteTask = (element) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        const taskToDelete = element.parentNode.parentNode.childNodes[1].childNodes[1].getAttribute('id');
        tasks = tasks.filter(task => task.id != taskToDelete);
        displayTasks(tasks)
        displayStat(tasks);
        checkToDosExists();
    }
}

const markTaskDone = element => {
    const taskToMark = element.parentNode.parentNode.previousSibling.previousSibling.childNodes[1].childNodes[1].innerHTML;
    element.parentNode.style.display = "none";
    tasks.map(task => {
        if (task.task == taskToMark)
            task.status = "done";
    });

    displayStat(tasks);
    displayTasks(tasks)




}

const searchList = (searchFilter, tasksList, searchInput) => tasksList.filter(task => task[searchFilter].includes(searchInput))



const updateList = element => {
    const searchInput = element.value;
    const checkSearchInput = /^[0-9a-zA-Z]+$/.test(searchInput);

    if (checkSearchInput) {
        const checkboxSearchFilter = document.getElementById("checkboxConatiner--checkbox");
        const subTasks = checkboxSearchFilter.checked != true ? searchList("task", tasks, searchInput) : searchList("assigne", tasks, searchInput);
        displayTasks(subTasks)
        document.getElementById("viewSection--noMatchingResults").style.display = "none";
        if (subTasks.length == 0)
            document.getElementById("viewSection--noMatchingResults").style.display = "block";
    } else {
        displayTasks(tasks)
    }
}

window.onbeforeunload = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}