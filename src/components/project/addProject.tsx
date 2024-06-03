import { useState } from "react";

const AddProject = (props) => {
  const [projectName, setProjectName] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const newProject = {
      name: projectName,
      folderPath,
      usage: {},
      files: [],
    };
    const updatedProjects = [...props.projects, newProject];
    props.updateProjects(updatedProjects);

    // Save the updated projects to Electron Store
    window.ipcRenderer.setProjectData(updatedProjects);

    // Clear the form fields
    setProjectName("");
    setFolderPath("");
  };
  const handleOpenDirectory = async () => {
    event.preventDefault();
    const path = await window.ipcRenderer.openDirectoryDialog();
    if (path) {
      setFolderPath(path);
    }
  };
  return (
    <div className="w-1/5 p-4 mx-3 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          Add Project to Track
        </h5>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Project Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Project Name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="path"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Project Folder path
          </label>
          <button onClick={handleOpenDirectory}>Open Directory</button>
          {folderPath && <p>Selected Folder: {folderPath}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
