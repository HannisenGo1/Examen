import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Frontpage } from "./components/Frontpage";
import { Register } from "./components/registerAccount";
import { AccountPage } from "./components/Account";
import { Login } from "./components/login";
import {MatchList} from "./components/MatchParter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} /> {/*  "Framsidan" */}
        <Route path="/register" element={<Register />} /> {/* "Registreringssidan" */}
        <Route path="/login" element={<Login/> } /> {/*  "Log in " */}
        <Route path="/account" element={<AccountPage/> } /> {/*  "Kontosidan" */}
        <Route path="/match"element={<MatchList/> } /> 
      </Routes>
    </Router>
  );
}

export default App;
