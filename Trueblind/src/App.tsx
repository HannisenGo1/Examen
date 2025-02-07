import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Frontpage } from "./components/Frontpage";
import { Register } from "./components/registerAccount";
import { AccountPage } from "./components/Account";
import { Login } from "./components/login";
import {MatchList} from "./components/MatchParter";
import { Messages } from "./components/Messages";
import { Chat } from "./components/Chat";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} /> {/*  "Framsidan" */}
        <Route path="/register" element={<Register />} /> {/* "Registreringssidan" */}
        <Route path="/login" element={<Login/> } /> {/*  "Log in " */}
        <Route path="/account" element={<AccountPage/> } /> {/*  "Kontosidan" */}
        <Route path="/match"element={<MatchList/> } /> 
        <Route path="/messages"element={<Messages /> } /> 
        <Route path="/chat" element={<Chat /> } /> 
        <Route path="/chat/:chatRoomId" element={<Chat />} /> {/* enskild chatt */}
      </Routes>
    </Router>
  );
}

export default App;
