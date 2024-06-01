import "./App.css";
import Navbar from "./components/header/navbar";
import Home from "./components/project/home";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="w-full">
        <Home />
      </div>
    </div>
  );
}

export default App;
