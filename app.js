const LOCAL_STORAGE_LIST_KEY = 'todo.lists'
const LOCAL_STORAGE_SELECTED_LIST_KEY = 'todo.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY)

loadEvents();
// load every event in the page
function loadEvents() {
    renderPage();
    document.querySelector('form').addEventListener('submit', submit);
    document.getElementById('clear').addEventListener('click', clearList);
    document.querySelector('[data-list]').addEventListener('click', deleteOrTick);
}

function renderPage() {
    if(lists.length == 0) return
    lists.map((list)=>{
        addTask(list.id,list.name)
    })
}

// submit data function
function submit(e) {
    e.preventDefault();
    const input = document.querySelector('input');
    let inputValue = input.value;
    if(inputValue == null || inputValue === '') return
    // add to local storage
    const list = createList(inputValue);
    lists.push(list);
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
    // add to html
    addTask(list.id,list.name);
    input.value = '';
}

// add tasks
function addTask(id,name) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    li.innerHTML = `<div data-id=${id}><span class="delete">×</span><input type="checkbox"><label>${name}</label></div>`;
    ul.appendChild(li);
    document.querySelector('.tasksBoard').style.display = 'block';
}

function createList(task){
    return { id: Date.now().toString(), name: task, complete: false}
}

// clear tasks
function clearList(e) {
    // setting the ul innerHML to an empty string
    document.querySelector('ul').innerHTML = '';
    document.querySelector('.tasksBoard').style.display = 'none';
    localStorage.clear(LOCAL_STORAGE_LIST_KEY)
}

// deleteTick
function deleteOrTick(e) {
    if (e.target.className == 'delete')
        deleteTask(e);
    else {
        tickTask(e);
    }
}

// delete task
function deleteTask(e) {
    const remove = e.target.parentNode;
    console.log(remove)
    const removeId = e.target.parentNode["data-id"]
    console.log(removeId)
    const parentNode = remove.parentNode;
    parentNode.removeChild(remove);
}

// tick a task
function tickTask(e) {
    const task = e.target.nextSibling;
    if (e.target.checked) {
        task.style.textDecoration = "line-through";
        task.style.color = "#ff0000";
    } else {
        task.style.textDecoration = "none";
        task.style.color = "#2f4f4f";
    }
}