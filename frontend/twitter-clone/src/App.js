// import logo from './logo.svg';
import './App.css';
import Body from './Components/Body';
import {Toaster} from "react-hot-toast";
// import Home from './Components/Home';
function App() {
  return (
    <div className="App">
      {/* Lets build twitter clone */}
      <Body/>
      <Toaster/>
    </div>
  );
}

export default App;
