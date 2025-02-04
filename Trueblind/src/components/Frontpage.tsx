import logga from '../img/logga.png'
import { useNavigate } from 'react-router-dom';
export interface frontbutton {
  loginbtn: () => void;
  registerbtn: () => void;
}



// ({loginbtn, registerbtn}: frontbutton)
export const Frontpage = () => {

  const navigate = useNavigate();

const handleRegisterClick = () => {
  navigate('/register'); 
};
const handleLoginClick = () => {
  navigate('/login');
}



    return(
        <> 
           <div className="logga">
        <img src={logga} alt="picture" className="img" />
      </div>

      <div className="DivforRubrik">  
  <h1 className="Rubriktext">
    <span className="firstPart">Find yo</span>
    <span className="secondPart">ur tru</span>
    <span className="firstPart">e match</span>
  </h1>
</div>
       
        <div className="btncontainer"> 
            <button onClick={handleLoginClick}> Logga in </button> 
            <button onClick={handleRegisterClick}> Registrera dig </button> 
            </div> 
          <div className="frontpagetextDiv"> 
        <h2 className="welcometexttopage">
        Vi hjälper dig att hitta äkta förbindelser baserat på känslor och gemensamma värderingar, 
        utan att döma utifrån yttre faktorer. 
        Öppna ditt hjärta och låt känslorna leda dig till din sanna match. 
        Hitta din dröm partner här!</h2> </div> 
      <div className="Footer"> 
        <h3> Developer: Hanna Karlsson </h3> 
        </div> 
        
        </>
    )
}