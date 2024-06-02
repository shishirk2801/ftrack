import { useState, useEffect } from "react";
import Projects from "./projects";
import AddProject from "./addProject";

const Home = () => {
  const [projects, setProjects] = useState([]);

  const updateProjects = (newProjects) => {
    setProjects(newProjects);
    window.ipcRenderer.invoke("set-project-data", newProjects);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await window.ipcRenderer.getProjectData();
      console.error(data);
      setProjects(data || []);
    };

    fetchProjects();
  }, []);
  return (
    <div className="p-4 bg-dark border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
      <div className="flex mt-4">
        <AddProject projects={projects} updateProjects={updateProjects} />
        <Projects projects={projects} />
      </div>
    </div>
  );
};

export default Home;
