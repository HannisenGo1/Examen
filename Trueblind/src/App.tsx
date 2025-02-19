import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Frontpage } from "./components/Frontpage";
import { Register } from "./components/registerAccount";
import { AccountPage } from "./components/Account";
import { Login } from "./components/login";
import {MatchList} from "./components/MatchParter";
import { Messages } from "./components/Messages";
import { Chat } from "./components/Chat";
import { Afterlogin } from "./components/Afterlogin";
import { SearchHere } from "./components/SearchPartner";
import { Shop } from "./components/Shop";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Frontpage />} /> {/*  "Framsidan" */}
        <Route path="/register" element={<Register />} /> {/* "Registreringssidan" */}
        <Route path="/login" element={<Login/> } /> {/*  "Log in " */}
        <Route path="/homepage" element ={<Afterlogin /> }/>   {/*Val efter inloggning*/ }   
        <Route path="/account" element={<AccountPage/> } /> {/* "Kontosidan"*/}
        <Route path="/match"element={<MatchList/> } />  {/* Matchsidan*/ }
        <Route path="/messages"element={<Messages /> } /> {/* Förfrågningar,chattoption*/ }
        <Route path="/chat" element={<Chat /> } /> {/* "Chatt"*/}
   
      <Route path="/Findpartner" element ={ <SearchHere /> } /> 
        <Route path="/chat/:chatRoomId" element={<Chat />} /> {/* enskilda chatten */}
        <Route path="/shop" element={<Shop /> } /> {/* Affären */}
      </Routes>
    </Router>
  );
}

export default App;
