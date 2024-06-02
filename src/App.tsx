import "./App.css";
import Navbar from "./components/header/navbar";
import Home from "./components/project/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Project from "./components/project/project";

function App() {
  const projectData = {
    project: "My Project",
    folderPath: "/path/to/project",
    totalHours: 120,
    files: [
      {
        name: "index.tsx",
        todos: [
          { id: 1, text: "Fix bug #123", completed: false },
          { id: 2, text: "Refactor component", completed: true },
        ],
      },
      {
        name: "app.tsx",
        todos: [
          { id: 3, text: "Update dependencies", completed: false },
          { id: 4, text: "Write tests", completed: false },
        ],
      },
    ],
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="w-full"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Project project={projectData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
