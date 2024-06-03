import { useState, useEffect } from "react";
import ProjectCard from "./projectCard";

const Projects = (props) => {
  const { projects } = props;
  console.error("prop", projects);

  const updateUsage = (elapsedSeconds, projectPath) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedProjects = projects.map((project) => {
      if (project.folderPath === projectPath) {
        const usage = project.usage[today] || 0;
        return {
          ...project,
          usage: {
            ...project.usage,
            [today]: usage + elapsedSeconds,
          },
        };
      }
      return project;
    });
    // Update the projects in your store
    window.ipcRenderer.setProjectData(updatedProjects);
  };

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="mt-4">
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Your Projects
        </h5>
        <hr />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              updateUsage={updateUsage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
