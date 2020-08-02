const LOCAL_STORAGE_LIST_KEY = 'todo.lists'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

loadEvents();
// load every event in the page
function loadEvents() {
    renderPage();
    document.querySelector('[data-form]').addEventListener('submit', submit);
    document.getElementById('clearAll').addEventListener('click', clearList);
    document.getElementById('clear').addEventListener('click', clearComplete);
    document.querySelector('[data-list]').addEventListener('click', deleteOrTick);
}

function renderPage() {
    if(lists.length == 0) return
    lists.map((list)=>{
        addTask(list)
    })
}

// submit data function
function submit(e) {
    e.preventDefault();
    const input = document.querySelector('[data-input]');
    let inputValue = input.value;
    if(inputValue == null || inputValue === '') return
    const list = createList(inputValue);
    // add to html
    addTask(list);
    input.value = '';
    // add to local storage
    lists.push(list);
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
    
}

// add tasks
function addTask({id,name,complete}) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    li.innerHTML = `<div data-id=${id}><span class="delete">×</span><input type="checkbox" ${complete&&"checked"}><label style="${complete?"text-decoration:line-through;color:#cccccc":"color:#2f4f4f"}">${name}</label><span></span></span></span></div>`;
    if(complete){
        li.classList.add("task-complete");
    }
    ul.appendChild(li);
    document.querySelector('.tasksBoard').style.display = 'block';
}

function createList(task){
    return { id: Date.now().toString(), name: task, complete: false}
}

// clear tasks
function clearList() {
    // setting the ul innerHML to an empty string
    document.querySelector('ul').innerHTML = '';
    document.querySelector('.tasksBoard').style.display = 'none';
    localStorage.clear(LOCAL_STORAGE_LIST_KEY)
}

// clear complete
function clearComplete(){
    // update html
    const elements = document.querySelectorAll(".task-complete");
    for(const element of elements){
        element.remove()
    }
    if(document.querySelector('li')==null){
        document.querySelector('.tasksBoard').style.display = 'none';
    }
    // update localStorage
    lists = lists.filter(item => {
        return item.complete === false;
    })
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
    
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
    const removeId = remove.getAttribute("data-id");
    // remove html
    const parentNode = remove.parentNode;
    parentNode.remove(remove);
    // remove from localStorage
    lists = lists.filter(list => list.id !== removeId)
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
    if(lists.length === 0){
        clearList();
    }
}

// tick a task
function tickTask(e) {
    const task = e.target.nextSibling;
    const taskParent = e.target.parentNode.parentNode;
    const tickId = task.parentNode.getAttribute('data-id')
    // update html
    if (e.target.checked) {
        taskParent.classList.add("task-complete");
        task.style.textDecoration = "line-through";
        task.style.color = "#cccccc";
    } else {
        task.style.textDecoration = "none";
        task.style.color = "#2f4f4f";
    }
    // update localStorage
    lists = toggleTaskComplete(tickId);
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists));
}

// use Object.assign update object(lists) value
function toggleTaskComplete(id) {
    return lists.map(item => {
        const newItem = Object.assign({}, item);
        if(newItem.id === id){
            newItem.complete = !newItem.complete;
        }
        return newItem;
    })
}