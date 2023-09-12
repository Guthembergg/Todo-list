"use client";

import { useEffect, useState } from "react";

const taskStatuses = [
  {
    id: 1,
    name: "To Do",
  },
  {
    id: 2,
    name: "In Progress",
  },
  {
    id: 3,
    name: "Completed",
  },
  {
    id: 4,
    name: "Delegated",
  },
];

function getTasks() {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    const data = localStorage.getItem("tasks");
    return data ? JSON.parse(data) : [];
  } else return [];
}

function setTasks(tasks) {
  localStorage.setItem("tasks", tasks);
}

const TaskModel = {
  getTasks,
  setTasks,
};

function CreateTask(props) {
  const { currentTask, setCurrentTask, currentTaskType, setCurrentTaskType } =
    useCurrentTask();

  function addTask() {
    const companyName = currentTask;
    if (!companyName) {
      return;
    }
    const taskTypeId = +currentTaskType;
    const taskType = taskStatuses.find((item) => item.id === taskTypeId);
    const task = {
      id: Date.now(),
      companyName: companyName,
      taskTypeId: taskTypeId,
      taskType: taskType,
    };
    const updatedTask = [...TaskModel.getTasks(), task];
    TaskModel.setTasks(JSON.stringify(updatedTask));

    props.setTasks(updatedTask);

    setCurrentTask("");
    setCurrentTaskType("1");
  }

  return (
    <div className="create-task">
      <input
        id="company-name"
        type="text"
        placeholder="Task name"
        value={currentTask}
        onChange={(ev) => setCurrentTask(ev.target.value)}
      />
      <select
        id="task-type"
        name="task-type"
        className="select-css"
        defaultValue={currentTaskType}
        onChange={(ev) => setCurrentTaskType(ev.target.value)}
      >
        {taskStatuses.map((task) => {
          return (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          );
        })}
      </select>
      <button className="add-task-button" onClick={addTask}>
        + Add Task
      </button>
    </div>
  );
}

function TaskList(props) {
  const { tasks, setTasks, taskTypeId, title } = props;

  function allowDrop(ev) {
    // console.log(ev);
    ev.preventDefault();
  }

  function drop(ev) {
    // ev.preventDefault();
    var taskId = ev.dataTransfer.getData("taskId");
    const matchingTask = tasks.find((task) => task.id === +taskId);
    if (!matchingTask) {
      return;
    }

    matchingTask.taskTypeId = taskTypeId;
    matchingTask.taskType = taskStatuses.find((item) => item.id === taskTypeId);

    setTasks([...tasks]);
    TaskModel.setTasks(JSON.stringify([...tasks]));
  }

  function deleteTaskWithId(taskId) {
    if (!taskId) {
      return;
    }
    const filteredTasks = tasks.filter((item) => {
      return item.id !== taskId;
    });
    setTasks([...filteredTasks]);
    TaskModel.setTasks(JSON.stringify([...filteredTasks]));
  }

  return (
    <div
      className="task-list"
      onDrop={(ev) => drop(ev)}
      onDragOver={(ev) => allowDrop(ev)}
    >
      {" "}
      <h2>{title}</h2>
      {tasks
        .filter((task) => task.taskTypeId === taskTypeId)
        .map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTaskWithId={deleteTaskWithId}
          ></Task>
        ))}
    </div>
  );
}

function Task(props) {
  const { task, deleteTaskWithId } = props;

  function deleteTask() {
    deleteTaskWithId(task.id);
  }

  return (
    <div className="task" draggable="true" onDragStart={(ev) => drag(ev, task)}>
      <div className="task-name">{task.companyName}</div>
      <div className="task-date-and-type-container">
        <div className="task-date">{new Date(task.id).toDateString()}</div>
        <div className="task-type">{task.taskType.name}</div>
      </div>
      <div className="delete" onClick={deleteTask}>
        <span>X</span>
      </div>
    </div>
  );
}

function drag(ev, task) {
  ev.dataTransfer.setData("taskId", task.id);
}

export default function App() {
  const [tasks, setTasks] = useState(TaskModel.getTasks());
  return (
    <div className="container">
      <CreateTask setTasks={setTasks}></CreateTask>
      <div className="task-container">
        {" "}
        <div className="scritta">
          <img className="post-it" src="/po.png" alt="post-it"></img>
          <h1>
            Task<br></br> Handler
          </h1>
        </div>
        {taskStatuses.map((status) => (
          <TaskList
            key={status.id}
            tasks={tasks}
            setTasks={setTasks}
            taskTypeId={status.id}
            title={status.name}
          ></TaskList>
        ))}
      </div>
      <h3 className="text-center text-sm"> © 2023 karim guettech</h3>
    </div>
  );
}

function useCurrentTask() {
  const [currentTask, setCurrentTask] = useState("");
  const [currentTaskType, setCurrentTaskType] = useState("1");
  return {
    currentTask,
    setCurrentTask,
    currentTaskType,
    setCurrentTaskType,
  };
}
