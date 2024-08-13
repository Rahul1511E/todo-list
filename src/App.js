import React, { useState, useEffect } from "react";
import "./App.css";
import moment from 'moment-timezone';

function TaskCont({
  subject,
  description,
  date,
  fetchTasks,
  fetchArchivedTasks,
  status,
}) {
  const completeTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/complete/${encodeURIComponent(subject)}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error("Failed to complete task");
      }

      const result = await response.json();
      if (result.success) {
        fetchTasks();
        fetchArchivedTasks();
      }
    } catch (error) {
      console.log("Error completing task:", error);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/delete/${encodeURIComponent(subject)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const result = await response.json();
      if (result.success) {
        fetchTasks();
        fetchArchivedTasks();
      }
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <>
      <p>Sub:  {subject}</p>
      <p>About:  {description}</p>
      <p>Deadline: {moment.tz(date, 'Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a')}</p>
      <button onClick={status === "COMPLETED" ? completeTask : deleteTask}>
        {status}
      </button>
      <hr />
    </>
  );
}

function Currenttask({ tasks, fetchTasks, fetchArchivedTasks }) {
  return (
    <div>
      <ul>
        {tasks.map((task, index) => (
          <TaskCont
            key={index}
            subject={task.subject}
            description={task.description}
            date={task.date}
            fetchTasks={fetchTasks}
            fetchArchivedTasks={fetchArchivedTasks}
            status="COMPLETED"
          />
        ))}
      </ul>
    </div>
  );
}

function ArchivedData({ archieved, fetchTasks, fetchArchivedTasks }) {
  return (
    <div>
      <ul>
        {archieved.map((task, index) => (
          <TaskCont
            key={index}
            subject={task.subject}
            description={task.description}
            date={task.date}
            fetchTasks={fetchTasks}
            fetchArchivedTasks={fetchArchivedTasks}
            status="DELETE"
          />
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [archieved, setArchieved] = useState([]);
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5001/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  const fetchArchivedTasks = async () => {
    try {
      const response = await fetch("http://localhost:5001/archieve");
      if (!response.ok) {
        throw new Error("Failed to fetch archived tasks");
      }
      const data = await response.json();
      setArchieved(data);
    } catch (error) {
      console.log("Error fetching archived tasks:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const date_a = date.slice(0, 10) + "    " + date.slice(11, 16);
      const response = await fetch("http://localhost:5001/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description, date_a }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Submission failed: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      if (result.success) {
        fetchTasks();
      } else {
        console.log("Submission failed!");
      }
    } catch (error) {
      console.log("Error during submission:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchArchivedTasks();
  }, []);

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        <div className="task-form">
          <input
            type="text"
            placeholder="Subject"
            className="input-field"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <input
            placeholder="Description"
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="datetime-local"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="submit-btn">Add Task</button>
        </div>
      </form>

      <div className="tasks-section">
        <div className="current-tasks">
          <h2>Current Tasks</h2>
          <div className="cont">
            <Currenttask
              tasks={tasks}
              fetchTasks={fetchTasks}
              fetchArchivedTasks={fetchArchivedTasks}
            />
          </div>
        </div>

        <div className="archived-tasks">
          <h2>Archived Tasks</h2>
          <div className="cont">
            <ArchivedData
              archieved={archieved}
              fetchTasks={fetchTasks}
              fetchArchivedTasks={fetchArchivedTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
