import logga from '../img/logga.png'
import { useNavigate } from 'react-router-dom';
import { getAuth} from "firebase/auth";


export const Frontpage = () => {
const auth = getAuth();  
  const navigate = useNavigate();

const handleRegisterClick = () => {
  navigate('/register'); 
};
const handleLoginClick = () => {
  navigate('/login');
}

const handleLogout = async () => {
  try {
    await auth.signOut();
    console.log("Användaren har loggat ut.");
  } catch (error) {
    console.error("Fel vid utloggning:", error);
  }
};

return (
  <>
    <div className="logga">
      <img src={logga} alt="picture" className="img" />
    </div>

    <div className="DivforRubrik">  
      <h1 className="Rubriktext">
        <span className="firstPart">Find your</span>
        <span className="secondPart">true</span>
        <span className="firstPart"> match</span>
      </h1>
    </div>
        
    <div className="btncontainer"> 
      <button className="accountBtn"onClick={handleLoginClick}> Logga in </button> 
      <button className="accountBtn"onClick={handleRegisterClick}> Registrera dig </button> 
      <button onClick={handleLogout }> Logga ut </button> 
    </div> 

    <div className="frontpagetextDiv"> 
      <h2 className="welcometexttopage">
        Vi hjälper dig att hitta äkta förbindelser baserat på känslor och 
        gemensamma värderingar, utan att döma utifrån yttre faktorer. 
        Öppna ditt hjärta och låt känslorna leda dig till din sanna match. 
        Hitta din dröm partner här!
      </h2>
    </div> 


  </>
);

}