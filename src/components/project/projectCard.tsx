import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const ProjectCard = (props) => {
  const { project } = props;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      setStartTimestamp(Date.now());
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      clearInterval(intervalRef.current);
      setIsTimerRunning(false);
      const elapsedSeconds = Math.round((Date.now() - startTimestamp) / 1000);
      props.updateUsage(elapsedSeconds, project.folderPath);
      setElapsedTime(0);
    }
  };

  const calculateTotalHours = () => {
    const today = new Date().toISOString().split("T")[0];
    const project = props.project;
    if (!project || !project.usage[today]) return "0";
    const totalSeconds = project.usage[today];
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours} hours ${minutes} minutes`;
  };

  return (
    <div className="max-w-sm mx-2 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
      <a
        href="#"
        className="inline-flex m-2 text-4xl font-medium items-center hover:underline dark:text-white"
      >
        {project.project}
      </a>
      {isTimerRunning && (
        <p className="mx-2 text-font-semibold tracking-tight text-gray-900 dark:text-white">
          Elapsed Time: {elapsedTime} seconds
        </p>
      )}
      <div className="flex items-center justify-center mt-4">
        <div className="flex flex-col items-center justify-center">
          {isTimerRunning ? (
            <button
              className="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={stopTimer}
            >
              <i className="fa-solid fa-circle-stop"></i>
            </button>
          ) : (
            <div>
              <button
                className="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={startTimer}
              >
                <i className="fa-solid fa-stopwatch dark:text-white"></i>
              </button>
            </div>
          )}
        </div>

        <div>
          {" "}
          <button
            className=" m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() =>
              window.ipcRenderer.openProjectDir(project.folderPath)
            }
          >
            <i className="fa-solid fa-folder-open"></i>
          </button>
        </div>
        <div>
          <Link
            to="/project"
            className="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <i className="fa-solid fa-arrow-right m-2 p-2"></i>
          </Link>
        </div>

        <div className="text-center">
          Total Hours Today: {calculateTotalHours()}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
