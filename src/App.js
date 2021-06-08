import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home/Home";

function App() {
  console.log("app was rendered");
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
