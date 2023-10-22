import ToDo from "./components/ToDo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import checkMark from "./static/verified.gif";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [savedLists, setSavedLists] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    const savedListsJSON = localStorage.getItem("savedLists");
    if (savedListsJSON) {
      setSavedLists(JSON.parse(savedListsJSON));
    }
  }, []);

  useEffect(() => {
    if (selectedList !== null) {
      // Load the selected list from local storage and set it as the current task list
      const selectedListTasks = JSON.parse(localStorage.getItem(selectedList));
      if (selectedListTasks) {
        setTasks(selectedListTasks);
      }
    }
  }, [selectedList]);

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <ToDo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
        addTask={addTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    console.log(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTasks);
  }

  function handleSavedList(listName) {
    localStorage.setItem(listName, JSON.stringify(tasks));
    setSavedLists([...savedLists, listName]);
    setSelectedList(null);
  }

  function loadSavedList(listName) {
    // Set the selected list for loading
    setSelectedList(listName);
  }

  return (
    <div className="todoapp stack-large">
      <div className="title-row">
        <img src={checkMark} width="60px" height="60px" />
        <h1>To Do List</h1>
      </div>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <div className="btn-group">
        <h2 id="list-heading">{headingText}</h2>
        <button
          className="save-list btn"
          onClick={() => handleSavedList(prompt("List name?"))}
        >
          Save
        </button>
        <select
          className="save-list btn"
          onChange={(e) => loadSavedList(e.target.value)}
        >
          <option>Saved Lists</option>
          {savedLists.map((listName) => (
            <option key={listName} value={listName}>
              {listName}
            </option>
          ))}
        </select>
      </div>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
