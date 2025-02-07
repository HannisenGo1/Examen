import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { SearchPartners } from './AccountFindParter';
import { useNavigate } from 'react-router-dom';
// CSS finns i index.css
export const AccountPage = () => {

  const navigate = useNavigate()

  const user = useUserStore((state) => state.user);
      const [isOpen,setIsOpen] = useState(false);
      const [isClosed,setIsClosed] = useState(false)

  useEffect(() => {
    console.log("Användardata har uppdaterats:", user);
  }, [user]); 
  if (!user) {
    return <div>Inga användardata tillgängliga</div>;
  }
  const toggleOpenInfo = () => {
    setIsOpen(!isOpen);
  };
  const toggleOpenSearch = () => {
    setIsClosed(!isClosed)
  }
const matchsite = () => {
  navigate('/match')
}
const messagesite = () => {
  navigate ('/messages')
}
const logout = () => {
  navigate ('/')
}
  
  return (
    <>
    <div className="logga">
      <img src={logga} alt="picture" className="img" />
    </div>
     
    <h1 className="Rubriktext"> 
      <span className="firstPart">KO</span>
      <span className="secondPart">NT</span>
      <span className="firstPart">O</span>
    </h1> 
  
    <div className="result-info"> 
      <button onClick={matchsite} className="btnmatchsite">Matchsidan</button> 
    <button onClick={messagesite} className="btnmatchsite">Meddelanden</button> 
    <button onClick={logout} className="btnmatchsite">Logga ut</button> 
       </div> 
    <h2 className="confirmation-message">
      Dina uppgifter: 
      <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>&#9660;</span>
    </h2>
    {isOpen && (
      <div className="container"> 
        <div className="columndiv2">
          <p><strong>Ditt namn: {user.firstName}</strong></p>
          <p><strong>Ålder: {user.age}</strong></p>
          <p><strong>Stad: {user.city}</strong></p>
          <p><strong>Kön: {user.gender}</strong></p>
          <p><strong>Sexuell läggning: {user.sexualOrientation}</strong></p>
        </div>
      </div>
    )}
  
    <h2 className="confirmation-message">
      Vilken partner söker du? 
      <span className={`arrow ${isClosed  ? 'open' : ''}`} onClick={toggleOpenSearch}>&#9660;</span>
    </h2>
  
    {isClosed && (   
      <SearchPartners/> 
    )}
  </>
  
  );
};
