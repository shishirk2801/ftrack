import { useState, useEffect } from "react";
import ProjectCard from "./projectCard";

const Projects = (props) => {
  const { projects } = props;

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="mt-4">
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Your Projects
        </h5>
        <hr />
        {projects.map((project, index) => {
          console.error(project);
          return (
            <ProjectCard
              key={index}
              projectName={project.project}
              projectPath={project.folderPath}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
