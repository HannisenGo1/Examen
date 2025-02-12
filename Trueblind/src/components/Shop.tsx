
import { useNavigate } from "react-router-dom";
import logga from '../img/logga.png';

export const Shop = () => {
  const navigate = useNavigate();


  const handleToAccount = () => navigate('/account');


  return (
    <>
      <div className="logga">
        <img src={logga} alt="logo" className="img" />
      </div>
      <button onClick={handleToAccount} className="btnback">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h1 className="Rubriktext">
        <span className="firstPart">SHO</span>
        <span className="secondPart">PEN</span>
      </h1>
      <p>Kredit:</p>
      <p>Köp kredit genom Swish:</p>
      <p>10 krediter för 20 kronor</p>
      <p>20 krediter för 40 kronor</p>
      <p>50 krediter för 90 kronor</p>
      <p>100 krediter för 165 kronor</p>



      <div>OLIKA EMOJIS</div>
    </>
  );
};
