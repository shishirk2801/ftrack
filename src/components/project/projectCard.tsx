import { useState } from "react";
import { Link } from "react-router-dom";

const ProjectCard = (props) => {
  const { projectName, projectPath } = props;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  let timer;

  const startTimer = () => {
    setIsTimerRunning(true);
    timer = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setIsTimerRunning(false);
    setElapsedTime(0);
  };

  return (
    <div className="max-w-sm mx-2 my-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
      <a
        href="#"
        className="inline-flex m-2 text-4xl font-medium items-center hover:underline dark:text-white"
      >
        {projectName}
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
            onClick={() => window.ipcRenderer.openProjectDir(projectPath)}
          >
            <i className="fa-solid fa-folder-open"></i>
          </button>
        </div>
        <Link
          to="/project"
          className="m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
