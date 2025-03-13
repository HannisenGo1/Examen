import { useEffect, useState } from 'react';
import logga from '../img/logga.png';
import { useUserStore } from '../storage/storage';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import {auth,db} from './data/firebase'
import { DeleteUser } from './data/UserAuth';
import { isVIPExpired } from './VipUser';

import { getDaysLeft } from './DaysCounterVip';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateUserInDatabase } from './data/UpdateDatabase';


export const AccountPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { setUser } = useUserStore();
  const [message,setMessage] = useState('')
  const [showConfirm,setShowConfirm]= useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    city: false,
    sexualOrientation: false,
    
  });
  const [updatedUserData, setUpdatedUserData] = useState({
    city: user ? user.city : '',
    sexualOrientation: user ? user.sexualOrientation : '',
    
  });
  
  
  const doSignOut = async () => {
    try {
      const user = auth.currentUser;
      
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          'status.online': false,
          'status.lastLogout': serverTimestamp() 
        });
      }
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Fel vid utloggning:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      setUpdatedUserData({
        city: user.city,
        sexualOrientation: user.sexualOrientation,
      });
    }
  }, [user]);
  
  if (!user) {
    return <div>Inga användardata tillgängliga</div>;
  }
  
  const toggleOpenInfo = () => {
    setIsOpen(!isOpen);
  };
  
  const handleEditClick = (field: string) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };
  const handleBlur = (field: string) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleDelete = async () => {
    try {
      if (!auth.currentUser) {
        console.error("Ingen användare inloggad!");
        return;
      }
      await DeleteUser(auth.currentUser.uid);
      
    } catch (error) {
      console.error("Misslyckades att radera kontot:", error);
    }
  }
  // @ts-ignore
  const hasActiveVipPlus = user.vipPlusStatus && (user.vipPlusExpiry ? !isVIPExpired(user.vipPlusExpiry) : true);
  // @ts-ignore
  const hasActiveVip = user.vipStatus && (user.vipExpiry ? !isVIPExpired(user.vipExpiry) : true);
  
  
  
  const calculateAge = (year: number, month: number, day: number): number => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    
    if (
      today.getMonth() < birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--; 
    }
    
    return age;
  };
  
  // uppdaterar i databasen, sedan i zustand (lokalt)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Ändringarna har sparats!');
    
    const updatedUser = {
      ...user,
      city: updatedUserData.city,
      sexualOrientation: updatedUserData.sexualOrientation,
    };
    
    try {
      await updateUserInDatabase(updatedUser);
      setUser(updatedUser); 
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
    }
  };
  useEffect(() => {
    
  }, [user]);
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
    
    
    <div className="buttondivforback">
    <button className="btnback" onClick={() => navigate('/homepage')}>
    <i className="fas fa-arrow-left"></i>
    </button>
    </div>
    
    {/* Navigering */}
    <div className="result-info">
    <button onClick={doSignOut} className="btnmatchsite">Logga ut</button>
    </div>
    <div className="result-info">
    <button onClick={() => navigate('/match')} className="btnmatchsite">Dina Gillade</button>
    <button onClick={() => navigate('/messages')} className="btnmatchsite">Meddelanden & Förfrågningar</button>
    <button onClick={() => navigate('/shop')} className="btnmatchsite">Till shoppen</button>
    </div>
    
    {/* information */}
    <h2 className="confirmation-message">
    Dina uppgifter:
    <span className={`arrow ${isOpen ? 'open' : ''}`} onClick={toggleOpenInfo}>
    &#9660;
    </span>
    </h2>
    
    {isOpen && (
      <div className="columndiv2">
      <p><strong>Ditt namn: {user.firstName}</strong></p>
      <p>
      <strong>
      Ålder: {user?.age?.year && user?.age?.month && user?.age?.day 
        ? calculateAge(
          Number(user.age.year), 
          Number(user.age.month), 
          Number(user.age.day)
        ) 
        : 'Ej angivet'}
        </strong>
        </p>
        
        
        
        {user.vipPlusStatus ? (
          <p>
          Du har <strong>VIP Plus</strong>, <strong>  {getDaysLeft(user.vipPlusExpiry ?? null)}</strong> dagar kvar.
          {getDaysLeft(user.vipPlusExpiry ?? null) > 0 
            ? '' 
            : 'Din VIP Plus har gått ut.'}
            </p>
          ) : user.vipStatus ? (
            <p>
            Du har <strong>VIP</strong>, <strong> {getDaysLeft(user.vipExpiry ?? null)}</strong>dagar kvar.
            {getDaysLeft(user.vipExpiry ?? null) > 0 
              ? '' 
              : 'Din VIP har gått ut.'}
              </p>
            ) : (
              <p>Du har ingen aktiv VIP.</p>
            )}
            
            
            <p>
            <strong>Stad:</strong>
            {isEditing.city ? (
              <input
              type="text"
              id="city"
              name="city"
              value={updatedUserData.city}
              onChange={handleChange}
              onBlur={() => handleBlur("city")}
              />
            ) : (
              <>
              {updatedUserData.city}
              <FaPen className="edit-icon" onClick={() => handleEditClick("city")} />
              </>
            )}
            </p>
            
            <p>
            <strong>Sexuell läggning:</strong>
            {isEditing.sexualOrientation ? (
              <select
              id="sexualOrientation"
              name="sexualOrientation"
              value={updatedUserData.sexualOrientation}
              onChange={handleChange}
              onBlur={() => handleBlur("sexualOrientation")}
              >
              <option value="">Välj sexuell läggning</option>
              <option value="Hetero">Hetero</option>
              <option value="Homo">Homo</option>
              <option value="Bi">Bisexuell</option>
              <option value="Other">Annat</option>
              </select>
            ) : (
              <>
              {updatedUserData.sexualOrientation || "Ej angiven"}
              <FaPen className="edit-icon" onClick={() => handleEditClick("sexualOrientation")} />
              </>
            )}
            </p>
            
            {/* Radera konto-knapp */}
            <button className="delete-btn" onClick={() => setShowConfirm(true)}>
            Radera konto?
            </button>
            
            {/* val om man är säker att radera sitt konto :)  */}
            
            {showConfirm && (
              <div className="confirmation-box">
              <p>Är du säker på att du vill radera ditt konto? <br />
              <span className="text-red">Hela kontot kommer att raderas.</span>
              </p>
              <div className="optiondeletecancel">
              <button className="cancel-btn" onClick={() => setShowConfirm(false)} >
              Avbryt
              </button>
              <button className="delete-btn" onClick={handleDelete} >
              Radera
              </button>
              </div>
              </div>
            )}
            
            {/* Spara-knapp */}
            <button type="submit" className="accountBtn" onClick={handleSubmit}>
            Spara
            </button>
            {message && <p>{message}</p>}
            </div>
          )}
          </>
        );
      };
      