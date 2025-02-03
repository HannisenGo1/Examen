import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Frontpage } from "./components/Frontpage";
import { Register } from "./components/registerAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} /> {/*  "/" */}
        <Route path="/register" element={<Register />} /> {/* "/register" */}
      </Routes>
    </Router>
  );
}

export default App;
