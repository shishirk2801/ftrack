import Projects from "./projects";
import AddProject from "./addProject";

const Home = () => {
  return (
    <div className="p-4 bg-dark border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 ">
      <div className="flex mt-4">
        <AddProject />
        <Projects />
      </div>
    </div>
  );
};

export default Home;
