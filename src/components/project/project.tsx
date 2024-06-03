import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface File {
  name: string;
  todos: Todo[];
}

interface Project {
  name: string;
  path: string;
  usage: { [date: string]: number };
  files: File[];
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [newTodos, setNewTodos] = useState<{ [key: string]: string }>({});
  const [fileTodos, setFileTodos] = useState<{ [key: string]: Todo[] }>(() => {
    const initialTodos: { [key: string]: Todo[] } = {};
    project.files.forEach((file) => {
      initialTodos[file.name] = file.todos;
      newTodos[file.name] = "";
    });
    return initialTodos;
  });

  const handleAddTodo = (fileName: string) => {
    if (!newTodos[fileName].trim()) return;

    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodos[fileName],
      completed: false,
    };

    setFileTodos((prev) => ({
      ...prev,
      [fileName]: [...prev[fileName], newTodoItem],
    }));

    setNewTodos((prev) => ({
      ...prev,
      [fileName]: "",
    }));
  };

  const handleToggleTodo = (fileName: string, todoId: number) => {
    setFileTodos((prev) => ({
      ...prev,
      [fileName]: prev[fileName].map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  const calculateHours = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} h ${minutes} m`;
  };

  const calculateTodayHours = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayUsage = project.usage[today] || 0;
    return calculateHours(todayUsage);
  };

  const calculateTotalHours = () => {
    const totalUsage = Object.values(project.usage).reduce(
      (total, usage) => total + usage,
      0
    );
    return calculateHours(totalUsage);
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:border-gray-700 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-4xl font-semibold">{project.name}</h2>
        </div>
        <div>
          <button
            type="button"
            className="focus:outline-none text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-700 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Today: {calculateTodayHours()} <br />
            Total: {calculateTotalHours()}
          </button>
        </div>
      </div>
      <hr />

      {project.files.map((file) => (
        <div key={file.name} className="mb-4">
          <h3 className="text-2xl font-semibold">{file.name}</h3>
          <ul className="list-disc list-inside mb-2">
            {fileTodos[file.name].map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center ${
                  todo.completed ? "text-green-600 line-through" : ""
                }`}
                onClick={() => handleToggleTodo(file.name, todo.id)}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(file.name, todo.id)}
                  className="mr-2 cursor-pointer"
                />
                <span>{todo.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            <input
              type="text"
              value={newTodos[file.name]}
              onChange={(e) =>
                setNewTodos({ ...newTodos, [file.name]: e.target.value })
              }
              className="border rounded-lg p-2 flex-grow ml-6 mr-2"
              placeholder="Add new todo"
            />
            <button
              onClick={() => handleAddTodo(file.name)}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      ))}

      <Link
        to="/"
        className="text-blue-500 hover:underline focus:outline-none mt-2 inline-block"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ProjectCard;
