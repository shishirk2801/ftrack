import Project from "./project";

const Projects = (props) => {
  return (
    <>
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="mt-4">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Your Projects
          </h5>
          {props.projects.map((project, index) => (
            <Project
              projectName={project.project}
              projectPath={project.folderPath}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
