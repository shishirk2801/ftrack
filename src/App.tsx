import "./App.css";
import Navbar from "./components/header/navbar";
import Home from "./components/project/home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Project from "./components/project/project";

function ProjectRouteWrapper() {
  const location = useLocation();
  const projectData = location.state ? location.state.project : null;

  return <Project project={projectData} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="w-full"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<ProjectRouteWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
